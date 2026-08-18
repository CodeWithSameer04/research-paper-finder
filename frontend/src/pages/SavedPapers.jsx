import React, { useState } from 'react';
import { PaperCard } from '../components/PaperCard.jsx';
import { PaperDetailsModal } from '../components/PaperDetailsModal.jsx';
import { Bookmark, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SavedPapers({ bookmarks, onToggleBookmark, isBookmarked }) {
  const [selectedPaper, setSelectedPaper] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 mb-8 gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Saved Papers Library
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Locally saved articles stored in your browser's storage.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700">
          {bookmarks.length} {bookmarks.length === 1 ? 'Paper' : 'Papers'} Saved
        </span>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">No saved papers yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">
            Bookmark papers while exploring research topics to review them anytime.
          </p>
          <Link
            to="/"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition"
          >
            Start Searching
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              isBookmarked={isBookmarked(paper.id)}
              onToggleBookmark={onToggleBookmark}
              onSelectPaper={setSelectedPaper}
            />
          ))}
        </div>
      )}

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