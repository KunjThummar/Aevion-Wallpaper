import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { WallpaperCard } from '../components/wallpapers/WallpaperCard';
import { SEO } from '../components/common/SEO';
import { Heart, Compass, Trash2 } from 'lucide-react';

export const FavoritesPage = () => {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <SEO
        title="My Favorites"
        noindex={true}
        path="/favorites"
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Personal Bookmarks</span>
          </div>
          <h1 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            My Favorite Wallpapers ({favorites.length})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Wallpapers saved to your device for instant offline access and download.
          </p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-24 space-y-4 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 p-8">
          <Heart className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 stroke-[1.2]" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            No favorites saved yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any wallpaper card while browsing to save it to your personal collection.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Wallpapers</span>
          </Link>
        </div>
      ) : (
        <div className="masonry-grid">
          {favorites.map((wallpaper) => (
            <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
          ))}
        </div>
      )}
    </div>
  );
};
