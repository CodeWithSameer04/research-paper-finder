import axios from 'axios';
import { reconstructAbstract } from '../utils/formatters.js';

const OPENALEX_WORKS_URL = 'https://api.openalex.org/works';

export async function fetchPapersFromOpenAlex({
  query,
  page = 1,
  perPage = 10,
  sort = 'relevance',
  year,
  openAccess = false
}) {
  // Dynamically assemble Axios query parameters for OpenAlex works endpoint
  const params = {
    search: query.trim(),
    page: Number(page) || 1,
    per_page: Number(perPage) || 10
  };

  // Map sort options to OpenAlex format
  if (sort === 'date') {
    params.sort = 'publication_date:desc';
  } else if (sort === 'citations') {
    params.sort = 'cited_by_count:desc';
  } else if (sort && sort !== 'relevance') {
    params.sort = sort;
  }

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

  const response = await axios.get(OPENALEX_WORKS_URL, {
    params,
    headers,
    timeout: 10000
  });

  const { meta, results } = response.data;

  const normalizedResults = (results || []).map((work) => {
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
      concepts
    };
  });

  return {
    query,
    results: normalizedResults,
    pagination: {
      page: Number(page),
      perPage: Number(perPage),
      total: meta?.count || 0,
      totalPages: Math.ceil((meta?.count || 0) / Number(perPage))
    }
  };
}