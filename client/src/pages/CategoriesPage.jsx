import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Grid, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get('/api/categories');
        if (res.data.success) {
          setCategories(res.data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <SEO
        title="Explore Wallpaper Categories"
        description="Browse all wallpaper categories including AMOLED, Nature, Anime, Cyberpunk, Minimalist, Space, and 3D Renders on Aevion Wallpapers."
        path="/categories"
      />
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          <span>Curated Taxonomies</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
          Explore Wallpaper Categories
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Find your next favorite background from our hand-picked high-resolution genres.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-200 dark:bg-dark-card animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group relative h-72 rounded-3xl overflow-hidden shadow-lg border border-slate-200/60 dark:border-white/10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <img
                src={cat.thumbnailUrl}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-[11px] font-bold tracking-wider uppercase text-blue-400">
                  {cat.wallpaperCount || 0} Wallpapers
                </span>
                <h3 className="text-xl font-bold font-display mt-1 group-hover:text-blue-300 transition-colors flex items-center justify-between">
                  <span>{cat.name}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
