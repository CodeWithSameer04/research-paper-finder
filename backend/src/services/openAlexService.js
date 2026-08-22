import axios from 'axios';
import { reconstructAbstract } from '../utils/formatters.js';
import { normalizeQuery } from '../utils/queryNormalizer.js';

const OPENALEX_WORKS_URL = 'https://api.openalex.org/works';

/**
 * Weights and ranks results based on title matches, abstract matches, and academic citation impact.
 * Ensures foundational papers and direct topical works appear at the top for relevance searches.
 *
 * @param {Array} results - The normalized list of paper objects
 * @param {string} searchQuery - The normalized search query
 * @returns {Array} - Re-ranked array of papers
 */
function rankResultsByTitleAbstractAndImpact(results, searchQuery) {
  if (!searchQuery || !Array.isArray(results) || results.length === 0) {
    return results;
  }

  const cleanQuery = searchQuery.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
  const queryTokens = cleanQuery.split(/\s+/).filter((token) => token.length > 1);

  if (queryTokens.length === 0) {
    return results;
  }

  const scored = results.map((paper) => {
    const titleLower = (paper.title || '').toLowerCase();
    const titleClean = titleLower.replace(/[^a-z0-9]/g, ' ');
    const titleWords = titleClean.split(/\s+/).filter(Boolean);

    const abstractLower = (paper.abstract || '').toLowerCase();
    const abstractClean = abstractLower.replace(/[^a-z0-9]/g, ' ');

    // 1. Title Phrase & Token Matching (high weight for title presence)
    const exactPhraseInTitle = titleClean.includes(cleanQuery);
    const titleMatchedCount = queryTokens.filter((t) => titleWords.includes(t)).length;
    const titleMatchRatio = titleMatchedCount / queryTokens.length;

    // 2. Abstract Phrase & Token Matching
    const phraseInAbstract = abstractClean.includes(cleanQuery);
    const abstractMatchedCount = queryTokens.filter((t) => abstractClean.includes(t)).length;
    const abstractMatchRatio = abstractMatchedCount / queryTokens.length;

    // 3. Concepts / Subject Topic Matching
    const conceptsText = (paper.concepts || []).map((c) => c.name.toLowerCase()).join(' ');
    const conceptMatchedCount = queryTokens.filter((t) => conceptsText.includes(t)).length;
    const conceptBonus = conceptMatchedCount > 0 ? 0.3 : 0;

    // 4. Citation Impact Scaling (logarithmic to boost landmark literature without overshadowing relevance)
    const citationCount = Number(paper.citationCount) || 0;
    const citationBoost = Math.log10(citationCount + 10) / 2;

    // Base upstream score from OpenAlex
    const baseRelevance = paper._rawRelevanceScore || 1;

    let titleMultiplier = 1.0;
    if (exactPhraseInTitle) {
      titleMultiplier += 2.5;
    } else if (titleMatchRatio > 0.5) {
      titleMultiplier += titleMatchRatio * 1.8;
    }

    let abstractMultiplier = 1.0;
    if (phraseInAbstract) {
      abstractMultiplier += 0.8;
    } else if (abstractMatchRatio > 0.5) {
      abstractMultiplier += abstractMatchRatio * 0.5;
    }

    const compositeScore =
      baseRelevance *
      titleMultiplier *
      abstractMultiplier *
      (1 + conceptBonus) *
      (0.85 + citationBoost * 0.15);

    return {
      ...paper,
      _relevanceScore: compositeScore
    };
  });

  return scored.sort((a, b) => b._relevanceScore - a._relevanceScore);
}

export async function fetchPapersFromOpenAlex({
  query,
  page = 1,
  perPage = 10,
  sort = 'relevance',
  year,
  openAccess = false
}) {
  // 1. Normalize query and check for spelling variations/aliases
  const {
    normalizedQuery,
    wasCorrected,
    suggestedTerm
  } = normalizeQuery(query);

  const effectiveQuery = normalizedQuery || query.trim();

  // 2. Explicitly map sort parameter to OpenAlex syntax
  let openAlexSort = 'relevance_score:desc';
  if (sort === 'date') {
    openAlexSort = 'publication_date:desc';
  } else if (sort === 'citations') {
    openAlexSort = 'cited_by_count:desc';
  } else if (sort && sort !== 'relevance') {
    openAlexSort = sort;
  }

  // 3. Assemble Axios query parameters for OpenAlex works endpoint
  const params = {
    search: effectiveQuery,
    page: Number(page) || 1,
    per_page: Number(perPage) || 10,
    sort: openAlexSort
  };

  // Construct filters array dynamically
  const filters = [];

  if (year && String(year).trim()) {
    filters.push(`publication_year:${String(year).trim()}`);
  }

  if (openAccess === true || openAccess === 'true') {
    filters.push('is_oa:true');
  }

  if (filters.length > 0) {
    params.filter = filters.join(',');
  }

  // Configure User-Agent header (required by OpenAlex polite pool)
  const contactEmail = process.env.APP_EMAIL || process.env.OPENALEX_EMAIL || 'your-email@example.com';
  const userAgent = process.env.OPENALEX_USER_AGENT || `mailto:${contactEmail}`;

  const headers = {
    'User-Agent': userAgent
  };

  if (process.env.OPENALEX_API_KEY) {
    params.api_key = process.env.OPENALEX_API_KEY;
  }

  let response;
  try {
    response = await axios.get(OPENALEX_WORKS_URL, {
      params,
      headers,
      timeout: 10000
    });
  } catch (err) {
    // If normalized search failed with an error and was corrected, fallback to original
    if (wasCorrected) {
      params.search = query.trim();
      response = await axios.get(OPENALEX_WORKS_URL, {
        params,
        headers,
        timeout: 10000
      });
    } else {
      throw err;
    }
  }

  let { meta, results } = response.data;

  // Fallback: If 0 results returned for corrected query, attempt search with raw original query
  if ((!results || results.length === 0) && wasCorrected) {
    try {
      params.search = query.trim();
      const fallbackResponse = await axios.get(OPENALEX_WORKS_URL, {
        params,
        headers,
        timeout: 10000
      });
      if (fallbackResponse.data?.results?.length > 0) {
        results = fallbackResponse.data.results;
        meta = fallbackResponse.data.meta;
      }
    } catch {
      // Ignore fallback error and retain initial empty results
    }
  }

  let normalizedResults = (results || []).map((work) => {
    const authors = (work.authorships || [])
      .map((item) => item.author?.display_name)
      .filter(Boolean);

    const concepts = (work.concepts || [])
      .slice(0, 5)
      .map((c) => ({
        id: c.id,
        name: c.display_name,
        score: c.score
      }));

    return {
      id: work.id,
      title: work.title || 'Untitled Research Work',
      authors: authors.length > 0 ? authors : ['Unknown Authors'],
      publicationYear: work.publication_year || 'N/A',
      publicationDate: work.publication_date || 'N/A',
      journal: work.primary_location?.source?.display_name || work.host_venue?.name || 'Not specified',
      doi: work.doi || null,
      abstract: reconstructAbstract(work.abstract_inverted_index),
      citationCount: work.cited_by_count || 0,
      openAccess: Boolean(work.open_access?.is_oa),
      paperUrl: work.primary_location?.landing_page_url || work.doi || null,
      pdfUrl: work.open_access?.oa_url || null,
      concepts,
      _rawRelevanceScore: work.relevance_score || 1
    };
  });

  // Apply title, abstract, and citation impact weighting when sorting by relevance
  if (sort === 'relevance' || !sort) {
    normalizedResults = rankResultsByTitleAbstractAndImpact(normalizedResults, effectiveQuery);
  }

  return {
    query,
    normalizedQuery: effectiveQuery,
    wasCorrected,
    suggestedTerm,
    results: normalizedResults,
    pagination: {
      page: Number(page),
      perPage: Number(perPage),
      total: meta?.count || 0,
      totalPages: Math.ceil((meta?.count || 0) / Number(perPage))
    }
  };
}