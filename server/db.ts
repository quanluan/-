import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface User {
  id: string;
  username: string;
  nickname: string;
  passwordHash: string;
  salt: string;
  role: 'admin' | 'user';
  avatar?: string;
  inviteCodeUsed?: string;
  vipTier: 'free' | 'vip' | 'svip';
  vipTierName: string;
  vipExpireAt: number | null; // Unix timestamp in ms, null means Lifetime (永久会员)
  createdAt: string;
  status: 'active' | 'banned';
}

export interface InviteCode {
  id: string;
  code: string;
  vipDays: number; // e.g. 7, 30, 90, 365, 9999 (9999 = Lifetime)
  vipTier: 'vip' | 'svip';
  vipTierName: string;
  status: 'unused' | 'used' | 'disabled';
  usedByUserId: string | null;
  usedByUsername: string | null;
  usedAt: string | null;
  createdAt: string;
  remark: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  sortOrder: number;
}

export interface SiteItem {
  id: string;
  title: string;
  url: string;
  description: string;
  categoryId: string;
  iconUrl?: string;
  tags: string[];
  isPinned: boolean;
  isFeatured: boolean;
  minVipTier: 'all' | 'vip' | 'svip';
  status: 'approved' | 'pending' | 'rejected';
  submitterId: string | null;
  submitterName: string | null;
  clickCount: number;
  createdAt: string;
}

export interface AdItem {
  id: string;
  title: string;
  position: 'top_banner' | 'grid_sponsor' | 'bottom_banner';
  imageUrl: string;
  targetUrl: string;
  badgeText: string;
  description: string;
  isActive: boolean;
  clickCount: number;
  sortOrder: number;
  createdAt: string;
}

export interface SystemSettings {
  installed: boolean;
  siteName: string;
  siteSlogan: string;
  siteNotice: string;
  showNotice: boolean;
  invitePurchaseUrl: string;
  invitePurchaseButtonText: string;
  forceLoginToViewUrl: boolean;
  allowPublicSubmission: boolean;
  autoApproveSubmission: boolean;
  defaultVipDays: number;
  contactEmail: string;
  telegramGroup: string;
}

export interface DatabaseSchema {
  settings: SystemSettings;
  users: User[];
  inviteCodes: InviteCode[];
  categories: Category[];
  sites: SiteItem[];
  ads: AdItem[];
  sessions: { [token: string]: { userId: string; createdAt: number } };
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'nav_data.json');

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function hashNewPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPassword(password, salt);
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  return hashPassword(password, salt) === hash;
}

// Initial default seed
const defaultAdminSalt = 'e8b83920c78a01f9c8914b72';
const defaultAdminHash = hashPassword('admin888', defaultAdminSalt);

const defaultCategories: Category[] = [
  { id: 'cat-ai', name: 'AI 智能应用', icon: 'Bot', description: '国内外顶级AI助手、大模型与效率生产力工具', sortOrder: 1 },
  { id: 'cat-dev', name: '开发与运维', icon: 'Code2', description: '代码托管、云服务、API接口与开发者文档', sortOrder: 2 },
  { id: 'cat-design', name: '设计与灵感', icon: 'Palette', description: 'UI设计、图标库、灵感图库与配色方案', sortOrder: 3 },
  { id: 'cat-tools', name: '实用工具箱', icon: 'Wrench', description: '在线转换、格式化、效率神器与聚合检索', sortOrder: 4 },
  { id: 'cat-media', name: '影音与资讯', icon: 'Sparkles', description: '科技媒体、全球快讯、影音视听与知识库', sortOrder: 5 },
  { id: 'cat-cross', name: '出海与跨境', icon: 'Globe', description: '海外社媒、独立站工具、跨境金融与合规服务', sortOrder: 6 },
];

const defaultSites: SiteItem[] = [
  {
    id: 'site-1',
    title: 'Google Gemini',
    url: 'https://gemini.google.com',
    description: '谷歌次世代多模态大模型，具备极高的逻辑推理、编码与长文本理解能力。',
    categoryId: 'cat-ai',
    iconUrl: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
    tags: ['AI模型', '谷歌', '多模态', '免费/高级'],
    isPinned: true,
    isFeatured: true,
    minVipTier: 'all',
    status: 'approved',
    submitterId: null,
    submitterName: '系统预设',
    clickCount: 1420,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'site-2',
    title: 'DeepSeek 深度求索',
    url: 'https://chat.deepseek.com',
    description: '开源推理霸榜模型，在数学、代码与深度思考方面具备极强表现力。',
    categoryId: 'cat-ai',
    iconUrl: 'https://chat.deepseek.com/favicon.ico',
    tags: ['深度思考', '国产之光', '代码神作'],
    isPinned: true,
    isFeatured: true,
    minVipTier: 'all',
    status: 'approved',
    submitterId: null,
    submitterName: '系统预设',
    clickCount: 1980,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'site-3',
    title: 'GitHub',
    url: 'https://github.com',
    description: '全球最大的开源代码托管与协作平台，拥有数千万开发者与开源项目。',
    categoryId: 'cat-dev',
    iconUrl: 'https://github.githubassets.com/favicons/favicon.svg',
    tags: ['代码托管', 'Git', '开源社区'],
    isPinned: true,
    isFeatured: false,
    minVipTier: 'all',
    status: 'approved',
    submitterId: null,
    submitterName: '系统预设',
    clickCount: 1120,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'site-4',
    title: 'Vercel 云部署',
    url: 'https://vercel.com',
    description: '前端与全栈开发者最好的部署托管平台，支持全球边缘加速与一键CI/CD。',
    categoryId: 'cat-dev',
    iconUrl: 'https://assets.vercel.com/image/upload/front/favicon/vercel/favicon.ico',
    tags: ['Serverless', '自动化部署', 'Next.js'],
    isPinned: false,
    isFeatured: true,
    minVipTier: 'all',
    status: 'approved',
    submitterId: null,
    submitterName: '系统预设',
    clickCount: 890,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'site-5',
    title: 'Figma 协同设计',
    url: 'https://www.figma.com',
    description: '行业标杆级多人实时协作UI/UX矢量设计工具，拥有极其丰富的插件生态。',
    categoryId: 'cat-design',
    iconUrl: 'https://static.figma.com/app/icon/1/favicon.png',
    tags: ['UI设计', '原型设计', '团队协同'],
    isPinned: false,
    isFeatured: true,
    minVipTier: 'all',
    status: 'approved',
    submitterId: null,
    submitterName: '系统预设',
    clickCount: 760,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'site-6',
    title: 'Midjourney 创意生图',
    url: 'https://www.midjourney.com',
    description: '顶尖AI绘画与概念艺术生成工具，质感、光影、构图无可匹敌。',
    categoryId: 'cat-design',
    iconUrl: 'https://www.midjourney.com/favicon.ico',
    tags: ['AI作图', '艺术设计', 'VIP专属'],
    isPinned: false,
    isFeatured: true,
    minVipTier: 'vip',
    status: 'approved',
    submitterId: null,
    submitterName: '系统预设',
    clickCount: 1530,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'site-7',
    title: 'TinyPNG 智能图片压缩',
    url: 'https://tinypng.com',
    description: '优秀的智能有损压缩技术，极大减小WebP/PNG/JPG文件大小并保持高质量。',
    categoryId: 'cat-tools',
    iconUrl: 'https://tinypng.com/images/favicon.ico',
    tags: ['图片压缩', 'Web优化', '站长工具'],
    isPinned: false,
    isFeatured: false,
    minVipTier: 'all',
    status: 'approved',
    submitterId: null,
    submitterName: '系统预设',
    clickCount: 620,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'site-8',
    title: 'Product Hunt 科技新品',
    url: 'https://www.producthunt.com',
    description: '每日全球科技创业新产品、AI工具、SaaS服务的首发与投票发现平台。',
    categoryId: 'cat-media',
    iconUrl: 'https://ph-static.imgix.net/ph-favicon-coral.ico',
    tags: ['科技趋势', '独立开发', '新品发布'],
    isPinned: false,
    isFeatured: true,
    minVipTier: 'all',
    status: 'approved',
    submitterId: null,
    submitterName: '系统预设',
    clickCount: 540,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'site-9',
    title: 'Stripe 国际在线支付',
    url: 'https://stripe.com',
    description: '全球互联网经济的金融基础设施，支持全球主流货币与银行卡合规结算。',
    categoryId: 'cat-cross',
    iconUrl: 'https://stripe.com/favicon.ico',
    tags: ['出海支付', 'SaaS计费', '跨境金融'],
    isPinned: false,
    isFeatured: false,
    minVipTier: 'all',
    status: 'approved',
    submitterId: null,
    submitterName: '系统预设',
    clickCount: 430,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'site-10',
    title: 'Cursor AI 编程神器',
    url: 'https://www.cursor.com',
    description: '专为与AI协同编程构建的下一代代码编辑器，大幅加速软件开发生命周期。',
    categoryId: 'cat-dev',
    iconUrl: 'https://www.cursor.com/favicon.ico',
    tags: ['AI编码', 'VSCode深度融合', '生产力'],
    isPinned: true,
    isFeatured: true,
    minVipTier: 'vip',
    status: 'approved',
    submitterId: null,
    submitterName: '系统预设',
    clickCount: 1670,
    createdAt: new Date().toISOString(),
  }
];

const defaultInviteCodes: InviteCode[] = [
  {
    id: 'code-1',
    code: 'VIP888-2026',
    vipDays: 30,
    vipTier: 'vip',
    vipTierName: 'VIP黄金会员 (月卡)',
    status: 'unused',
    usedByUserId: null,
    usedByUsername: null,
    usedAt: null,
    createdAt: new Date().toISOString(),
    remark: '新手赠送体验月卡',
  },
  {
    id: 'code-2',
    code: 'VIP-ANNUAL-999',
    vipDays: 365,
    vipTier: 'vip',
    vipTierName: 'VIP黄金会员 (年卡)',
    status: 'unused',
    usedByUserId: null,
    usedByUsername: null,
    usedAt: null,
    createdAt: new Date().toISOString(),
    remark: '年度会员尊享码',
  },
  {
    id: 'code-3',
    code: 'SVIP-FOREVER-KING',
    vipDays: 9999, // Lifetime
    vipTier: 'svip',
    vipTierName: 'SVIP至尊会员 (永久有效)',
    status: 'unused',
    usedByUserId: null,
    usedByUsername: null,
    usedAt: null,
    createdAt: new Date().toISOString(),
    remark: '终身至尊VIP特权邀请码',
  },
  {
    id: 'code-4',
    code: 'START-FREE-7DAYS',
    vipDays: 7,
    vipTier: 'vip',
    vipTierName: 'VIP体验卡 (7天)',
    status: 'unused',
    usedByUserId: null,
    usedByUsername: null,
    usedAt: null,
    createdAt: new Date().toISOString(),
    remark: '官方社区限时发放',
  },
  {
    id: 'code-5',
    code: 'AURORA-PRO-666',
    vipDays: 90,
    vipTier: 'svip',
    vipTierName: 'SVIP至尊会员 (季卡)',
    status: 'unused',
    usedByUserId: null,
    usedByUsername: null,
    usedAt: null,
    createdAt: new Date().toISOString(),
    remark: '高阶资源特权码',
  }
];

const defaultAds: AdItem[] = [
  {
    id: 'ad-top-1',
    title: '全球高防云服务器与AI算力节点特惠',
    position: 'top_banner',
    imageUrl: '/src/assets/images/ad_banner_tech_1792330416603.jpg',
    targetUrl: 'https://cloud.google.com',
    badgeText: '官方赞助',
    description: '企业级独立IP/CN2 GIA极速回国线路，新客立减50%，点击了解详情。',
    isActive: true,
    clickCount: 382,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ad-card-1',
    title: '独家海外虚拟信用卡开卡平台',
    position: 'grid_sponsor',
    imageUrl: '',
    targetUrl: 'https://stripe.com',
    badgeText: '黄金赞助位',
    description: '支持订阅OpenAI ChatGPT Plus、Claude Pro、Midjourney，0年费极速开卡。',
    isActive: true,
    clickCount: 219,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ad-card-2',
    title: 'AI自动化引流与出海跨境工具包',
    position: 'grid_sponsor',
    imageUrl: '',
    targetUrl: 'https://github.com',
    badgeText: '精选推广',
    description: '一键同步多平台内容、海外社交裂变与SEO霸屏软件整合方案。',
    isActive: true,
    clickCount: 145,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
  }
];

const defaultSettings: SystemSettings = {
  installed: true,
  siteName: '极光VIP会员导航',
  siteSlogan: '精选高价值互联网工具与资源 · 邀请制VIP会员直达',
  siteNotice: '📢 欢迎光临极光导航！点击任意网站卡片需登录会员；新用户使用专属邀请码注册即刻激活VIP特权！',
  showNotice: true,
  invitePurchaseUrl: 'https://t.me/aurora_vip_nav',
  invitePurchaseButtonText: '获取专属邀请码',
  forceLoginToViewUrl: true,
  allowPublicSubmission: true,
  autoApproveSubmission: false,
  defaultVipDays: 30,
  contactEmail: 'admin@auroranav.com',
  telegramGroup: '@aurora_vip_nav'
};

const defaultUsers: User[] = [
  {
    id: 'user-admin',
    username: 'admin',
    nickname: '超级管理员',
    passwordHash: defaultAdminHash,
    salt: defaultAdminSalt,
    role: 'admin',
    vipTier: 'svip',
    vipTierName: 'SVIP至尊会员',
    vipExpireAt: null, // Lifetime
    createdAt: new Date().toISOString(),
    status: 'active',
  },
  {
    id: 'user-demo-vip',
    username: 'vip_user',
    nickname: '体验体验者',
    passwordHash: hashPassword('123456', 'salt_demo_vip_123'),
    salt: 'salt_demo_vip_123',
    role: 'user',
    vipTier: 'vip',
    vipTierName: 'VIP黄金会员',
    vipExpireAt: Date.now() + 30 * 86400 * 1000, // 30 days
    inviteCodeUsed: 'VIP888-2026',
    createdAt: new Date().toISOString(),
    status: 'active',
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          settings: { ...defaultSettings, ...(parsed.settings || {}) },
          users: parsed.users || defaultUsers,
          inviteCodes: parsed.inviteCodes || defaultInviteCodes,
          categories: parsed.categories || defaultCategories,
          sites: parsed.sites || defaultSites,
          ads: parsed.ads || defaultAds,
          sessions: parsed.sessions || {},
        };
      }
    } catch (e) {
      console.error('Failed to load database file, using defaults:', e);
    }

    const initial: DatabaseSchema = {
      settings: defaultSettings,
      users: defaultUsers,
      inviteCodes: defaultInviteCodes,
      categories: defaultCategories,
      sites: defaultSites,
      ads: defaultAds,
      sessions: {},
    };
    this.save(initial);
    return initial;
  }

  private save(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data = dataToSave || this.data;
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save database file:', e);
    }
  }

  // --- Settings ---
  getSettings(): SystemSettings {
    return { ...this.data.settings };
  }

  updateSettings(partial: Partial<SystemSettings>): SystemSettings {
    this.data.settings = { ...this.data.settings, ...partial };
    this.save();
    return this.data.settings;
  }

  // --- Users & Sessions ---
  findUserByUsername(username: string): User | undefined {
    return this.data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  findUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  listUsers(): User[] {
    return [...this.data.users];
  }

  createUser(user: User): User {
    this.data.users.push(user);
    this.save();
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return undefined;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    return this.data.users[idx];
  }

  deleteUser(id: string): boolean {
    const len = this.data.users.length;
    this.data.users = this.data.users.filter(u => u.id !== id);
    if (this.data.users.length !== len) {
      this.save();
      return true;
    }
    return false;
  }

  createSession(userId: string): string {
    const token = generateToken();
    this.data.sessions[token] = { userId, createdAt: Date.now() };
    this.save();
    return token;
  }

  getSessionUser(token: string): User | undefined {
    if (!token) return undefined;
    const session = this.data.sessions[token];
    if (!session) return undefined;
    const user = this.findUserById(session.userId);
    if (!user || user.status === 'banned') return undefined;
    return user;
  }

  destroySession(token: string) {
    if (this.data.sessions[token]) {
      delete this.data.sessions[token];
      this.save();
    }
  }

  // --- Invite Codes ---
  listInviteCodes(): InviteCode[] {
    return [...this.data.inviteCodes];
  }

  findInviteCode(codeStr: string): InviteCode | undefined {
    return this.data.inviteCodes.find(c => c.code.trim().toUpperCase() === codeStr.trim().toUpperCase());
  }

  createInviteCodes(newCodes: InviteCode[]): InviteCode[] {
    this.data.inviteCodes.unshift(...newCodes);
    this.save();
    return newCodes;
  }

  updateInviteCode(id: string, updates: Partial<InviteCode>): InviteCode | undefined {
    const idx = this.data.inviteCodes.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    this.data.inviteCodes[idx] = { ...this.data.inviteCodes[idx], ...updates };
    this.save();
    return this.data.inviteCodes[idx];
  }

  deleteInviteCode(id: string): boolean {
    const len = this.data.inviteCodes.length;
    this.data.inviteCodes = this.data.inviteCodes.filter(c => c.id !== id);
    if (this.data.inviteCodes.length !== len) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Categories ---
  listCategories(): Category[] {
    return [...this.data.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  createCategory(category: Category): Category {
    this.data.categories.push(category);
    this.save();
    return category;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | undefined {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.save();
    return this.data.categories[idx];
  }

  deleteCategory(id: string): boolean {
    const len = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    if (this.data.categories.length !== len) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Sites ---
  listSites(includePending = false): SiteItem[] {
    if (includePending) {
      return [...this.data.sites];
    }
    return this.data.sites.filter(s => s.status === 'approved');
  }

  findSiteById(id: string): SiteItem | undefined {
    return this.data.sites.find(s => s.id === id);
  }

  createSite(site: SiteItem): SiteItem {
    this.data.sites.unshift(site);
    this.save();
    return site;
  }

  updateSite(id: string, updates: Partial<SiteItem>): SiteItem | undefined {
    const idx = this.data.sites.findIndex(s => s.id === id);
    if (idx === -1) return undefined;
    this.data.sites[idx] = { ...this.data.sites[idx], ...updates };
    this.save();
    return this.data.sites[idx];
  }

  deleteSite(id: string): boolean {
    const len = this.data.sites.length;
    this.data.sites = this.data.sites.filter(s => s.id !== id);
    if (this.data.sites.length !== len) {
      this.save();
      return true;
    }
    return false;
  }

  incrementSiteClick(id: string): number {
    const site = this.data.sites.find(s => s.id === id);
    if (site) {
      site.clickCount = (site.clickCount || 0) + 1;
      this.save();
      return site.clickCount;
    }
    return 0;
  }

  // --- Ads ---
  listAds(onlyActive = true): AdItem[] {
    if (onlyActive) {
      return this.data.ads.filter(a => a.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return [...this.data.ads].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  createAd(ad: AdItem): AdItem {
    this.data.ads.push(ad);
    this.save();
    return ad;
  }

  updateAd(id: string, updates: Partial<AdItem>): AdItem | undefined {
    const idx = this.data.ads.findIndex(a => a.id === id);
    if (idx === -1) return undefined;
    this.data.ads[idx] = { ...this.data.ads[idx], ...updates };
    this.save();
    return this.data.ads[idx];
  }

  deleteAd(id: string): boolean {
    const len = this.data.ads.length;
    this.data.ads = this.data.ads.filter(a => a.id !== id);
    if (this.data.ads.length !== len) {
      this.save();
      return true;
    }
    return false;
  }

  incrementAdClick(id: string): number {
    const ad = this.data.ads.find(a => a.id === id);
    if (ad) {
      ad.clickCount = (ad.clickCount || 0) + 1;
      this.save();
      return ad.clickCount;
    }
    return 0;
  }

  // --- Reset demo data ---
  resetToDemo(): void {
    this.data = {
      settings: defaultSettings,
      users: defaultUsers,
      inviteCodes: defaultInviteCodes,
      categories: defaultCategories,
      sites: defaultSites,
      ads: defaultAds,
      sessions: {},
    };
    this.save();
  }
}

export const db = new Database();
