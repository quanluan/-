import { SystemSettings, User, Category, SiteItem, AdItem, InviteCode, AdminStats } from './types';

const TOKEN_KEY = 'aurora_nav_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `请求失败 (${response.status})`);
  }

  return data as T;
}

export const api = {
  // System
  getSettings: () => request<SystemSettings>('/api/system/settings'),
  installSystem: (payload: {
    siteName: string;
    siteSlogan: string;
    adminUsername: string;
    adminPassword: string;
    invitePurchaseUrl?: string;
  }) => request<{ success: boolean; message: string }>('/api/system/install', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  // Auth
  getMe: () => request<{ authenticated: boolean; user?: User }>('/api/auth/me'),
  login: (payload: { username: string; password: string }) =>
    request<{ success: boolean; token: string; user: User; message: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  register: (payload: { username: string; password: string; nickname?: string; inviteCode: string }) =>
    request<{ success: boolean; token: string; user: User; message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  logout: () => request<{ success: boolean }>('/api/auth/logout', { method: 'POST' }),

  // Content
  getCategories: () => request<Category[]>('/api/categories'),
  getSites: () => request<SiteItem[]>('/api/sites'),
  clickSite: (id: string) =>
    request<{ success: boolean; url?: string; title?: string; requireLogin?: boolean; requireVip?: boolean }>(
      `/api/sites/click/${id}`,
      { method: 'POST' }
    ),
  submitSite: (payload: {
    title: string;
    url: string;
    description: string;
    categoryId: string;
    iconUrl?: string;
    tags?: string[];
  }) =>
    request<{ success: boolean; message: string; site: SiteItem }>('/api/sites/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Ads
  getAds: () => request<AdItem[]>('/api/ads'),
  clickAd: (id: string) => request<{ success: boolean }>(`/api/ads/click/${id}`, { method: 'POST' }),

  // Admin
  getAdminStats: () => request<AdminStats>('/api/admin/stats'),
  getAdminSites: () => request<SiteItem[]>('/api/admin/sites'),
  createAdminSite: (site: Partial<SiteItem>) =>
    request<{ success: boolean; site: SiteItem }>('/api/admin/sites', {
      method: 'POST',
      body: JSON.stringify(site),
    }),
  updateAdminSite: (id: string, site: Partial<SiteItem>) =>
    request<{ success: boolean; site: SiteItem }>(`/api/admin/sites/${id}`, {
      method: 'PUT',
      body: JSON.stringify(site),
    }),
  deleteAdminSite: (id: string) =>
    request<{ success: boolean }>(`/api/admin/sites/${id}`, { method: 'DELETE' }),

  createAdminCategory: (category: Partial<Category>) =>
    request<{ success: boolean; category: Category }>('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    }),
  updateAdminCategory: (id: string, category: Partial<Category>) =>
    request<{ success: boolean; category: Category }>(`/api/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    }),
  deleteAdminCategory: (id: string) =>
    request<{ success: boolean }>(`/api/admin/categories/${id}`, { method: 'DELETE' }),

  getAdminAds: () => request<AdItem[]>('/api/admin/ads'),
  createAdminAd: (ad: Partial<AdItem>) =>
    request<{ success: boolean; ad: AdItem }>('/api/admin/ads', {
      method: 'POST',
      body: JSON.stringify(ad),
    }),
  updateAdminAd: (id: string, ad: Partial<AdItem>) =>
    request<{ success: boolean; ad: AdItem }>(`/api/admin/ads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ad),
    }),
  deleteAdminAd: (id: string) =>
    request<{ success: boolean }>(`/api/admin/ads/${id}`, { method: 'DELETE' }),

  getAdminInviteCodes: () => request<InviteCode[]>('/api/admin/invite-codes'),
  generateInviteCodes: (payload: {
    count: number;
    prefix: string;
    vipDays: number;
    vipTier: 'vip' | 'svip';
    remark: string;
  }) =>
    request<{ success: boolean; count: number; codes: InviteCode[] }>('/api/admin/invite-codes/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  deleteAdminInviteCode: (id: string) =>
    request<{ success: boolean }>(`/api/admin/invite-codes/${id}`, { method: 'DELETE' }),
  updateAdminInviteCode: (id: string, updates: Partial<InviteCode>) =>
    request<{ success: boolean; code: InviteCode }>(`/api/admin/invite-codes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  getAdminUsers: () => request<User[]>('/api/admin/users'),
  updateAdminUser: (id: string, updates: Record<string, unknown>) =>
    request<{ success: boolean; user: User }>(`/api/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteAdminUser: (id: string) =>
    request<{ success: boolean }>(`/api/admin/users/${id}`, { method: 'DELETE' }),

  getAdminSettings: () => request<SystemSettings>('/api/admin/settings'),
  updateAdminSettings: (settings: Partial<SystemSettings>) =>
    request<{ success: boolean; settings: SystemSettings }>('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
  resetDemoData: () => request<{ success: boolean; message: string }>('/api/admin/reset', { method: 'POST' }),
};
