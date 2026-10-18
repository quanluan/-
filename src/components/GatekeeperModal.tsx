import React, { useState } from 'react';
import { User, SystemSettings, SiteItem } from '../types';
import { api, setStoredToken } from '../api';
import { X, Lock, Crown, KeyRound, ExternalLink, ShieldCheck, Check, AlertCircle } from 'lucide-react';

interface GatekeeperModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSite: SiteItem | null;
  settings: SystemSettings | null;
  initialTab?: 'login' | 'register';
  onLoginSuccess: (user: User) => void;
}

export const GatekeeperModal: React.FC<GatekeeperModalProps> = ({
  isOpen,
  onClose,
  targetSite,
  settings,
  initialTab = 'register',
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  // Register Form
  const [regUsername, setRegUsername] = useState('');
  const [regNickname, setRegNickname] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regInviteCode, setRegInviteCode] = useState('');

  // Login Form
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const inviteUrl = settings?.invitePurchaseUrl || 'https://t.me/aurora_vip_nav';
  const inviteBtnText = settings?.invitePurchaseButtonText || '获取专属邀请码';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regUsername.trim()) {
      setErrorMsg('请填写用户名');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMsg('密码长度不能少于6位');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('两次输入的密码不一致');
      return;
    }
    if (!regInviteCode.trim()) {
      setErrorMsg('注册必须填写邀请码！请点击下方入口获取');
      return;
    }

    setLoading(true);
    try {
      const res = await api.register({
        username: regUsername.trim(),
        nickname: regNickname.trim() || undefined,
        password: regPassword,
        inviteCode: regInviteCode.trim(),
      });

      setStoredToken(res.token);
      setSuccessMsg(res.message || '注册成功！正在为您解锁资源...');
      setTimeout(() => {
        onLoginSuccess(res.user);
        onClose();
        // If there was a target site, trigger open
        if (targetSite && targetSite.url) {
          window.open(targetSite.url, '_blank', 'noopener,noreferrer');
        }
      }, 1200);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : '注册失败，请检查邀请码');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginUsername.trim() || !loginPassword) {
      setErrorMsg('请输入用户名和密码');
      return;
    }

    setLoading(true);
    try {
      const res = await api.login({
        username: loginUsername.trim(),
        password: loginPassword,
      });

      setStoredToken(res.token);
      setSuccessMsg('登录成功！');
      setTimeout(() => {
        onLoginSuccess(res.user);
        onClose();
        if (targetSite && targetSite.url) {
          window.open(targetSite.url, '_blank', 'noopener,noreferrer');
        }
      }, 800);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for testing
  const fillSampleCode = (code: string) => {
    setRegInviteCode(code);
    setErrorMsg('');
  };

  // Quick login helper
  const handleQuickLogin = (u: string, p: string) => {
    setLoginUsername(u);
    setLoginPassword(p);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header modal banner */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 pb-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-950/80 border border-amber-600/50 px-2 py-0.5 rounded">
              <Crown className="w-3.5 h-3.5" />
              VIP 会员专享特权
            </span>
            <span className="text-xs text-slate-400">· 邀请制注册系统</span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <span>
              {targetSite ? `解锁「${targetSite.title}」直达` : '登录或注册会员'}
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            本站全站资源已启用VIP权限直达。注册须填写有效邀请码，完成后即刻升级会员！
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
            <span>邀请码注册 (自动成VIP)</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>现有会员登录</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Mandatory Invite Code Section */}
              <div className="p-3.5 rounded-xl border border-amber-300 bg-gradient-to-br from-amber-50/70 to-orange-50/40">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-amber-950 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                    <span>专属邀请码 (必填)</span>
                    <span className="text-red-500">*</span>
                  </label>
                  {/* Reserved Get Invite Code link */}
                  <a
                    href={inviteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline flex items-center gap-1"
                  >
                    <span>{inviteBtnText}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <input
                  type="text"
                  placeholder="请输入您获得的专属邀请码 (例: VIP888-2026)"
                  value={regInviteCode}
                  onChange={(e) => setRegInviteCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-sm font-mono tracking-wider border border-amber-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase placeholder:text-slate-400"
                  required
                />

                {/* Convenient quick test codes */}
                <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex flex-wrap items-center gap-1.5 text-[11px] text-amber-900">
                  <span className="text-slate-500">测试可用预设码:</span>
                  <button
                    type="button"
                    onClick={() => fillSampleCode('VIP888-2026')}
                    className="px-2 py-0.5 rounded bg-white border border-amber-300 hover:bg-amber-100 font-mono text-[10px] cursor-pointer"
                  >
                    VIP888-2026 (月卡)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillSampleCode('SVIP-FOREVER-KING')}
                    className="px-2 py-0.5 rounded bg-white border border-amber-300 hover:bg-amber-100 font-mono text-[10px] cursor-pointer"
                  >
                    SVIP-FOREVER-KING (永久)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillSampleCode('START-FREE-7DAYS')}
                    className="px-2 py-0.5 rounded bg-white border border-amber-300 hover:bg-amber-100 font-mono text-[10px] cursor-pointer"
                  >
                    START-FREE-7DAYS (7天)
                  </button>
                </div>
              </div>

              {/* Username & Nickname */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    用户名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="英文字母或数字"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    用户昵称 (选填)
                  </label>
                  <input
                    type="text"
                    placeholder="如: 极光探索者"
                    value={regNickname}
                    onChange={(e) => setRegNickname(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    设置密码 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="不少于 6 位"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    确认密码 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="重复确认密码"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span>正在验证并激活VIP会员...</span>
                ) : (
                  <>
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>立即使用邀请码注册并激活VIP</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  账号 / 用户名
                </label>
                <input
                  type="text"
                  placeholder="请输入您的注册用户名"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  登录密码
                </label>
                <input
                  type="password"
                  placeholder="请输入密码"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Quick Login for review */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-600 block">
                  快速体验预设账号:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('vip_user', '123456')}
                    className="px-2.5 py-1 text-[11px] rounded bg-white border border-slate-300 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-colors cursor-pointer"
                  >
                    VIP会员 (vip_user / 123456)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin', 'admin888')}
                    className="px-2.5 py-1 text-[11px] rounded bg-white border border-slate-300 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-colors cursor-pointer"
                  >
                    超级管理员 (admin / admin888)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? '正在验证登录...' : '立即登录进入'}
              </button>
            </form>
          )}

          {/* Reserved Invite link footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>遇到问题或未收到邀请码？</span>
            <a
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1"
            >
              <span>联系官方客服 / Telegram</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
