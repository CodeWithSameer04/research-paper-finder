import React from 'react';

export function SkeletonCard() {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse space-y-4">
      <div className="flex justify-between items-start">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
        <div className="h-6 w-6 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
      <div className="space-y-2 py-2">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-20"></div>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-24"></div>
      </div>
    </div>
  );
}