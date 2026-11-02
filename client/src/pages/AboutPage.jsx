import React from 'react';
import { Sparkles, Eye, ShieldCheck, Zap } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { SEO } from '../components/common/SEO';

export const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-slate-700 dark:text-slate-300 space-y-10">
      <SEO
        title="About Us"
        description="Learn more about Aevion Wallpapers - your destination for free, high-resolution 4K, 8K, and AMOLED wallpapers crafted for creators."
        path="/about"
      />
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <Logo size="lg" className="justify-center" />
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white mt-4">
          Crafting the Ultimate Visual Backdrop
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Aevion was founded with a singular conviction: your screen is your creative canvas. Whether you are coding, gaming, or glancing at your smartphone, every pixel should inspire.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Uncompressed Quality</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every wallpaper is converted using lossless WebP and preserves the maximum dynamic color range for 4K and 8K monitors.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center mb-3">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">True AMOLED Black</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our specialized AMOLED library features 100% pitch black backgrounds (#000000) that switch off OLED pixels and preserve battery life.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Free & No-Friction</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No forced registrations, no captchas, and no deceptive download traps. Pure high-speed download experience.
          </p>
        </div>
      </div>
    </div>
  );
};
