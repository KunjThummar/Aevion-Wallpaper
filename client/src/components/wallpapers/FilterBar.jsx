import React from 'react';
import {
  SlidersHorizontal,
  Sparkles,
  Smartphone,
  Monitor,
  Flame,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';

const COLORS = [
  { name: 'All Colors', hex: 'all' },
  { name: 'AMOLED Black', hex: '#05070e' },
  { name: 'Neon Blue', hex: '#3b82f6' },
  { name: 'Cyber Magenta', hex: '#ff007f' },
  { name: 'Sunset Gold', hex: '#e07a3f' },
  { name: 'Deep Space', hex: '#120a2a' },
  { name: 'Nordic Clean', hex: '#d4a373' }
];

export const FilterBar = ({
  categories = [],
  activeCategory,
  onSelectCategory,
  activeSort,
  onSelectSort,
  activeDevice,
  onSelectDevice,
  activeColor,
  onSelectColor,
  onReset
}) => {
  const isFiltered =
    activeCategory !== 'all' ||
    activeSort !== 'latest' ||
    activeDevice !== 'all' ||
    activeColor !== 'all';

  return (
    <div className="w-full space-y-4 my-6">
      {/* Scrollable Category Horizontal Pill Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeCategory === 'all'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
              : 'bg-slate-200/80 dark:bg-dark-card text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-dark-border'
          }`}
        >
          All Wallpapers
        </button>

        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => onSelectCategory(cat.slug)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeCategory === cat.slug
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : cat.slug === 'amoled'
                ? 'bg-violet-600/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 hover:bg-violet-600/20'
                : 'bg-slate-200/80 dark:bg-dark-card text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-dark-border'
            }`}
          >
            {cat.slug === 'amoled' && <Sparkles className="w-3.5 h-3.5" />}
            <span>{cat.name}</span>
            {cat.wallpaperCount !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                activeCategory === cat.slug ? 'bg-white/20' : 'bg-slate-300 dark:bg-dark-border'
              }`}>
                {cat.wallpaperCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Secondary Controls Bar: Device, Color, Sorting, Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/60 dark:border-white/5">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {/* Device Target Toggle */}
          <div className="flex items-center rounded-xl bg-slate-200/70 dark:bg-dark-card p-1 text-xs">
            <button
              onClick={() => onSelectDevice('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeDevice === 'all'
                  ? 'bg-white dark:bg-dark-surface shadow-sm text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All Devices
            </button>
            <button
              onClick={() => onSelectDevice('desktop')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeDevice === 'desktop'
                  ? 'bg-white dark:bg-dark-surface shadow-sm text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => onSelectDevice('mobile')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeDevice === 'mobile'
                  ? 'bg-white dark:bg-dark-surface shadow-sm text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          {/* Color Filter Swatches */}
          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-white/10">
            {COLORS.map((col) => (
              <button
                key={col.hex}
                onClick={() => onSelectColor(col.hex)}
                className={`relative w-6 h-6 rounded-full border transition-all ${
                  col.hex === 'all'
                    ? 'bg-gradient-to-tr from-rose-500 via-amber-400 to-blue-500 border-white/20'
                    : ''
                } ${
                  activeColor === col.hex
                    ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-dark-base scale-110'
                    : 'border-slate-300 dark:border-white/10 hover:scale-105'
                }`}
                style={col.hex !== 'all' ? { backgroundColor: col.hex } : {}}
                title={col.name}
              />
            ))}
          </div>
        </div>

        {/* Sort Dropdown & Reset */}
        <div className="flex items-center gap-2">
          {isFiltered && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-semibold px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          <div className="relative flex items-center">
            <ArrowUpDown className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={activeSort}
              onChange={(e) => onSelectSort(e.target.value)}
              className="pl-8 pr-8 py-1.5 rounded-xl text-xs font-semibold bg-slate-200/70 dark:bg-dark-card border border-slate-300 dark:border-dark-border text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="latest">Latest Uploads</option>
              <option value="most_downloaded">Most Downloaded</option>
              <option value="most_viewed">Most Viewed</option>
              <option value="trending">Trending Now</option>
              <option value="featured">Editor's Choice</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
