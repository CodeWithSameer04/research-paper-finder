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
  const filters = [];

  if (query && query.trim()) {
    filters.push(`default.search:${encodeURIComponent(query.trim())}`);
  }

  if (year && year.trim()) {
    filters.push(`publication_year:${year.trim()}`);
  }

  if (openAccess) {
    filters.push('is_oa:true');
  }

  let sortQuery = 'relevance_score:desc';
  if (sort === 'date') {
    sortQuery = 'publication_date:desc';
  } else if (sort === 'citations') {
    sortQuery = 'cited_by_count:desc';
  }

  const params = {
    filter: filters.join(','),
    page,
    'per-page': perPage,
    sort: sortQuery
  };

  const response = await axios.get(OPENALEX_WORKS_URL, {
    params,
    headers: {
      'User-Agent': `mailto:${process.env.APP_EMAIL || 'user@example.com'}`
    },
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