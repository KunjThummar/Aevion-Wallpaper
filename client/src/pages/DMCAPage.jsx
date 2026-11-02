import React, { useState } from 'react';
import { Flag, ShieldAlert, CheckCircle, Mail } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const DMCAPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [workUrl, setWorkUrl] = useState('');
  const [infringingUrl, setInfringingUrl] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-slate-700 dark:text-slate-300 space-y-8">
      <SEO
        title="DMCA Copyright Policy"
        description="Aevion Wallpapers DMCA Copyright Policy: Submit copyright notices, takedown requests, and learn how we respect intellectual property rights."
        path="/dmca"
      />
      <div className="space-y-3 border-b border-slate-200 dark:border-white/10 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Copyright Protection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
          DMCA & Copyright Takedown Policy
        </h1>
        <p className="text-xs text-slate-500">
          Aevion respects intellectual property rights and adheres to the Digital Millennium Copyright Act (17 U.S.C. § 512).
        </p>
      </div>

      <section className="space-y-3 text-sm leading-relaxed">
        <p>
          It is our strict policy to respond promptly to clear, formal notices of alleged copyright infringement. If you are a copyright owner or an authorized agent and believe that content published on Aevion infringes your copyright, you may submit a takedown notification using the form below or by emailing our designated copyright agent directly.
        </p>
      </section>

      {/* Direct Submission Box */}
      <div className="p-8 rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-xl">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-500" />
          <span>Submit Expedited Takedown Request</span>
        </h3>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-base text-slate-900 dark:text-white">Notice Received</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Our moderation team reviews takedown notices within 24 to 48 hours. If the claim is substantiated, the image will be promptly unindexed and deleted.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold block mb-1">Your Full Legal Name & Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="copyright-holder@example.com"
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-dark-surface border border-slate-300 dark:border-dark-border"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Link to Infringing Wallpaper on Aevion</label>
              <input
                type="url"
                required
                value={infringingUrl}
                onChange={(e) => setInfringingUrl(e.target.value)}
                placeholder="https://aevionwallpapers.com/wallpaper/..."
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-dark-surface border border-slate-300 dark:border-dark-border"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Link to Original Work / Proof of Ownership</label>
              <input
                type="url"
                required
                value={workUrl}
                onChange={(e) => setWorkUrl(e.target.value)}
                placeholder="https://artstation.com/... or https://behance.net/..."
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-dark-surface border border-slate-300 dark:border-dark-border"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all"
            >
              Submit DMCA Notice
            </button>
          </form>
        )}
      </div>

      <section className="space-y-2 text-xs text-slate-500">
        <p><strong>Designated DMCA Agent Contact:</strong></p>
        <p>Email: <span className="text-blue-500">dmca@aevionwallpapers.com</span></p>
      </section>
    </div>
  );
};
