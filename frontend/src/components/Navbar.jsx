import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Bookmark, Sun, Moon, Info } from 'lucide-react';

export function Navbar({ theme, toggleTheme, bookmarkCount }) {
  const location = useLocation();

  const navLinkClass = (path) =>
    `flex items-center gap-1.5 text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'text-brand-600 dark:text-brand-400 font-semibold'
        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
          <div className="p-2 bg-brand-600 rounded-lg text-white">
            <BookOpen className="w-5 h-5" />
          </div>
          <span>ResearchFinder</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className={navLinkClass('/')}>
            Search
          </Link>
          <Link to="/saved" className={navLinkClass('/saved')}>
            <Bookmark className="w-4 h-4" />
            <span>Saved</span>
            {bookmarkCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full font-semibold">
                {bookmarkCount}
              </span>
            )}
          </Link>
          <Link to="/about" className={navLinkClass('/about')}>
            <Info className="w-4 h-4" />
            <span>About</span>
          </Link>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </nav>
      </div>
    </header>
  );
}