import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDarkMode } from './hooks/useDarkMode.js';
import { useBookmarks } from './hooks/useBookmarks.js';
import { Navbar } from './components/Navbar.jsx';
import { Home } from './pages/Home.jsx';
import { SearchResults } from './pages/SearchResults.jsx';
import { SavedPapers } from './pages/SavedPapers.jsx';
import { About } from './pages/About.jsx';

export default function App() {
  const { theme, toggleTheme } = useDarkMode();
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col justify-between">
        <div>
          <Navbar
            theme={theme}
            toggleTheme={toggleTheme}
            bookmarkCount={bookmarks.length}
          />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/search"
                element={
                  <SearchResults
                    bookmarks={bookmarks}
                    onToggleBookmark={toggleBookmark}
                    isBookmarked={isBookmarked}
                  />
                }
              />
              <Route
                path="/saved"
                element={
                  <SavedPapers
                    bookmarks={bookmarks}
                    onToggleBookmark={toggleBookmark}
                    isBookmarked={isBookmarked}
                  />
                }
              />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>

        <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Research Paper Finder • Powered by OpenAlex API
        </footer>
      </div>
    </BrowserRouter>
  );
}