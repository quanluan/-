import React, { useState } from 'react';
import { SystemSettings } from '../types';
import { api } from '../api';
import { Wrench, CheckCircle2, ShieldCheck, Sparkles, Globe, Key, AlertCircle, X } from 'lucide-react';

interface InstallWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SystemSettings | null;
  onInstalled: () => void;
}

export const InstallWizardModal: React.FC<InstallWizardModalProps> = ({
  isOpen,
  onClose,
  settings,
  onInstalled,
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  const [siteName, setSiteName] = useState(settings?.siteName || '极光VIP会员导航');
  const [siteSlogan, setSiteSlogan] = useState(
    settings?.siteSlogan || '精选高价值互联网工具与资源 · 邀请制VIP会员直达'
  );
  const [invitePurchaseUrl, setInvitePurchaseUrl] = useState(
    settings?.invitePurchaseUrl || 'https://t.me/aurora_vip_nav'
  );

  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin888');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleCompleteInstall = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!adminUsername.trim() || !adminPassword) {
      setErrorMsg('管理员账号和密码不能为空');
      return;
    }
    if (adminPassword.length < 6) {
      setErrorMsg('密码长度不能少于6位');
      return;
    }

    setLoading(true);
    try {
      const res = await api.installSystem({
        siteName: siteName.trim(),
        siteSlogan: siteSlogan.trim(),
        adminUsername: adminUsername.trim(),
        adminPassword: adminPassword,
        invitePurchaseUrl: invitePurchaseUrl.trim(),
      });

      setSuccessMsg(res.message || '安装配置成功！正在载入新配置...');
      setTimeout(() => {
        onInstalled();
        onClose();
      }, 1500);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : '安装失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded">
              <Sparkles className="w-3.5 h-3.5" />
              开箱即用 · 部署向导
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-indigo-400" />
            <span>极光导航系统 · 初始化安装与配置</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            上传至任意云服务器或虚拟空间后，仅需设置站点基本信息与站长超管账号即可一键就绪。
          </p>

          {/* Step tabs */}
          <div className="flex items-center gap-2 mt-4 text-xs">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md ${
                step === 1 ? 'bg-indigo-600 text-white font-medium' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <span>1. 站点基本信息与邀请入口</span>
            </div>
            <span className="text-slate-600">/</span>
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md ${
                step === 2 ? 'bg-indigo-600 text-white font-medium' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <span>2. 设置超级管理员账户</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-xs space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-red-700 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-3.5">
              <div>
                <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  <span>导航站点名称</span>
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  站点标语 (Slogan)
                </label>
                <input
                  type="text"
                  value={siteSlogan}
                  onChange={(e) => setSiteSlogan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>邀请码购买/获取直达链接 (预留入口)</span>
                </label>
                <input
                  type="text"
                  placeholder="如: https://t.me/your_telegram_channel 或 微信号/发卡平台"
                  value={invitePurchaseUrl}
                  onChange={(e) => setInvitePurchaseUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  访客点击弹窗中的「获取邀请码」时将自动跳转至该配置地址。
                </p>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2 font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  下一步：配置超级管理员 &rarr;
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCompleteInstall} className="space-y-3.5">
              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg flex items-start gap-2 text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px]">
                  请妥善保存超级管理员账号密码。安装后可随时在后台管理邀请码、会员有效期、广告位与分类网站！
                </p>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  管理员账号 (Username) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  管理员密码 (Password) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                >
                  &larr; 返回上一步
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{loading ? '正在初始化写入...' : '一键完成安装并初始化系统'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
