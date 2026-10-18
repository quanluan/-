import React from 'react';
import { AdItem } from '../types';
import { api } from '../api';
import { ExternalLink, Tag } from 'lucide-react';

interface TopAdBannerProps {
  ads: AdItem[];
}

export const TopAdBanner: React.FC<TopAdBannerProps> = ({ ads }) => {
  const topAd = ads.find((a) => a.position === 'top_banner');
  if (!topAd) return null;

  const handleClick = () => {
    api.clickAd(topAd.id);
  };

  const imageSrc = topAd.imageUrl || '/src/assets/images/ad_banner_tech_1792330416603.jpg';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-6">
      <a
        href={topAd.targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="group relative block overflow-hidden rounded-xl border border-slate-200/80 bg-slate-900 shadow-sm transition-all duration-200 hover:shadow-md"
      >
        <div className="relative aspect-[21/9] sm:aspect-[24/7] w-full overflow-hidden">
          <img
            src={imageSrc}
            alt={topAd.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Graceful fallback to styled gradient container
              e.currentTarget.style.display = 'none';
            }}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-transparent flex items-center p-6 sm:p-8">
            <div className="max-w-xl text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-semibold tracking-wider text-cyan-300 uppercase px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60">
                  {topAd.badgeText || '赞助推广'}
                </span>
                <span className="text-xs text-slate-400">· 官方合作精选</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white mb-1.5 group-hover:text-cyan-200 transition-colors">
                {topAd.title}
              </h2>
              {topAd.description && (
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-lg">
                  {topAd.description}
                </p>
              )}
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-cyan-300 group-hover:text-cyan-100 transition-colors">
                <span>了解详情与独家福利</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div className="absolute top-3 right-3 text-[10px] text-slate-400/80 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded">
            AD
          </div>
        </div>
      </a>
    </div>
  );
};
