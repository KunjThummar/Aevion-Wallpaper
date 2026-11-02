import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { WallpaperCard } from '../components/wallpapers/WallpaperCard';
import { AdSlot } from '../components/common/AdSlot';
import { SEO } from '../components/common/SEO';
import { ArrowLeft, Sparkles, Compass } from 'lucide-react';

export const CategoryDetailPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, wallRes] = await Promise.all([
          axios.get(`/api/categories/${slug}`),
          axios.get(`/api/wallpapers?category=${slug}&limit=30`)
        ]);

        if (catRes.data.success) {
          setCategory(catRes.data.data);
        }
        if (wallRes.data.success) {
          setWallpapers(wallRes.data.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  const categoryTitle = `${category?.name || slug} Wallpapers | Free 4K & AMOLED`;
  const categoryDesc = category?.description || `Explore and download free high-resolution 4K and AMOLED ${category?.name || slug} wallpapers for phones and computers on Aevion Wallpapers.`;
  const categoryImage = wallpapers[0]?.images?.previewUrl || wallpapers[0]?.images?.originalUrl;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <SEO
        title={categoryTitle}
        description={categoryDesc}
        path={`/category/${slug}`}
        image={categoryImage}
      />
      <Link
        to="/categories"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-500 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>All Categories</span>
      </Link>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 mb-8 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white shadow-xl border border-white/10">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold tracking-wider uppercase text-blue-400">
            {wallpapers.length} Wallpapers Available
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display">
            {category?.name || slug} Wallpapers
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            {category?.description || `Explore free high-resolution 4K and AMOLED ${category?.name} wallpapers for phones and computers.`}
          </p>
        </div>
      </div>

      {/* Header Ad Slot */}
      <AdSlot slotId="category_header_banner" format="horizontal" />

      {/* Category Gallery Grid */}
      {wallpapers.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <Compass className="w-12 h-12 mx-auto text-slate-400" />
          <h3 className="font-bold text-lg">No wallpapers in this category yet</h3>
          <p className="text-xs text-slate-500">Check back soon as our team regularly uploads new 4K collections.</p>
        </div>
      ) : (
        <div className="masonry-grid my-8">
          {wallpapers.map((wallpaper, idx) => (
            <React.Fragment key={wallpaper.id}>
              <WallpaperCard wallpaper={wallpaper} />
              {idx === 2 && (
                <div className="masonry-item">
                  <AdSlot slotId="category_inline_feed" format="fluid" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
