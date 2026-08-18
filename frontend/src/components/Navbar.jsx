import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bookmark, Sun, Moon, Info, Search } from 'lucide-react';
// Import your logo image from assets
import logoImage from '../assets/logo.png';

export function Navbar({ theme, toggleTheme, bookmarkCount }) {
  const location = useLocation();

  const navLinkClass = (path) =>
    `flex items-center gap-1.5 text-sm font-medium transition-colors px-2 py-2 rounded-md touch-manipulation ${
      location.pathname === path
        ? 'text-brand-600 dark:text-brand-400 font-semibold'
        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg">
          <img src={logoImage} alt="ResearchFinder Logo" className="w-8 h-8 object-contain rounded-lg" />
          <span className="hidden sm:inline">ResearchFinder</span>
        </Link>

        <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar px-2 sm:px-0">
          <Link to="/" className={navLinkClass('/')}>
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">Search</span>
          </Link>
          <Link to="/saved" className={navLinkClass('/saved')}>
            <Bookmark className="w-5 h-5" />
            <span className="hidden sm:inline">Saved</span>
            {bookmarkCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full font-semibold">
                {bookmarkCount}
              </span>
            )}
          </Link>
          <Link to="/about" className={navLinkClass('/about')}>
            <Info className="w-5 h-5" />
            <span className="hidden sm:inline">About</span>
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