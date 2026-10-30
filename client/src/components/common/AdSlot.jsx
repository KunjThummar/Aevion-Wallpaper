import React, { useEffect, useRef } from 'react';

export const AdSlot = ({
  slotId = 'home_header_banner',
  format = 'horizontal', // 'horizontal' | 'rectangle' | 'fluid'
  adClient = 'ca-pub-XXXXXXXXXXXXXXXX',
  adSlot = '1234567890',
  className = ''
}) => {
  const adRef = useRef(null);
  const isRealClient = adClient && !adClient.includes('XXXX');

  useEffect(() => {
    if (isRealClient && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn('AdSense push error:', e);
      }
    }
  }, [isRealClient]);

  // Dimension constraints based on format to prevent layout shift (CLS)
  const formatClasses = {
    horizontal: 'w-full min-h-[90px] md:min-h-[120px] max-w-5xl mx-auto my-6',
    rectangle: 'w-full min-h-[250px] max-w-[336px] mx-auto my-4',
    fluid: 'w-full min-h-[280px] my-4'
  }[format] || 'w-full min-h-[100px] my-4';

  return (
    <div className={`relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300/80 dark:border-slate-800 bg-slate-100/60 dark:bg-dark-surface/60 p-3 text-center transition-all ${formatClasses} ${className}`}>
      {/* Required Google AdSense Label */}
      <span className="absolute top-1.5 right-3 text-[10px] tracking-wider uppercase font-semibold text-slate-400 dark:text-slate-500">
        Advertisement
      </span>

      {isRealClient ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format={format === 'horizontal' ? 'horizontal' : 'auto'}
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Google AdSense Zone ({format})
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            Live ads will appear here once approved. Slot: <code className="text-[11px] font-mono bg-white dark:bg-dark-card px-1 py-0.5 rounded">{slotId}</code>
          </p>
        </div>
      )}
    </div>
  );
};
