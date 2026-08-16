import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, ExternalLink, Quote, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export function PaperCard({ paper, isBookmarked, onToggleBookmark, onSelectPaper }) {
  const [showFullAbstract, setShowFullAbstract] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 transition hover:shadow-lg dark:hover:border-slate-700 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 
            onClick={() => onSelectPaper(paper)}
            className="text-lg font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer transition"
          >
            {paper.title}
          </h3>
          <button
            onClick={() => onToggleBookmark(paper)}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark paper'}
            className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 p-1 transition flex-shrink-0"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-6 h-6 text-brand-600 dark:text-brand-400 fill-brand-100 dark:fill-brand-950" />
            ) : (
              <Bookmark className="w-6 h-6" />
            )}
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
          {paper.authors.slice(0, 4).join(', ')}{paper.authors.length > 4 ? ' et al.' : ''} • {paper.publicationYear}
        </p>

        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 italic">
          {paper.journal}
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          {paper.openAccess && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Open Access
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
            <Quote className="w-3 h-3" /> {paper.citationCount} citations
          </span>
          {paper.concepts?.slice(0, 2).map((concept) => (
            <span
              key={concept.id}
              className="px-2 py-0.5 rounded-full text-xs font-medium bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
            >
              {concept.name}
            </span>
          ))}
        </div>

        <div className="mt-4">
          <p className={`text-sm text-slate-600 dark:text-slate-300 leading-relaxed ${!showFullAbstract ? 'line-clamp-3' : ''}`}>
            {paper.abstract}
          </p>
          {paper.abstract !== 'Abstract not available.' && (
            <button
              onClick={() => setShowFullAbstract(!showFullAbstract)}
              className="mt-1 text-xs font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1 hover:underline"
            >
              {showFullAbstract ? (
                <>Show less <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>Read full abstract <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => onSelectPaper(paper)}
          className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" /> Paper Details
        </button>

        <div className="flex items-center gap-2">
          {paper.doi && (
            <a
              href={paper.doi}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
            >
              DOI
            </a>
          )}
          {paper.paperUrl && (
            <a
              href={paper.paperUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg flex items-center gap-1 transition"
            >
              <span>View Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}