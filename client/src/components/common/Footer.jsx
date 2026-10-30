import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-white/10 bg-white dark:bg-dark-base py-12 transition-colors">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <span className="text-xs text-slate-400">
              Make something awesome
            </span>
          </div>

          {/* Quick Legal and Category Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <Link to="/privacy-policy" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Terms
            </Link>
            <Link to="/dmca" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Security & DMCA
            </Link>
            <Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              About
            </Link>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Sitemap
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Aevion. Free high-resolution photos and wallpapers.</p>
          <p>Powered by creators & the open web</p>
        </div>
      </div>
    </footer>
  );
};
