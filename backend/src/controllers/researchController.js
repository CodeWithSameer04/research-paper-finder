import { fetchPapersFromOpenAlex } from '../services/openAlexService.js';

export async function getResearchPapers(req, res) {
  try {
    const {
      q,
      page = 1,
      perPage = 10,
      sort = 'relevance',
      year,
      openAccess
    } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Search query parameter "q" is required and cannot be empty.'
      });
    }

    const sanitizedPerPage = Math.min(Math.max(Number(perPage) || 10, 1), 50);
    const sanitizedPage = Math.max(Number(page) || 1, 1);

    const data = await fetchPapersFromOpenAlex({
      query: q.trim(),
      page: sanitizedPage,
      perPage: sanitizedPerPage,
      sort,
      year: year ? String(year) : undefined,
      openAccess: openAccess === 'true' || openAccess === true
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error('[API Controller Error]:', error.response?.data || error.message);

    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        error: 'Gateway Timeout',
        message: 'The upstream research data service took too long to respond.'
      });
    }

    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve research paper data from provider.'
    });
  }
}