import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchResearch } from '../services/api.js';
import { PaperCard } from '../components/PaperCard.jsx';
import { PaperDetailsModal } from '../components/PaperDetailsModal.jsx';
import { SkeletonCard } from '../components/SkeletonCard.jsx';
import { DashboardCharts } from '../components/DashboardCharts.jsx';
import { Search, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

export function SearchResults({ bookmarks, onToggleBookmark, isBookmarked }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [inputQuery, setInputQuery] = useState(query);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [perPage, setPerPage] = useState(Number(searchParams.get('perPage')) || 10);
  const [sort, setSort] = useState(searchParams.get('sort') || 'relevance');
  const [year, setYear] = useState(searchParams.get('year') || '');
  const [openAccess, setOpenAccess] = useState(searchParams.get('openAccess') === 'true');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({ results: [], pagination: { total: 0 } });
  const [selectedPaper, setSelectedPaper] = useState(null);

  useEffect(() => {
    setInputQuery(query);
  }, [query]);

  const loadData = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetchResearch({
        q: query,
        page,
        perPage,
        sort,
        year: year || undefined,
        openAccess
      });
      setData(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Sync URL
    setSearchParams({
      q: query,
      page: String(page),
      perPage: String(perPage),
      sort,
      ...(year ? { year } : {}),
      ...(openAccess ? { openAccess: 'true' } : {})
    });
  }, [query, page, perPage, sort, year, openAccess]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      setPage(1);
      setSearchParams({ q: inputQuery.trim() });
    }
  };

  const totalPages = Math.ceil((data.pagination?.total || 0) / perPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Search Header Bar */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 max-w-3xl mb-8 items-stretch">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Search papers, concepts, or authors..."
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-brand-500"
          />
        </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-sm transition mt-2 sm:mt-0"
          >
            Search
          </button>
      </form>

      {/* Filter / Sort Control Strip */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl mb-6">
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
            >
              <option value="relevance">Relevance</option>
              <option value="citations">Most Cited</option>
              <option value="date">Newest Date</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span>Year:</span>
            <input
              type="number"
              placeholder="e.g. 2023"
              value={year}
              onChange={(e) => { setYear(e.target.value); setPage(1); }}
              className="w-24 sm:w-28 bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-2.5 py-1.5 outline-none"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={openAccess}
              onChange={(e) => { setOpenAccess(e.target.checked); setPage(1); }}
              className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
            <span>Open Access Only</span>
          </label>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 mt-2 md:mt-0">
          <span>Results per page:</span>
          <select
            value={perPage}
            onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
            className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* Error Alert State */}
      {error && (
        <div className="p-4 mb-6 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center justify-between text-red-700 dark:text-red-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-red-100 dark:bg-red-900/60 rounded-lg hover:bg-red-200 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Query Normalization Notice */}
      {!loading && !error && data.wasCorrected && data.suggestedTerm && (
        <div className="mb-6 px-4 py-3 bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900 rounded-xl text-xs text-brand-800 dark:text-brand-300 flex items-center justify-between">
          <span>
            Showing results for <strong className="font-semibold">{data.suggestedTerm}</strong> (normalized from <em>"{data.query}"</em>)
          </span>
        </div>
      )}

      {/* Visual Analytics Dashboard */}
      {!loading && !error && data.results.length > 0 && (
        <DashboardCharts papers={data.results} totalCount={data.pagination.total} />
      )}

      {/* Main Results Grid */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: perPage }).map((_, i) => <SkeletonCard key={i} />)
        ) : data.results.length > 0 ? (
          data.results.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              isBookmarked={isBookmarked(paper.id)}
              onToggleBookmark={onToggleBookmark}
              onSelectPaper={setSelectedPaper}
            />
          ))
        ) : !error && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">No research papers found</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Try adjusting your query keywords or clearing active filters.
            </p>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {!loading && data.results.length > 0 && (
        <div className="mt-8 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing Page <span className="font-semibold text-slate-800 dark:text-slate-200">{page}</span> of{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{totalPages || 1}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Detailed Modal */}
      {selectedPaper && (
        <PaperDetailsModal
          paper={selectedPaper}
          isBookmarked={isBookmarked(selectedPaper.id)}
          onToggleBookmark={onToggleBookmark}
          onClose={() => setSelectedPaper(null)}
        />
      )}
    </div>
  );
}