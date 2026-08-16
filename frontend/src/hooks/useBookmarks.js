import { useState, useEffect } from 'react';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const stored = localStorage.getItem('saved_research_papers');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('saved_research_papers', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (paper) => {
    setBookmarks((prev) => {
      const exists = prev.some((item) => item.id === paper.id);
      if (exists) {
        return prev.filter((item) => item.id !== paper.id);
      }
      return [paper, ...prev];
    });
  };

  const isBookmarked = (id) => bookmarks.some((item) => item.id === id);

  return { bookmarks, toggleBookmark, isBookmarked };
}