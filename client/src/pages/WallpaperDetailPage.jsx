import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Download,
  Heart,
  Share2,
  Flag,
  ArrowLeft,
  Monitor,
  Smartphone,
  Maximize2,
  Check,
  Copy,
  Info,
  Calendar,
  Eye,
  Tag,
  Palette,
  Sparkles,
  X
} from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { AdSlot } from '../components/common/AdSlot';
import { DownloadAdModal } from '../components/common/DownloadAdModal';
import { WallpaperCard } from '../components/wallpapers/WallpaperCard';
import confetti from 'canvas-confetti';

export const WallpaperDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [wallpaper, setWallpaper] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [adModalOpen, setAdModalOpen] = useState(false);
  const [adCountdown, setAdCountdown] = useState(4);
  const [downloadReady, setDownloadReady] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState('original');
  const [copied, setCopied] = useState(false);

  // Lightbox Modal state
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // DMCA Report Dialog state
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Copyright / DMCA Violation');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  useEffect(() => {
    const fetchWallpaper = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/wallpapers/${slug}`);
        if (res.data.success) {
          setWallpaper(res.data.data);
          setRelated(res.data.related || []);
          // Scroll to top
          window.scrollTo(0, 0);
        }
      } catch (err) {
        console.error('Wallpaper not found:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWallpaper();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  if (!wallpaper) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold">Wallpaper Not Found</h2>
        <p className="text-slate-500">The requested wallpaper might have been removed or renamed.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Gallery
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(wallpaper.id);

  const handleDownload = () => {
    setAdModalOpen(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/wallpapers/${wallpaper.id}/report`, {
        reason: reportReason,
        details: reportDetails
      });
      setReportSubmitted(true);
      setTimeout(() => {
        setReportOpen(false);
        setReportSubmitted(false);
      }, 2000);
    } catch {
      alert('Error submitting report. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
        <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link>
        <span>/</span>
        <Link to={`/category/${wallpaper.categorySlug}`} className="hover:text-blue-500 transition-colors">
          {wallpaper.categoryName}
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 truncate max-w-xs">{wallpaper.title}</span>
      </nav>

      {/* Main Wallpaper Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left / Center Column: Preview Image */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative group rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-200/50 dark:border-white/10">
            <img
              src={wallpaper.images?.previewUrl || wallpaper.images?.originalUrl}
              alt={wallpaper.title}
              className="w-full h-auto max-h-[80vh] object-contain mx-auto"
            />

            {/* Lightbox Trigger Button */}
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md bg-black/60 text-white hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100 shadow-xl"
              title="Full-Screen Preview"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Social Share & Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(wallpaper)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  favorited
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                    : 'bg-slate-100 dark:bg-dark-surface text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
                <span>{favorited ? 'Favorited' : 'Save to Favorites'}</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-dark-surface text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>

            <button
              onClick={() => setReportOpen(true)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-500 transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Report Wallpaper</span>
            </button>
          </div>

          {/* Detailed Editorial Content (Essential for Google AdSense Non-Thin Content Rating) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border space-y-4">
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              About this Wallpaper
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {wallpaper.description}
            </p>

            {/* Tag Cloud */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Related Tags
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {wallpaper.tags?.map((t) => (
                  <Link
                    key={t}
                    to={`/?search=${encodeURIComponent(t)}`}
                    className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-100 dark:bg-dark-surface text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Download Actions, Tech Specs & AdSense Placement */}
        <div className="lg:col-span-4 space-y-6">
          {/* Main Download Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xl space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {wallpaper.categoryName}
              </span>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                {wallpaper.title}
              </h1>
            </div>

            {/* Resolution Selector Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Choose Download Resolution
              </label>
              <select
                value={selectedResolution}
                onChange={(e) => setSelectedResolution(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl text-xs font-bold bg-slate-100 dark:bg-dark-surface border border-slate-300 dark:border-dark-border text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="original">
                  Original Resolution ({wallpaper.originalWidth} × {wallpaper.originalHeight}px)
                </option>
                <option value="4k_desktop">4K Ultra HD Desktop (3840 × 2160)</option>
                <option value="quad_hd">2K Quad HD (2560 × 1440)</option>
                <option value="full_hd">1080p Full HD (1920 × 1080)</option>
                <option value="mobile_portrait">Mobile Portrait OLED (1080 × 2400)</option>
              </select>
            </div>

            {/* Big Action Download Button */}
            <button
              onClick={handleDownload}
              disabled={downloading || (adModalOpen && !downloadReady)}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Free Download (Original Quality)</span>
            </button>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-center text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200/60 dark:border-dark-border">
                <span className="block font-bold text-slate-900 dark:text-white text-base">
                  {wallpaper.downloadsCount || 0}
                </span>
                <span className="text-slate-500 text-[11px]">Total Downloads</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200/60 dark:border-dark-border">
                <span className="block font-bold text-slate-900 dark:text-white text-base">
                  {wallpaper.viewsCount || 0}
                </span>
                <span className="text-slate-500 text-[11px]">Total Views</span>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" />
              <span>Wallpaper Specifications</span>
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Native Resolution</span>
                <span className="font-semibold">{wallpaper.originalWidth} × {wallpaper.originalHeight}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Aspect Ratio</span>
                <span className="font-semibold">{wallpaper.aspectRatio || '16:9'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Orientation</span>
                <span className="font-semibold capitalize">{wallpaper.orientation || 'Landscape'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Target Device</span>
                <span className="font-semibold capitalize">{wallpaper.deviceTarget || 'Universal'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">File Format</span>
                <span className="font-semibold uppercase">{wallpaper.fileFormat || 'JPEG'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">File Size</span>
                <span className="font-semibold">
                  {((wallpaper.fileSizeBytes || 3500000) / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            </div>

            {/* Interactive Color Palette */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-500 block mb-2">Dominant Colors:</span>
              <div className="flex items-center gap-2">
                {wallpaper.palette?.map((col, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(`/?color=${encodeURIComponent(col)}`)}
                    className="w-7 h-7 rounded-xl border border-white/20 shadow-sm transition-transform hover:scale-110"
                    style={{ backgroundColor: col }}
                    title={`Browse wallpapers with color ${col}`}
                  />
                ))}
              </div>
            </div>

            {/* License & Copyright Attribution */}
            {wallpaper.attribution && (
              <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-2">
                <span className="text-xs font-semibold text-slate-500 block">Attribution & License:</span>
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-dark-surface p-3 rounded-2xl border border-slate-200/60 dark:border-dark-border space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 shrink-0">
                      CC
                    </span>
                    <span className="leading-snug">{wallpaper.attribution}</span>
                  </div>
                  {wallpaper.sourceUrl && (
                    <div className="pt-1">
                      <a
                        href={wallpaper.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View Original Wikimedia Source ↗
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* AdSense Placement: Detail Page Rectangle Banner */}
          <AdSlot slotId="detail_page_sidebar" format="rectangle" />
        </div>
      </div>

      {/* Related Wallpapers Carousel */}
      {related.length > 0 && (
        <section className="mt-16 pt-12 border-t border-slate-200/80 dark:border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                Similar Wallpapers You May Like
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Handpicked from {wallpaper.categoryName}
              </p>
            </div>
            <Link
              to={`/category/${wallpaper.categorySlug}`}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all in {wallpaper.categoryName} →
            </Link>
          </div>

          <div className="masonry-grid">
            {related.map((rel) => (
              <WallpaperCard key={rel.id} wallpaper={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          <img
            src={wallpaper.images?.originalUrl || wallpaper.images?.previewUrl}
            alt={wallpaper.title}
            className="max-w-full max-h-full object-contain rounded-xl"
          />
        </div>
      )}

      {/* Google AdSense Countdown Interstitial Modal */}
      <DownloadAdModal
        isOpen={adModalOpen}
        wallpaper={wallpaper}
        resolution={selectedResolution}
        onClose={() => setAdModalOpen(false)}
        onDownloadSuccess={() => {
          setWallpaper(prev => ({ ...prev, downloadsCount: (prev.downloadsCount || 0) + 1 }));
        }}
      />

      {/* DMCA / Copyright Report Dialog */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-dark-card p-6 shadow-2xl border border-slate-200 dark:border-dark-border space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flag className="w-5 h-5 text-rose-500" />
              <span>Report Wallpaper</span>
            </h3>

            {reportSubmitted ? (
              <div className="py-6 text-center text-sm font-semibold text-emerald-500">
                Thank you. Your report has been submitted to our moderation team.
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Reason for report
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-dark-surface border border-slate-300 dark:border-dark-border"
                  >
                    <option value="Copyright / DMCA Violation">Copyright / DMCA Violation</option>
                    <option value="Inappropriate Content">Inappropriate Content</option>
                    <option value="Broken Image / Low Quality">Broken Image / Low Quality</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Additional Details / Proof
                  </label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide link to original work or specific reason..."
                    className="w-full p-2.5 rounded-xl text-xs bg-slate-100 dark:bg-dark-surface border border-slate-300 dark:border-dark-border"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-surface"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-md"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
