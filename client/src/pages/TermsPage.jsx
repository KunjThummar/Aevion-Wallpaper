import React from 'react';
import { FileText, Shield } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-slate-700 dark:text-slate-300 space-y-8">
      <SEO
        title="Terms of Service"
        description="Aevion Wallpapers Terms of Service: Understand our usage license, permitted personal usage, and terms for downloading wallpapers."
        path="/terms"
      />
      <div className="space-y-3 border-b border-slate-200 dark:border-white/10 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500">Effective Date: October 29, 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Agreement to Terms</h2>
        <p className="text-sm leading-relaxed">
          By accessing and using Aevion, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue using the website.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Wallpaper License & Permitted Usage</h2>
        <p className="text-sm leading-relaxed">
          All wallpapers hosted on Aevion are provided for <strong>free personal desktop, tablet, and mobile device background customization</strong>.
        </p>
        <ul className="list-disc list-inside text-sm space-y-1.5 pl-2">
          <li><strong>Permitted:</strong> Applying wallpapers to your personal devices, setting as screensavers, and sharing direct links to wallpaper detail pages.</li>
          <li><strong>Prohibited:</strong> Reselling, redistributing images on competing stock wallpaper platforms, or using imagery in commercial merchandise without explicit rights from the original creator.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Disclaimer of Warranties</h2>
        <p className="text-sm leading-relaxed">
          The service is provided on an "AS IS" and "AS AVAILABLE" basis. Aevion disclaims all warranties regarding uptime, accuracy of user submissions, or fitness for a particular purpose.
        </p>
      </section>
    </div>
  );
};
