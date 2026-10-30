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
    setFavorites(prev => {
      const exists = prev.some(w => w.id === wallpaper.id);
      if (exists) {
        return prev.filter(w => w.id !== wallpaper.id);
      } else {
        return [...prev, wallpaper];
      }
    });
  };

  const isFavorite = (id) => favorites.some(w => w.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
