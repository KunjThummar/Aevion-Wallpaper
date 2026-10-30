import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-slate-700 dark:text-slate-300 space-y-8">
      <div className="space-y-3 border-b border-slate-200 dark:border-white/10 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Legal Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last Updated: October 29, 2026 | Effective immediately for all visitors of Aevion
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Introduction</h2>
        <p className="text-sm leading-relaxed">
          Welcome to <strong>Aevion</strong> ("we", "our", or "us"). We respect your privacy and are committed to protecting any personal data you share with us. This Privacy Policy details our practices concerning information collection, use, and disclosure when you access our website and download wallpapers.
        </p>
      </section>

      <section className="space-y-3 p-6 rounded-2xl bg-blue-50/50 dark:bg-dark-card border border-blue-200/50 dark:border-dark-border">
        <h2 className="text-lg font-bold text-blue-900 dark:text-blue-300">
          2. Google AdSense & Third-Party Advertising Disclosures
        </h2>
        <p className="text-sm leading-relaxed">
          We use Google AdSense and third-party advertising companies to serve advertisements when you visit our website. These companies may use cookies, web beacons, and similar tracking technologies to serve ads based on prior visits to our website or other sites on the Internet:
        </p>
        <ul className="list-disc list-inside text-sm space-y-2 pl-2">
          <li>
            <strong>Google's use of advertising cookies:</strong> Google uses cookies (including the DoubleClick DART cookie) to serve personalized ads to users based on their visits to Aevion and other sites on the internet.
          </li>
          <li>
            <strong>Opting Out:</strong> Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Google Ads Settings</a>. Alternatively, you may opt out of third-party vendor cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">aboutads.info</a>.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Information We Collect</h2>
        <p className="text-sm leading-relaxed">
          Aevion does not require user registration or account creation to search, browse, or download wallpapers. We collect minimal telemetry strictly to ensure platform reliability:
        </p>
        <ul className="list-disc list-inside text-sm space-y-1.5 pl-2">
          <li><strong>Log Data:</strong> Browser user agent, IP address (anonymized), operating system, screen resolution, referring URLs, and timestamps.</li>
          <li><strong>Local Storage:</strong> We use browser localStorage solely to retain your client-side theme preference (Dark Mode / Light Mode) and your saved favorites.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. GDPR & CCPA Privacy Rights</h2>
        <p className="text-sm leading-relaxed">
          Depending on your location, you have rights under the General Data Protection Regulation (GDPR) or California Consumer Privacy Act (CCPA), including the right to request access, correction, or deletion of personal data we maintain. Because we operate without mandatory accounts, we do not sell or monetize personal identity records.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Contact Information</h2>
        <p className="text-sm leading-relaxed">
          If you have questions regarding this Privacy Policy or cookie management, please reach out to our privacy officer at:
          <br />
          <span className="font-mono text-xs text-blue-600 dark:text-blue-400 mt-1 inline-block">
            privacy@aevionwallpapers.com
          </span>
        </p>
      </section>
    </div>
  );
};
