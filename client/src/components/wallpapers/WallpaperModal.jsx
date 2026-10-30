import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Download,
  Share2,
  Info,
  ChevronDown,
  Calendar,
  Check,
  Maximize2,
  Eye,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { AdSlot } from '../common/AdSlot';
import confetti from 'canvas-confetti';
import axios from 'axios';

export const WallpaperModal = ({ wallpaper, onClose, onSelectRelated }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [downloading, setDownloading] = useState(false);
  const [showResMenu, setShowResMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [related, setRelated] = useState([]);
  const [isFullZoom, setIsFullZoom] = useState(false);

  const favorited = wallpaper ? isFavorite(wallpaper.id) : false;

  useEffect(() => {
    if (!wallpaper) return;

    // Fetch related wallpapers
    axios.get(`/api/wallpapers?category=${wallpaper.categorySlug}&limit=6`).then((res) => {
      if (res.data.success) {
        setRelated(res.data.data.filter((w) => w.id !== wallpaper.id));
      }
    });

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [wallpaper, onClose]);

  if (!wallpaper) return null;

  const handleDownload = async (size = 'original') => {
    if (downloading) return;
    try {
      setDownloading(true);
      setShowResMenu(false);

      confetti({
        particleCount: 35,
        spread: 70,
        origin: { y: 0.6 }
      });

      await axios.post(`/api/wallpapers/${wallpaper.id}/download`);

      const targetUrl = wallpaper.images?.originalUrl || wallpaper.images?.previewUrl;
      const res = await fetch(targetUrl);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `aevion-${wallpaper.slug}-${size}.${wallpaper.fileFormat || 'jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(wallpaper.images?.originalUrl || wallpaper.images?.previewUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/wallpaper/${wallpaper.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex justify-center p-0 sm:p-4 md:p-6 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl bg-white dark:bg-dark-base rounded-none sm:rounded-2xl shadow-2xl flex flex-col my-auto overflow-hidden text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-white/10"
      >
        {/* Unsplash Modal Header */}
        <div className="sticky top-0 z-30 px-6 py-4 bg-white/95 dark:bg-dark-base/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-4">
          {/* Creator Profile */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
              {wallpaper.title?.charAt(0) || 'A'}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm leading-tight text-slate-900 dark:text-white">
                {wallpaper.title}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Available for free commercial use
              </span>
            </div>
          </div>

          {/* Right Action Controls: Heart, Share, Download Button & Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(wallpaper)}
              className={`p-2.5 rounded-lg border transition-all ${
                favorited
                  ? 'bg-rose-500 border-rose-500 text-white'
                  : 'border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-200 hover:border-slate-500'
              }`}
              title={favorited ? 'Unlike' : 'Like'}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-lg border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-200 hover:border-slate-500 transition-colors"
              title="Share Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Unsplash Iconic Green "Download free" button */}
            <div className="relative">
              <div className="flex items-center rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md overflow-hidden transition-all">
                <button
                  onClick={() => handleDownload('original')}
                  disabled={downloading}
                  className="px-4 py-2.5 flex items-center gap-1.5 border-r border-emerald-700/50"
                >
                  <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
                  <span>{downloading ? 'Preparing...' : 'Download free'}</span>
                </button>
                <button
                  onClick={() => setShowResMenu(!showResMenu)}
                  className="px-2 py-2.5 hover:bg-emerald-700 transition-colors"
                  title="Choose resolution"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Resolution Dropdown */}
              {showResMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white dark:bg-dark-surface shadow-2xl border border-slate-200 dark:border-dark-border py-1 text-xs z-50 animate-fade-in text-slate-800 dark:text-slate-200">
                  <div className="px-3 py-1.5 font-bold uppercase text-[10px] text-slate-400 border-b border-slate-100 dark:border-white/10">
                    Choose Download Size
                  </div>
                  <button
                    onClick={() => handleDownload('small')}
                    className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-dark-card flex justify-between"
                  >
                    <span>Small</span>
                    <span className="text-slate-400 font-mono text-[10px]">640 × 426</span>
                  </button>
                  <button
                    onClick={() => handleDownload('medium')}
                    className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-dark-card flex justify-between"
                  >
                    <span>Medium</span>
                    <span className="text-slate-400 font-mono text-[10px]">1920 × 1080</span>
                  </button>
                  <button
                    onClick={() => handleDownload('large')}
                    className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-dark-card flex justify-between"
                  >
                    <span>Large</span>
                    <span className="text-slate-400 font-mono text-[10px]">2400 × 1600</span>
                  </button>
                  <button
                    onClick={() => handleDownload('original')}
                    className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-dark-card flex justify-between font-bold text-emerald-600 dark:text-emerald-400 border-t border-slate-100 dark:border-white/10"
                  >
                    <span>Original Size</span>
                    <span className="font-mono text-[10px]">
                      {wallpaper.originalWidth} × {wallpaper.originalHeight}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Image Stage */}
        <div className="relative flex items-center justify-center bg-slate-900/5 dark:bg-black/60 p-4 sm:p-8">
          <img
            src={wallpaper.images?.previewUrl || wallpaper.images?.originalUrl}
            alt={wallpaper.title}
            className={`max-w-full max-h-[75vh] object-contain rounded-lg shadow-xl cursor-zoom-in transition-all ${
              isFullZoom ? 'scale-105' : ''
            }`}
            onClick={() => setIsFullZoom(!isFullZoom)}
          />
        </div>

        {/* Modal Footer: EXIF Details & Metadata */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Metrics & Technical Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Views</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5 block">
                {wallpaper.viewsCount || 0}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Downloads</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5 block">
                {wallpaper.downloadsCount || 0}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Resolution</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5 block font-mono">
                {wallpaper.originalWidth} × {wallpaper.originalHeight}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">License</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                Free for commercial use
              </span>
            </div>
          </div>

          {/* Description */}
          {wallpaper.description && (
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/10 pt-4">
              {wallpaper.description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {wallpaper.tags?.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-dark-card text-slate-600 dark:text-slate-300 capitalize"
              >
                {t}
              </span>
            ))}
          </div>

          {/* AdSense Placement */}
          <AdSlot slotId="modal_native_banner" format="horizontal" />

          {/* Related Wallpapers */}
          {related.length > 0 && (
            <div className="border-t border-slate-200 dark:border-white/10 pt-6 space-y-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Related Photos
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {related.slice(0, 3).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated && onSelectRelated(rel)}
                    className="rounded-lg overflow-hidden h-40 bg-slate-100 dark:bg-dark-card cursor-pointer group relative"
                  >
                    <img
                      src={rel.images?.thumbnailUrl || rel.images?.previewUrl}
                      alt={rel.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                      <span className="text-white text-xs font-semibold line-clamp-1">{rel.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
