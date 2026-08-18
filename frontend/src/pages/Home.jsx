import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Compass, BookCheck, LineChart } from 'lucide-react';

const POPULAR_SEARCHES = [
  'Artificial Intelligence',
  'Machine Learning',
  'Computer Vision',
  'Natural Language Processing',
  'Cybersecurity',
  'Quantum Computing',
  'Renewable Energy'
];

export function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/search?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Discover Research. <span className="text-brand-600 dark:text-brand-400">Explore Knowledge.</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Search millions of scholarly works and discover research papers across disciplines.
        </p>
      </div>

      {/* Main Search Input */}
      <form onSubmit={handleSearch} className="mt-10 max-w-3xl mx-auto">
        <div className="relative flex flex-col sm:flex-row items-stretch">
          <Search className="absolute left-5 top-4 w-6 h-6 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search research topics, papers, authors, or keywords..."
            className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none text-base sm:text-lg transition"
          />
          <button
            type="submit"
            className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-3 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition"
          >
            Search
          </button>
        </div>
      </form>

      {/* Popular Queries */}
      <div className="mt-8 text-center">
        <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-3">
          Popular Topics
        </p>
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
          {POPULAR_SEARCHES.map((topic) => (
            <button
              key={topic}
              onClick={() => handleTagClick(topic)}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="mt-24 pt-16 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-center text-xs uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-xl flex items-center justify-center mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">1. Search</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Submit your topic, author, or keyword. Requests pass seamlessly through our Express API gateway to OpenAlex.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-xl flex items-center justify-center mb-4">
              <LineChart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">2. Discover</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Filter by year, sort by citations, review metrics, and inspect interactive publication charts.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-xl flex items-center justify-center mb-4">
              <BookCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">3. Explore</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Save papers to your personal library, read detailed abstracts, and navigate directly to official DOI sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}