import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, Compass, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';
import { WallpaperCard } from '../components/wallpapers/WallpaperCard';
import { WallpaperModal } from '../components/wallpapers/WallpaperModal';
import { AdSlot } from '../components/common/AdSlot';
import { SEO } from '../components/common/SEO';

const TRENDING_TAGS = ['nature', 'wallpapers', 'amoled', '3d renders', 'travel', 'cyberpunk', 'architecture', 'textures'];

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParam || '');
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);

  // Sync state with URL params
  useEffect(() => {
    if (searchParam !== null) {
      setSearchQuery(searchParam);
    }
  }, [searchParam]);

  useEffect(() => {
    const fetchWallpapers = async () => {
      setLoading(true);
      try {
        const params = {
          category: categoryParam && categoryParam !== 'all' ? categoryParam : undefined,
          search: searchParam ? searchParam.trim() : undefined,
          limit: 30
        };

        const res = await axios.get('/api/wallpapers', { params });
        if (res.data.success) {
          setWallpapers(res.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching wallpapers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWallpapers();
  }, [categoryParam, searchParam]);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery.trim() });
    }
  };

  const isBrowsingAll = !categoryParam && !searchParam;

  const pageTitle = searchParam
    ? `Wallpapers matching "${searchParam}"`
    : categoryParam
    ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)} Wallpapers`
    : undefined;

  const pageDescription = searchParam
    ? `Discover high quality 4K and 8K wallpapers matching "${searchParam}" on Aevion Wallpapers.`
    : categoryParam
    ? `Explore stunning free 4K and AMOLED ${categoryParam} wallpapers for mobile and desktop.`
    : undefined;

  return (
    <div className="min-h-screen">
      <SEO
        title={pageTitle}
        description={pageDescription}
        path="/"
      />

      {/* Unsplash Iconic Hero Section (Only shown on homepage root) */}
      {isBrowsingAll && (
        <section className="relative w-full h-[540px] sm:h-[580px] bg-slate-900 overflow-hidden flex items-center justify-center text-white">
          {/* Background Photo with Dark Vignette (Responsive optimized WebP/AVIF sizing) */}
          <picture className="absolute inset-0 w-full h-full">
            <source
              media="(max-width: 640px)"
              srcSet="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=720&q=75"
            />
            <source
              media="(max-width: 1024px)"
              srcSet="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1280&q=80"
            />
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80"
              alt="Aevion Wallpaper Gallery Hero"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-center filter brightness-75 scale-105"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center sm:text-left w-full space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
              Aevion
            </h1>
            <p className="text-base sm:text-lg text-white/90 font-medium max-w-xl leading-relaxed">
              The internet’s source for high-resolution visual wallpapers. Powered by creators and open domain archives everywhere.
            </p>

            {/* Expansive Hero Search Bar */}
            <div className="pt-2 max-w-2xl">
              <form onSubmit={handleHeroSearch} role="search" aria-label="Hero search" className="relative flex items-center shadow-2xl">
                <Search className="absolute left-4 w-5 h-5 text-slate-400" aria-hidden="true" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search high-resolution photos and wallpapers"
                  aria-label="Search high-resolution photos and wallpapers"
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-white text-slate-900 placeholder-slate-500 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-black/20"
                />
              </form>

              {/* Trending Tags Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-white/80">
                <span className="font-semibold text-white">Trending:</span>
                {TRENDING_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchParams({ search: tag })}
                    className="hover:text-white underline decoration-white/40 hover:decoration-white transition-all capitalize"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Attribution Bar (Unsplash signature) */}
          <div className="absolute bottom-4 left-6 z-10 text-[11px] text-white/70 hidden sm:block">
            Photo by <span className="text-white font-semibold underline">Aevion Contributor</span>
          </div>
          <div className="absolute bottom-4 right-6 z-10 text-[11px] text-white/70 hidden sm:block">
            Read more about the <a href="/terms" className="text-white font-semibold underline">Aevion Free License</a>
          </div>
        </section>
      )}

      {/* Category Header (If filtering by category) */}
      {categoryParam && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h2 className="text-3xl font-extrabold capitalize text-slate-900 dark:text-white">
            {categoryParam === 'amoled' ? 'AMOLED & Pitch Black' : categoryParam} Wallpapers
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Free high-resolution {categoryParam} photos and wallpaper backgrounds for desktop and mobile.
          </p>
        </div>
      )}

      {/* Search Result Header (If searching) */}
      {searchParam && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            "{searchParam}"
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Showing high-resolution wallpapers matching your search.
          </p>
        </div>
      )}

      {/* Main Unsplash-Style 3-Column Masonry Gallery */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="masonry-grid">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="masonry-item rounded-sm bg-slate-200 dark:bg-dark-card animate-pulse"
                style={{ height: i % 2 === 0 ? '380px' : '280px' }}
              />
            ))}
          </div>
        ) : wallpapers.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <Compass className="w-16 h-16 mx-auto text-slate-400 stroke-[1.2]" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              No matching photos found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try searching with alternative keywords or explore our trending topics above.
            </p>
            <button
              onClick={() => setSearchParams({})}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="masonry-grid">
            {wallpapers.map((wallpaper, idx) => (
              <React.Fragment key={wallpaper.id}>
                <WallpaperCard
                  wallpaper={wallpaper}
                  onOpenModal={(w) => setSelectedWallpaper(w)}
                />
                {/* Unsplash-Style Native Sponsored Card */}
                {idx === 4 && (
                  <div className="masonry-item">
                    <AdSlot slotId="feed_native_sponsor" format="fluid" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Unsplash Lightbox Modal */}
      {selectedWallpaper && (
        <WallpaperModal
          wallpaper={selectedWallpaper}
          onClose={() => setSelectedWallpaper(null)}
          onSelectRelated={(rel) => setSelectedWallpaper(rel)}
        />
      )}
    </div>
  );
};
