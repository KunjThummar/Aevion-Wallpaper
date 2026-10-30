import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Moon,
  Sun,
  Heart,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
  Shield,
  Menu,
  Sparkles
} from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';
import axios from 'axios';

const UNSPLASH_TOPICS = [
  { name: 'Editorial', slug: 'all' },
  { name: 'Wallpapers', slug: 'all' },
  { name: 'AMOLED & Black', slug: 'amoled' },
  { name: 'Nature', slug: 'nature' },
  { name: '3D Renders', slug: 'abstract' },
  { name: 'Cyberpunk', slug: 'cyberpunk' },
  { name: 'Anime', slug: 'anime' },
  { name: 'Cars & Vehicles', slug: 'cars' },
  { name: 'Space & Cosmos', slug: 'space' },
  { name: 'Minimalism', slug: 'minimalist' },
  { name: 'Architecture', slug: 'nature' },
  { name: 'Textures & Patterns', slug: 'abstract' },
  { name: 'Travel', slug: 'nature' }
];

export const Navbar = ({ onOpenSubmitModal }) => {
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState('all');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scrollContainerRef = useRef(null);
  const suggestRef = useRef(null);

  // Sync active category from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) setActiveTopic(cat);
    else if (location.pathname.startsWith('/category/')) {
      setActiveTopic(location.pathname.replace('/category/', ''));
    } else {
      setActiveTopic('all');
    }
  }, [location]);

  // Debounced live suggestions
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`/api/wallpapers/search-suggestions?q=${encodeURIComponent(searchQuery)}`);
        if (res.data.success) {
          setSuggestions(res.data.suggestions || []);
          setIsSuggestOpen(true);
        }
      } catch (e) {
        // silent
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSuggestOpen(false);
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -250 : 250;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-dark-base border-b border-slate-200 dark:border-white/10 transition-colors">
      {/* Top Primary Navigation Bar */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Logo size="md" />

        {/* Unsplash Signature Search Bar */}
        <div ref={suggestRef} className="flex-1 max-w-4xl relative">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <button
              type="submit"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <Search className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setIsSuggestOpen(true)}
              placeholder="Search high-resolution photos and wallpapers"
              className="w-full pl-11 pr-10 py-2.5 rounded-full text-sm bg-slate-100 dark:bg-dark-surface hover:bg-slate-200/70 dark:hover:bg-dark-card border border-transparent focus:border-slate-300 dark:focus:border-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSuggestions([]);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Autocomplete Dropdown */}
          {isSuggestOpen && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-white dark:bg-dark-surface shadow-2xl border border-slate-200 dark:border-dark-border overflow-hidden z-50 animate-fade-in">
              <div className="p-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Trending Searches
              </div>
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSearchQuery(item.text);
                    setIsSuggestOpen(false);
                    navigate(`/?search=${encodeURIComponent(item.text)}`);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-slate-100 dark:hover:bg-dark-card text-slate-800 dark:text-slate-200"
                >
                  <div className="flex items-center gap-2.5">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.text}</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-dark-border text-slate-500">
                    {item.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Action Links */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/categories"
            className="hidden lg:block text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
          >
            Explore
          </Link>

          <Link
            to="/favorites"
            className="relative p-2 text-slate-600 hover:text-rose-500 dark:text-slate-300 dark:hover:text-rose-400 transition-colors"
            title="Saved Favorites"
          >
            <Heart className="w-5 h-5" />
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[10px] font-bold text-white bg-rose-500 rounded-full">
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Unsplash-Style "Submit a photo" Button */}
          <Link
            to="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-white/20 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white hover:border-slate-500 dark:hover:border-white text-xs font-semibold shadow-sm transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Submit a photo</span>
          </Link>
        </div>
      </div>

      {/* Unsplash Sub-Navigation Topic Bar */}
      <div className="relative border-t border-slate-200/80 dark:border-white/10 px-4 sm:px-6">
        {/* Left Scroll Button */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white dark:bg-dark-surface shadow-md border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Scrollable Topics */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex items-center gap-6 overflow-x-auto scrollbar-none no-scrollbar py-3 text-sm font-medium whitespace-nowrap"
        >
          {UNSPLASH_TOPICS.map((topic, i) => {
            const isActive = activeTopic === topic.slug && (topic.slug !== 'all' || i === 0);
            return (
              <button
                key={i}
                onClick={() => {
                  setActiveTopic(topic.slug);
                  if (topic.slug === 'all') navigate('/');
                  else navigate(`/?category=${topic.slug}`);
                }}
                className={`relative py-1 transition-colors ${
                  isActive
                    ? 'text-slate-900 dark:text-white font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <span>{topic.name}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white dark:bg-dark-surface shadow-md border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
