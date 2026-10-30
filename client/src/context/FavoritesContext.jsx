import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('aevion_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('aevion_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (wallpaper) => {
    if (!wallpaper) return;
    const targetId = wallpaper.id || wallpaper;
    setFavorites(prev => {
      const exists = prev.some(w => (w?.id || w) === targetId);
      if (exists) {
        return prev.filter(w => (w?.id || w) !== targetId);
      } else {
        return [...prev, wallpaper];
      }
    });
  };

  const isFavorite = (id) => {
    if (!id || !Array.isArray(favorites)) return false;
    return favorites.some(w => (w?.id || w) === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
