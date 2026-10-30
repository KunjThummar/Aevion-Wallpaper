import React, { useState } from 'react';
import { Heart, Download, Plus, ChevronDown, Check } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { DownloadAdModal } from '../common/DownloadAdModal';
import confetti from 'canvas-confetti';
import axios from 'axios';

export const WallpaperCard = ({ wallpaper, onOpenModal }) => {
  if (!wallpaper) return null;

  const { isFavorite, toggleFavorite } = useFavorites();
  const [isLoaded, setIsLoaded] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedDownloadSize, setSelectedDownloadSize] = useState('original');
  const [showResMenu, setShowResMenu] = useState(false);

  const favorited = isFavorite(wallpaper?.id);

  const handleDownload = (e, size = 'original') => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedDownloadSize(size);
    setShowResMenu(false);
    setDownloadModalOpen(true);
  };

  const isPortrait = wallpaper.orientation === 'portrait';

  return (
    <div
      onClick={() => onOpenModal && onOpenModal(wallpaper)}
      className="masonry-item group relative rounded-sm overflow-hidden bg-slate-100 dark:bg-dark-card cursor-zoom-in transition-all duration-200"
    >
      {/* Aspect Ratio Container for Zero CLS */}
      <div
        className="w-full relative"
        style={{
          backgroundColor: wallpaper.dominantColor || '#1e293b',
          aspectRatio: wallpaper.aspectRatio ? wallpaper.aspectRatio.replace(':', '/') : (isPortrait ? '9/16' : '16/9')
        }}
      >
        <img
          src={wallpaper.images?.thumbnailUrl || wallpaper.images?.previewUrl}
          alt={wallpaper.title}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Unsplash Dark Vignette Hover Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4 pointer-events-none">
        {/* Top Controls: Like & Collect buttons */}
        <div className="flex items-center justify-end gap-2 pointer-events-auto">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(wallpaper);
            }}
            className={`p-2.5 rounded-md backdrop-blur-md transition-all ${
              favorited
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-500'
            }`}
            title={favorited ? 'Unlike' : 'Like'}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Controls: Contributor Avatar + Download Button with Resolution dropdown */}
        <div className="flex items-center justify-between pointer-events-auto">
          {/* Contributor Profile */}
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
              {wallpaper.title?.charAt(0) || 'A'}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold leading-tight line-clamp-1 text-white drop-shadow-sm">
                {wallpaper.title}
              </span>
              <span className="text-[10px] text-slate-300 capitalize">
                {wallpaper.categoryName || 'Aevion Creator'}
              </span>
            </div>
          </div>

          {/* Unsplash Iconic Download Split Button */}
          <div className="relative">
            <div className="flex items-center rounded-md bg-white hover:bg-slate-100 text-slate-800 shadow-md overflow-hidden text-xs font-semibold transition-all">
              <button
                onClick={(e) => handleDownload(e, 'original')}
                disabled={downloading}
                className="px-3 py-2 flex items-center gap-1 border-r border-slate-200"
                title="Download full quality"
              >
                <Download className={`w-3.5 h-3.5 ${downloading ? 'animate-bounce' : ''}`} />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowResMenu(!showResMenu);
                }}
                className="px-1.5 py-2 hover:bg-slate-200 transition-colors"
                title="Choose size"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Resolution Choices Dropdown */}
            {showResMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 bottom-full mb-2 w-48 rounded-lg bg-white dark:bg-dark-surface shadow-2xl border border-slate-200 dark:border-dark-border py-1 text-xs z-50 animate-fade-in text-slate-800 dark:text-slate-200"
              >
                <div className="px-3 py-1.5 font-bold uppercase text-[10px] text-slate-400 border-b border-slate-100 dark:border-white/10">
                  Select Resolution
                </div>
                <button
                  onClick={(e) => handleDownload(e, 'small')}
                  className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-dark-card flex justify-between"
                >
                  <span>Small</span>
                  <span className="text-slate-400 font-mono text-[10px]">640 × 426</span>
                </button>
                <button
                  onClick={(e) => handleDownload(e, 'medium')}
                  className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-dark-card flex justify-between"
                >
                  <span>Medium</span>
                  <span className="text-slate-400 font-mono text-[10px]">1920 × 1080</span>
                </button>
                <button
                  onClick={(e) => handleDownload(e, 'large')}
                  className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-dark-card flex justify-between"
                >
                  <span>Large</span>
                  <span className="text-slate-400 font-mono text-[10px]">2400 × 1600</span>
                </button>
                <button
                  onClick={(e) => handleDownload(e, 'original')}
                  className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-dark-card flex justify-between font-bold text-blue-600 dark:text-blue-400 border-t border-slate-100 dark:border-white/10"
                >
                  <span>Original (4K/8K)</span>
                  <span className="font-mono text-[10px]">
                    {wallpaper.originalWidth} × {wallpaper.originalHeight}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Google AdSense Countdown Interstitial Modal */}
      <DownloadAdModal
        isOpen={downloadModalOpen}
        wallpaper={wallpaper}
        resolution={selectedDownloadSize}
        onClose={() => setDownloadModalOpen(false)}
      />
    </div>
  );
};
