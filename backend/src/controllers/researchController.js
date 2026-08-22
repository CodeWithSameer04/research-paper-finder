import { fetchPapersFromOpenAlex } from '../services/openAlexService.js';

export async function getResearchPapers(req, res) {
  try {
    // 1. Extract 'q', 'page', 'perPage', 'sort', 'year', and 'openAccess' from req.query
    const {
      q,
      page = 1,
      perPage = 10,
      sort = 'relevance',
      year,
      openAccess
    } = req.query;

    // Validate that the search query is provided
    if (!q || !q.trim()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Search query parameter "q" is required and cannot be empty.'
      });
    }

    // Sanitize pagination and filter parameters
    const sanitizedPage = Math.max(parseInt(page, 10) || 1, 1);
    const sanitizedPerPage = Math.min(Math.max(parseInt(perPage, 10) || 10, 1), 100);
    const isOpenAccess = openAccess === 'true' || openAccess === true;
    const sanitizedYear = year ? String(year).trim() : undefined;

    // 2. Call service to forward parameters dynamically to OpenAlex API
    const data = await fetchPapersFromOpenAlex({
      query: q.trim(),
      page: sanitizedPage,
      perPage: sanitizedPerPage,
      sort,
      year: sanitizedYear,
      openAccess: isOpenAccess
    });

    // 4. Return results cleanly to the frontend client
    return res.status(200).json(data);
  } catch (error) {
    // Catch and log any errors properly
    console.error('[Research Controller Error]:', error.response?.data || error.message);

    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        error: 'Gateway Timeout',
        message: 'The upstream research data service took too long to respond.'
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        error: 'Upstream API Error',
        message: error.response.data?.message || 'Error occurred while fetching research data from OpenAlex.'
      });
    }

    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve research paper data from provider.'
    });
  }
}