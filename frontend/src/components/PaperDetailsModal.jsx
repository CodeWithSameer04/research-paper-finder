import React from 'react';
import { X, ExternalLink, BookOpen, Quote, Calendar, BookmarkCheck, Bookmark } from 'lucide-react';

export function PaperDetailsModal({ paper, onClose, isBookmarked, onToggleBookmark }) {
  if (!paper) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {paper.openAccess && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Open Access
                </span>
              )}
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {paper.doi ? paper.doi.replace('https://doi.org/', 'doi:') : 'No DOI'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {paper.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-3 sm:p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-1">
              Authors
            </h4>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {paper.authors.join(', ')}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <div>
              <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5" /> Published
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {paper.publicationDate || paper.publicationYear}
              </p>
            </div>
            <div>
              <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Quote className="w-3.5 h-3.5" /> Citations
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {paper.citationCount.toLocaleString()}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <BookOpen className="w-3.5 h-3.5" /> Venue / Source
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate" title={paper.journal}>
                {paper.journal}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-2">
              Abstract
            </h4>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {paper.abstract}
            </div>
          </div>

          {paper.concepts && paper.concepts.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-2">
                Research Fields & Concepts
              </h4>
              <div className="flex flex-wrap gap-2">
                {paper.concepts.map((c) => (
                  <span
                    key={c.id}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:justify-between bg-slate-50 dark:bg-slate-900/50 gap-3">
          <button
            onClick={() => onToggleBookmark(paper)}
            className="flex items-center gap-2 px-4 py-3 sm:py-2 rounded-xl text-sm font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition touch-manipulation"
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Saved to Library</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Save Paper</span>
              </>
            )}
          </button>

          <div className="flex flex-wrap items-center gap-3">
            {paper.doi && (
              <a
                href={paper.doi}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 sm:py-2 rounded-xl text-sm font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition touch-manipulation"
              >
                View DOI
              </a>
            )}
            {paper.paperUrl && (
              <a
                href={paper.paperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
              >
                <span>Read Full Article</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}