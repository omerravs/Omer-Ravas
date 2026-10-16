import React from 'react';
import { Advertisement, AdSenseConfig } from '../../types';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, ExternalLink } from 'lucide-react';

interface AdBannerProps {
  ads: Advertisement[];
  adsense?: AdSenseConfig;
  placement: 'hero_banner' | 'between_sections' | 'project_gallery' | 'footer';
}

export const AdBanner: React.FC<AdBannerProps> = ({ ads, adsense, placement }) => {
  const { t } = useLanguage();

  const matchingAds = ads.filter((a) => a.placement === placement && a.isEnabled);
  const activeAd = matchingAds[0];

  const handleAdClick = (ad: Advertisement) => {
    api.recordAdClick(ad.id);
    if (ad.targetUrl.startsWith('#')) {
      const el = document.querySelector(ad.targetUrl);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // If own promo ad is present
  if (activeAd) {
    return (
      <div className="max-w-6xl mx-auto px-4 my-8">
        <div
          onClick={() => handleAdClick(activeAd)}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-4 sm:p-6 shadow-xl hover:border-cyan-400 transition-all"
        >
          {/* Sponsored badge */}
          <div className="flex items-center justify-between mb-3 text-[11px] font-semibold text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.sponsoredNotice}</span>
            </span>
            <span className="text-slate-500">{activeAd.advertiserName}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-start">
              <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                {activeAd.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {activeAd.description}
              </p>
            </div>

            <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-cyan-400 group-hover:bg-cyan-300 transition-colors flex-shrink-0 shadow-md">
              <span>عرض التفاصيل</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If AdSense is configured & enabled
  if (adsense?.isNetworkEnabled && adsense?.publisherId) {
    return (
      <div className="max-w-6xl mx-auto px-4 my-8 text-center">
        <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 text-xs text-slate-500">
          <span className="block font-semibold mb-1">Google AdSense Placement</span>
          <span>Publisher: {adsense.publisherId} • Slot: {adsense.bannerSlotId || 'Auto'}</span>
          {adsense.isTestMode && <span className="text-amber-400 block mt-1">(Test Mode Active)</span>}
        </div>
      </div>
    );
  }

  return null;
};
