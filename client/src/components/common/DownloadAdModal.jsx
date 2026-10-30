import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Download } from 'lucide-react';
import { AdSlot } from './AdSlot';
import confetti from 'canvas-confetti';

export const DownloadAdModal = ({
  isOpen,
  wallpaper,
  resolution = 'original',
  onClose,
  onDownloadSuccess
}) => {
  const [countdown, setCountdown] = useState(4);
  const [downloadReady, setDownloadReady] = useState(false);

  useEffect(() => {
    if (!isOpen || !wallpaper) {
      setCountdown(4);
      setDownloadReady(false);
      return;
    }

    setCountdown(4);
    setDownloadReady(false);

    let current = 4;
    const timer = setInterval(() => {
      current -= 1;
      if (current > 0) {
        setCountdown(current);
      } else {
        clearInterval(timer);
        setCountdown(0);
        setDownloadReady(true);

        try {
          confetti({
            particleCount: 50,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {}

        // Trigger native download via backend gateway
        const downloadUrl = `/api/wallpapers/${wallpaper.id}/download?resolution=${resolution}`;
        window.location.assign(downloadUrl);

        if (onDownloadSuccess) {
          onDownloadSuccess();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, wallpaper, resolution]);

  if (!isOpen || !wallpaper) return null;

  const downloadUrl = `/api/wallpapers/${wallpaper.id}/download?resolution=${resolution}`;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-dark-card p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-dark-border text-center space-y-4 animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-surface transition"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ultra HD 4K Download Gateway</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white truncate px-6">
            {downloadReady ? '🎉 Download Starting!' : wallpaper.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {downloadReady
              ? 'Check your browser downloads folder. Thank you for supporting Aevion!'
              : 'Your high-speed CDN stream is preparing...'}
          </p>
        </div>

        {/* Countdown Badge / Radial Indicator */}
        {!downloadReady ? (
          <div className="flex items-center justify-center gap-3 py-1">
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-2xl shadow-lg shadow-blue-500/30 animate-pulse">
              {countdown}
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Ready in {countdown} second{countdown === 1 ? '' : 's'}
              </span>
              <span className="text-[11px] text-slate-400">
                Direct file download starting automatically
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2 py-1">
            <div className="flex items-center justify-center gap-2 py-2 text-emerald-500 font-bold text-xs bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <Check className="w-4 h-4" />
              <span>Download triggered automatically!</span>
            </div>
            <a
              href={downloadUrl}
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Click here if download didn't start</span>
            </a>
          </div>
        )}

        {/* Google AdSense Sponsored Unit */}
        <div className="py-1">
          <AdSlot slotId="detail_page_sidebar" format="rectangle" />
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-dark-border text-xs">
          <span className="text-slate-400 text-[11px]">
            Sponsored by Google AdSense
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-semibold bg-slate-100 dark:bg-dark-surface hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
          >
            {downloadReady ? 'Done' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};
