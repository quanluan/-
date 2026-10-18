import React from 'react';
import { SystemSettings } from '../types';
import { Crown, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  settings: SystemSettings | null;
  onOpenGatekeeper: () => void;
  onOpenSubmit: () => void;
  onOpenInstall: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenGatekeeper,
  onOpenSubmit,
  onOpenInstall,
}) => {
  const siteTitle = settings?.siteName || '极光VIP会员导航';
  const inviteUrl = settings?.invitePurchaseUrl || 'https://t.me/aurora_vip_nav';
  const inviteBtnText = settings?.invitePurchaseButtonText || '获取专属邀请码';

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-cyan-300" />
              </div>
              <span>{siteTitle}</span>
            </div>
            <p className="text-slate-500 max-w-md text-xs">
              {settings?.siteSlogan || '高价值互联网生产力工具导航系统，邀请制会员直达服务。'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-slate-600 font-medium">
            <button
              onClick={onOpenSubmit}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              提交网站收录
            </button>
            <a
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-700 transition-colors flex items-center gap-1 font-semibold text-amber-600"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{inviteBtnText}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={onOpenGatekeeper}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              会员登录 / 注册
            </button>
            <button
              onClick={onOpenInstall}
              className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>安装与配置向导</span>
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>
            © {new Date().getFullYear()} {siteTitle}. All rights reserved. 资源收集自互联网，版权归原作者所有。
          </p>
          <div className="flex items-center gap-3">
            <span>官方支持: {settings?.contactEmail || 'admin@auroranav.com'}</span>
            <span>·</span>
            <span>群组: {settings?.telegramGroup || '@aurora_vip_nav'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
