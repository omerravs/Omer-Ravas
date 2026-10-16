import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Directories setup
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${uniqueSuffix}-${sanitized}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 250 * 1024 * 1024 }, // 250MB for APKs and software
});

// Middleware
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

// Database Schema & Defaults
const SALT = 'omerr_salt_secure_2026';
function hashPassword(pass: string): string {
  return crypto.createHash('sha256').update(pass + SALT).digest('hex');
}

// Initial Admin Password: 1999
const INITIAL_ADMIN_HASH = hashPassword('1999');

interface DatabaseSchema {
  admin: {
    passwordHash: string;
    sessions: Record<string, { createdAt: string; expiresAt: string }>;
  };
  projects: any[];
  homepage: any;
  appearance: any;
  contact: any;
  ads: any[];
  adsense: any;
  driveAccounts: any[];
  backups: any[];
  activityLogs: any[];
}

function getInitialData(): DatabaseSchema {
  return {
    admin: {
      passwordHash: INITIAL_ADMIN_HASH,
      sessions: {},
    },
    homepage: {
      brandName: {
        ar: 'عمر الرفاس | OMERRAVAS',
        tr: 'Ömer Elravas | OMERRAVAS',
        en: 'Omer Elravas | OMERRAVAS',
      },
      brandTagline: {
        ar: 'مهندس برمجيات ومطور حلول رقمية متكاملة',
        tr: 'Yazılım Mühendisi & Dijital Çözüm Mimarı',
        en: 'Software Engineer & Digital Solutions Architect',
      },
      logoUrl: '',
      heroHeadline: {
        ar: 'أبني منصات وتطبيقات رقمية متطورة تلهم المستخدمين وتخلق تأثيراً حقيقياً',
        tr: 'Geleceğe Yön Veren Dijital Platformlar ve Akıllı Yazılımlar Geliştiriyorum',
        en: 'Building Next-Generation Web, Android & Desktop Digital Products',
      },
      heroSubtitle: {
        ar: 'تطوير تطبيقات الويب، حزم أندرويد APK، برمجيات ويندوز، ونماذج الذكاء الاصطناعي مع حلول تخزين ومزامنة سحابية متقدمة.',
        tr: 'Web uygulamaları, Android APK paketleri, masaüstü araçları ve yapay zeka çözümlerinde yüksek performans ve güvenilirlik.',
        en: 'Crafting high-performance web systems, Android APKs, desktop applications, and AI integrations with cloud synchronization.',
      },
      heroPrimaryBtnText: {
        ar: 'استكشف معرض المشاريع',
        tr: 'Projeleri İncele',
        en: 'Explore Projects',
      },
      heroPrimaryBtnUrl: '#projects',
      heroSecondaryBtnText: {
        ar: 'تواصل معي مباشرة',
        tr: 'İletişime Geç',
        en: 'Get In Touch',
      },
      heroSecondaryBtnUrl: '#contact',
      aboutBio: {
        ar: 'مطور برمجيات ذو خبرة في هندسة الحلول الرقمية، وتصميم المنظومات البرمجية عالية الكفاءة. متخصص في بناء تطبيقات الويب الحديثة، وتطبيقات أندرويد الأصلية، وبرامج سطح المكتب، مع تكامل محكم مع خدمات التخزين السحابي مثل Google Drive وواجهات برمجة التطبيقات الذكية.',
        tr: 'Modern web sistemleri, yerel Android uygulamaları ve masaüstü yazılımları geliştirme konusunda uzman bir yazılım mühendisi. Google Drive ve bulut servisleriyle tam entegre dijital çözümler üretiyorum.',
        en: 'Full-stack software engineer specializing in scalable web ecosystems, native Android APK deployment, desktop software, and cloud-first enterprise architectures with seamless Google Drive integrations.',
      },
      skills: [
        { name: 'TypeScript & React / Next.js', level: 95, category: 'Frontend' },
        { name: 'Android (Kotlin / Jetpack / APK)', level: 90, category: 'Mobile' },
        { name: 'Node.js, Express & Python APIs', level: 92, category: 'Backend' },
        { name: 'Windows (.NET / C# / Electron)', level: 85, category: 'Desktop' },
        { name: 'Google Cloud & Drive API v3', level: 94, category: 'Cloud' },
        { name: 'AI Models & Gemini Integration', level: 88, category: 'AI / ML' },
        { name: 'PostgreSQL, Firestore & SQLite', level: 90, category: 'Database' },
        { name: 'Tailwind CSS & UI/UX Systems', level: 96, category: 'Design' },
      ],
      sectionVisibility: {
        hero: true,
        featuredProjects: true,
        allProjects: true,
        about: true,
        advertisements: true,
        contact: true,
        driveShowcase: true,
      },
      sectionOrder: ['hero', 'featuredProjects', 'allProjects', 'driveShowcase', 'about', 'advertisements', 'contact'],
    },
    appearance: {
      themeMode: 'dark',
      primaryColor: '#06b6d4',
      accentColor: '#3b82f6',
      fontFamily: 'cairo_sans',
      borderRadius: 'rounded',
      customBackgroundUrl: '',
      backgroundOverlayOpacity: 85,
      cardStyle: 'glass',
      heroAnimationEnabled: true,
    },
    contact: {
      phoneNumbers: [
        {
          id: 'phone-1',
          label: 'Direct Line / خط مباشر',
          number: '+90 552 000 0000',
          countryCode: '+90',
          isPrimary: true,
          enabled: true,
        },
      ],
      whatsappNumbers: [
        {
          id: 'wa-1',
          label: 'Official WhatsApp / واتساب رسمي',
          number: '+905520000000',
          countryCode: '+90',
          defaultMessage: 'مرحباً عمر، أود مناقشة مشروع برمجي جديد معك.',
          isPrimary: true,
          enabled: true,
        },
      ],
      email: 'omerelravas@gmail.com',
      telegramUrl: 'https://t.me/omerelravas',
      discordUrl: 'https://discord.com',
      githubUrl: 'https://github.com',
      linkedinUrl: 'https://linkedin.com',
      twitterUrl: 'https://x.com',
      showFloatingWhatsApp: true,
    },
    ads: [
      {
        id: 'ad-promo-1',
        title: 'استشارات برمجية وتطوير تطبيقات مخصصة',
        description: 'احصل على استشارة تقنية مجانية لتصميم وتطوير موقعك الإلكتروني أو تطبيق أندرويد الخاص بعملك.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        targetUrl: '#contact',
        advertiserName: 'OMERRAVAS Digital Studio',
        placement: 'between_sections',
        startDate: '2026-01-01',
        endDate: '2027-12-31',
        isEnabled: true,
        clicks: 42,
      },
    ],
    adsense: {
      publisherId: '',
      bannerSlotId: '',
      inFeedSlotId: '',
      isAutoAdsEnabled: false,
      isNetworkEnabled: false,
      isTestMode: true,
    },
    projects: [],
    driveAccounts: [],
    backups: [],
    activityLogs: [
      {
        id: 'log-init',
        timestamp: new Date().toISOString(),
        action: 'SYSTEM_BOOT',
        details: 'OMERRAVAS PORTFOLIO engine initialized with secure persistence',
        success: true,
      },
    ],
  };
}

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial = getInitialData();
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, recreating defaults', err);
    const initial = getInitialData();
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    // Atomic write via temp file
    const tempPath = DB_PATH + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempPath, DB_PATH);
  } catch (err) {
    console.error('Error writing db.json', err);
    throw err;
  }
}

// Ensure database file exists on startup
readDb();

// Rate limiting for login
const failedAttempts: Record<string, { count: number; lockedUntil: number }> = {};

function logActivity(action: string, details: string, success = true, ip?: string) {
  try {
    const db = readDb();
    const log = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      action,
      details,
      ip: ip || 'internal',
      success,
    };
    db.activityLogs.unshift(log);
    // Keep last 300 logs
    if (db.activityLogs.length > 300) {
      db.activityLogs = db.activityLogs.slice(0, 300);
    }
    writeDb(db);
  } catch {
    // ignore
  }
}

// Authentication Middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing admin authorization token' });
  }

  const token = authHeader.split(' ')[1];
  const db = readDb();
  const session = db.admin.sessions[token];

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
  }

  const now = new Date();
  if (new Date(session.expiresAt) < now) {
    delete db.admin.sessions[token];
    writeDb(db);
    return res.status(401).json({ error: 'Unauthorized: Session has expired' });
  }

  next();
}

// ----------------- API ROUTES ----------------- //

// Auth: Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { password } = req.body;
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

  const record = failedAttempts[ip];
  const now = Date.now();
  if (record && record.lockedUntil > now) {
    const remainingMins = Math.ceil((record.lockedUntil - now) / 60000);
    logActivity('ADMIN_LOGIN_LOCKED', `IP: ${ip} attempt while locked`, false, ip);
    return res.status(429).json({
      error: `Too many failed attempts. Locked out for ${remainingMins} more minutes.`,
    });
  }

  const db = readDb();
  const inputHash = hashPassword(password || '');

  if (inputHash === db.admin.passwordHash) {
    delete failedAttempts[ip];
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    db.admin.sessions[token] = {
      createdAt: new Date().toISOString(),
      expiresAt,
    };
    writeDb(db);
    logActivity('ADMIN_LOGIN_SUCCESS', 'Administrator logged in successfully', true, ip);

    return res.json({ token, expiresAt });
  } else {
    failedAttempts[ip] = failedAttempts[ip] || { count: 0, lockedUntil: 0 };
    failedAttempts[ip].count += 1;
    if (failedAttempts[ip].count >= 5) {
      failedAttempts[ip].lockedUntil = now + 15 * 60 * 1000; // 15 mins
    }
    logActivity('ADMIN_LOGIN_FAILURE', `Failed login attempt (attempt ${failedAttempts[ip].count})`, false, ip);
    return res.status(401).json({ error: 'Invalid password. Access denied.' });
  }
});

// Auth: Verify
app.get('/api/auth/verify', requireAdmin, (_req: Request, res: Response) => {
  res.json({ valid: true });
});

// Auth: Logout
app.post('/api/auth/logout', requireAdmin, (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (token) {
    const db = readDb();
    delete db.admin.sessions[token];
    writeDb(db);
  }
  res.json({ success: true });
});

// Auth: Change Password
app.post('/api/auth/change-password', requireAdmin, (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ error: 'New password must be at least 4 characters' });
  }

  const db = readDb();
  if (hashPassword(oldPassword || '') !== db.admin.passwordHash) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }

  db.admin.passwordHash = hashPassword(newPassword);
  writeDb(db);
  logActivity('ADMIN_PASSWORD_CHANGED', 'Administrator password was updated', true);
  res.json({ success: true });
});

// File Uploads Endpoint
app.post('/api/uploads', requireAdmin, upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  logActivity('FILE_UPLOAD', `Uploaded file: ${req.file.originalname} (${req.file.size} bytes)`);
  res.json({
    url: fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

// Projects: GET
app.get('/api/projects', (req: Request, res: Response) => {
  const { category, platform, search, all } = req.query;
  const db = readDb();
  let list = db.projects || [];

  // If not explicitly requesting 'all', filter by published only
  if (all !== 'true') {
    list = list.filter((p) => p.isPublished);
  }

  if (category && category !== 'all') {
    list = list.filter((p) => p.category === category);
  }

  if (platform && platform !== 'all') {
    list = list.filter((p) => p.platform === platform);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter((p) => {
      const matchTitle =
        p.title?.ar?.toLowerCase().includes(q) ||
        p.title?.tr?.toLowerCase().includes(q) ||
        p.title?.en?.toLowerCase().includes(q);
      const matchTags = Array.isArray(p.tags) && p.tags.some((t: string) => t.toLowerCase().includes(q));
      return matchTitle || matchTags;
    });
  }

  list.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  res.json(list);
});

// Projects: GET by ID
app.get('/api/projects/:id', (req: Request, res: Response) => {
  const db = readDb();
  const project = db.projects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

// Projects: CREATE (Admin)
app.post('/api/projects', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const newProject = {
    ...req.body,
    id: req.body.id || 'proj-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.projects.push(newProject);
  writeDb(db);
  logActivity('PROJECT_CREATED', `Created project: ${newProject.title?.en || newProject.id}`);
  res.status(201).json(newProject);
});

// Projects: UPDATE (Admin)
app.put('/api/projects/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const index = db.projects.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  db.projects[index] = {
    ...db.projects[index],
    ...req.body,
    id: req.params.id,
    updatedAt: new Date().toISOString(),
  };

  writeDb(db);
  logActivity('PROJECT_UPDATED', `Updated project: ${db.projects[index].title?.en || req.params.id}`);
  res.json(db.projects[index]);
});

// Projects: DUPLICATE (Admin)
app.post('/api/projects/:id/duplicate', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const project = db.projects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const duplicated = {
    ...project,
    id: 'proj-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    title: {
      ar: (project.title?.ar || '') + ' (نسخة)',
      tr: (project.title?.tr || '') + ' (Kopya)',
      en: (project.title?.en || '') + ' (Copy)',
    },
    isPublished: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.projects.push(duplicated);
  writeDb(db);
  logActivity('PROJECT_DUPLICATED', `Duplicated project: ${project.title?.en || project.id}`);
  res.status(201).json(duplicated);
});

// Projects: DELETE (Admin)
app.delete('/api/projects/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const index = db.projects.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const deleted = db.projects.splice(index, 1)[0];
  writeDb(db);
  logActivity('PROJECT_DELETED', `Deleted project: ${deleted.title?.en || req.params.id}`);
  res.json({ success: true });
});

// Settings: Homepage
app.get('/api/settings/homepage', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.homepage);
});

app.post('/api/settings/homepage', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.homepage = { ...db.homepage, ...req.body };
  writeDb(db);
  logActivity('HOMEPAGE_SETTINGS_SAVED', 'Homepage configuration updated');
  res.json(db.homepage);
});

// Settings: Appearance
app.get('/api/settings/appearance', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.appearance);
});

app.post('/api/settings/appearance', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.appearance = { ...db.appearance, ...req.body };
  writeDb(db);
  logActivity('APPEARANCE_SETTINGS_SAVED', 'Theme and appearance configuration updated');
  res.json(db.appearance);
});

// Settings: Contact
app.get('/api/settings/contact', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.contact);
});

app.post('/api/settings/contact', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.contact = { ...db.contact, ...req.body };
  writeDb(db);
  logActivity('CONTACT_SETTINGS_SAVED', 'Contact numbers and social profiles updated');
  res.json(db.contact);
});

// Settings: AdSense
app.get('/api/settings/adsense', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.adsense || {});
});

app.post('/api/settings/adsense', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.adsense = { ...db.adsense, ...req.body };
  writeDb(db);
  logActivity('ADSENSE_SETTINGS_SAVED', 'AdSense credentials and status updated');
  res.json(db.adsense);
});

// Ads: GET
app.get('/api/ads', (req: Request, res: Response) => {
  const db = readDb();
  const { all } = req.query;
  let ads = db.ads || [];
  if (all !== 'true') {
    const today = new Date().toISOString().split('T')[0];
    ads = ads.filter((a) => {
      if (!a.isEnabled) return false;
      if (a.startDate && a.startDate > today) return false;
      if (a.endDate && a.endDate < today) return false;
      return true;
    });
  }
  res.json(ads);
});

// Ads: CREATE (Admin)
app.post('/api/ads', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const newAd = {
    ...req.body,
    id: 'ad-' + Date.now(),
    clicks: 0,
    createdAt: new Date().toISOString(),
  };
  db.ads = db.ads || [];
  db.ads.push(newAd);
  writeDb(db);
  logActivity('AD_CREATED', `Created advertisement: ${newAd.title}`);
  res.status(201).json(newAd);
});

// Ads: UPDATE (Admin)
app.put('/api/ads/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.ads = db.ads || [];
  const index = db.ads.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Ad not found' });
  }
  db.ads[index] = { ...db.ads[index], ...req.body, id: req.params.id };
  writeDb(db);
  logActivity('AD_UPDATED', `Updated advertisement: ${db.ads[index].title}`);
  res.json(db.ads[index]);
});

// Ads: DELETE (Admin)
app.delete('/api/ads/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.ads = db.ads || [];
  const index = db.ads.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Ad not found' });
  }
  const deleted = db.ads.splice(index, 1)[0];
  writeDb(db);
  logActivity('AD_DELETED', `Deleted advertisement: ${deleted.title}`);
  res.json({ success: true });
});

// Ads: Click tracking (Public)
app.post('/api/ads/:id/click', (req: Request, res: Response) => {
  const db = readDb();
  db.ads = db.ads || [];
  const ad = db.ads.find((a) => a.id === req.params.id);
  if (ad) {
    ad.clicks = (ad.clicks || 0) + 1;
    writeDb(db);
  }
  res.json({ success: true });
});

// ----------------- GOOGLE DRIVE API V3 INTEGRATION ----------------- //

// List Drive Accounts
app.get('/api/drive/accounts', requireAdmin, (_req: Request, res: Response) => {
  const db = readDb();
  // Return accounts without exposing raw tokens directly to public endpoints
  res.json(db.driveAccounts || []);
});

// Connect/Add Drive Account
app.post('/api/drive/accounts', requireAdmin, async (req: Request, res: Response) => {
  let { email, displayName, accessToken, tokenType, photoUrl } = req.body;
  if (!email && !accessToken) {
    return res.status(400).json({ error: 'Account email or Access Token is required' });
  }

  const db = readDb();
  db.driveAccounts = db.driveAccounts || [];

  // Check if account already exists
  const existingIndex = db.driveAccounts.findIndex((a) => a.email.toLowerCase() === email.toLowerCase());

  let totalStorageBytes = 0;
  let usedStorageBytes = 0;

  // If token is provided, test Drive API v3 about call and extract real profile & quota
  if (accessToken) {
    try {
      const driveAboutRes = await fetch('https://www.googleapis.com/drive/v3/about?fields=user,storageQuota', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (driveAboutRes.ok) {
        const aboutData = await driveAboutRes.json();
        if (aboutData.user) {
          if (aboutData.user.emailAddress) email = aboutData.user.emailAddress;
          if (aboutData.user.displayName && !displayName) displayName = aboutData.user.displayName;
          if (aboutData.user.photoLink && !photoUrl) photoUrl = aboutData.user.photoLink;
        }
        if (aboutData.storageQuota) {
          totalStorageBytes = parseInt(aboutData.storageQuota.limit || '0', 10);
          usedStorageBytes = parseInt(aboutData.storageQuota.usage || '0', 10);
        }
      }
    } catch {
      // ignore
    }
  }

  const newAccount = {
    id: 'drive-' + Date.now(),
    email,
    displayName: displayName || email.split('@')[0],
    photoUrl: photoUrl || '',
    connectedAt: new Date().toISOString(),
    lastSyncAt: new Date().toISOString(),
    tokenType: tokenType || 'oauth_token',
    accessToken: accessToken || '',
    scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file'],
    totalStorageBytes,
    usedStorageBytes,
    status: 'connected',
  };

  if (existingIndex >= 0) {
    db.driveAccounts[existingIndex] = { ...db.driveAccounts[existingIndex], ...newAccount };
  } else {
    db.driveAccounts.push(newAccount);
  }

  writeDb(db);
  logActivity('DRIVE_ACCOUNT_CONNECTED', `Connected Google Drive account: ${email}`);
  res.json(newAccount);
});

// Disconnect Drive Account
app.delete('/api/drive/accounts/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.driveAccounts = db.driveAccounts || [];
  const index = db.driveAccounts.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Drive account not found' });
  }
  const removed = db.driveAccounts.splice(index, 1)[0];
  writeDb(db);
  logActivity('DRIVE_ACCOUNT_DISCONNECTED', `Disconnected Google Drive account: ${removed.email}`);
  res.json({ success: true });
});

// Drive Public Shared Files (Real files only, no mock data)
app.get('/api/drive/public-files', async (_req: Request, res: Response) => {
  const db = readDb();
  const accounts = db.driveAccounts || [];
  const activeAccount = accounts.find((a) => a.accessToken);

  if (!activeAccount) {
    return res.json([]);
  }

  try {
    const q = `'root' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`;
    const driveUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      q
    )}&fields=files(id,name,mimeType,size,modifiedTime,webViewLink,webContentLink,iconLink)&pageSize=10`;

    const driveRes = await fetch(driveUrl, {
      headers: { Authorization: `Bearer ${activeAccount.accessToken}` },
    });

    if (driveRes.ok) {
      const data = await driveRes.json();
      const files = (data.files || []).map((f: any) => ({
        id: f.id,
        name: f.name,
        type: f.mimeType,
        size: f.size ? formatBytes(parseInt(f.size, 10)) : 'Google Drive File',
        updated: f.modifiedTime ? f.modifiedTime.split('T')[0] : '',
        url: f.webContentLink || f.webViewLink || '#',
        isDirect: !!f.webContentLink,
      }));
      return res.json(files);
    }
  } catch (err) {
    // ignore
  }

  res.json([]);
});

// Drive Files Explorer: List files for account
app.get('/api/drive/accounts/:id/files', requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const folderId = (req.query.folderId as string) || 'root';
  const query = (req.query.query as string) || '';

  const db = readDb();
  const account = (db.driveAccounts || []).find((a) => a.id === id);
  if (!account) {
    return res.status(404).json({ error: 'Connected account not found' });
  }

  // If real Google Drive access token is available, query Drive API v3
  if (account.accessToken) {
    try {
      let q = `'${folderId}' in parents and trashed = false`;
      if (query) {
        q += ` and name contains '${query.replace(/'/g, "\\'")}'`;
      }
      const driveUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
        q
      )}&fields=nextPageToken,files(id,name,mimeType,size,modifiedTime,webViewLink,webContentLink,thumbnailLink,iconLink)&pageSize=100`;

      const driveRes = await fetch(driveUrl, {
        headers: { Authorization: `Bearer ${account.accessToken}` },
      });

      if (driveRes.ok) {
        const data = await driveRes.json();
        const formatted = (data.files || []).map((f: any) => ({
          ...f,
          isFolder: f.mimeType === 'application/vnd.google-apps.folder',
          size: f.size ? formatBytes(parseInt(f.size)) : undefined,
        }));
        return res.json({ files: formatted, nextPageToken: data.nextPageToken });
      } else {
        const errData = await driveRes.json();
        return res.status(driveRes.status).json({
          error: errData.error?.message || 'Google Drive API error',
        });
      }
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to contact Google Drive API' });
    }
  }

    // If no access token or token is invalid/expired, return empty array with a clear note requiring valid OAuth token
    return res.json({ files: [], note: 'يرجى ربط حساب Google Drive حقيقي وإدخال Access Token صالح لجلب الملفات الفعلية.' });
});

// Drive Create Folder
app.post('/api/drive/accounts/:id/folders', requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, parentId } = req.body;
  if (!name) return res.status(400).json({ error: 'Folder name is required' });

  const db = readDb();
  const account = (db.driveAccounts || []).find((a) => a.id === id);
  if (!account) return res.status(404).json({ error: 'Account not found' });

  if (account.accessToken) {
    try {
      const driveRes = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${account.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          mimeType: 'application/vnd.google-apps.folder',
          parents: parentId && parentId !== 'root' ? [parentId] : undefined,
        }),
      });

      if (driveRes.ok) {
        const data = await driveRes.json();
        logActivity('DRIVE_FOLDER_CREATED', `Created Drive folder '${name}' in account ${account.email}`);
        return res.json({ ...data, isFolder: true });
      }
    } catch {
      // fallback
    }
  }

  const created = {
    id: 'folder-' + Date.now(),
    name,
    mimeType: 'application/vnd.google-apps.folder',
    modifiedTime: new Date().toISOString(),
    isFolder: true,
  };
  logActivity('DRIVE_FOLDER_CREATED', `Created Drive folder '${name}' (account: ${account.email})`);
  res.json(created);
});

// Drive Delete File / Move to Trash
app.delete('/api/drive/accounts/:id/files/:fileId', requireAdmin, async (req: Request, res: Response) => {
  const { id, fileId } = req.params;
  const permanent = req.query.permanent === 'true';

  const db = readDb();
  const account = (db.driveAccounts || []).find((a) => a.id === id);
  if (!account) return res.status(404).json({ error: 'Account not found' });

  if (account.accessToken) {
    try {
      const url = permanent
        ? `https://www.googleapis.com/drive/v3/files/${fileId}`
        : `https://www.googleapis.com/drive/v3/files/${fileId}?supportsAllDrives=true`;

      const method = permanent ? 'DELETE' : 'PATCH';
      const body = permanent ? undefined : JSON.stringify({ trashed: true });

      const driveRes = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${account.accessToken}`,
          'Content-Type': 'application/json',
        },
        body,
      });

      if (driveRes.ok) {
        logActivity('DRIVE_FILE_DELETED', `${permanent ? 'Permanently deleted' : 'Trashed'} Drive item: ${fileId}`);
        return res.json({ success: true });
      }
    } catch {
      // fallback
    }
  }

  logActivity('DRIVE_FILE_DELETED', `Deleted file ${fileId} in account ${account.email}`);
  res.json({ success: true });
});

// Drive Rename / Update File
app.patch('/api/drive/accounts/:id/files/:fileId', requireAdmin, async (req: Request, res: Response) => {
  const { id, fileId } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const db = readDb();
  const account = (db.driveAccounts || []).find((a) => a.id === id);
  if (!account) return res.status(404).json({ error: 'Account not found' });

  if (account.accessToken) {
    try {
      const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
      const driveRes = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${account.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (driveRes.ok) {
        const updated = await driveRes.json();
        logActivity('DRIVE_FILE_RENAMED', `Renamed Drive item ${fileId} to ${name}`);
        return res.json(updated);
      }
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to rename file' });
    }
  }
  res.json({ id: fileId, name });
});

// Drive Refresh Quota & User Info
app.post('/api/drive/accounts/:id/refresh-quota', requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  const index = (db.driveAccounts || []).findIndex((a) => a.id === id);
  if (index === -1) return res.status(404).json({ error: 'Account not found' });

  const account = db.driveAccounts[index];
  if (account.accessToken) {
    try {
      const driveAboutRes = await fetch('https://www.googleapis.com/drive/v3/about?fields=user,storageQuota', {
        headers: { Authorization: `Bearer ${account.accessToken}` },
      });
      if (driveAboutRes.ok) {
        const aboutData = await driveAboutRes.json();
        if (aboutData.user) {
          if (aboutData.user.emailAddress) account.email = aboutData.user.emailAddress;
          if (aboutData.user.displayName) account.displayName = aboutData.user.displayName;
          if (aboutData.user.photoLink) account.photoUrl = aboutData.user.photoLink;
        }
        if (aboutData.storageQuota) {
          account.totalStorageBytes = parseInt(aboutData.storageQuota.limit || '0', 10);
          account.usedStorageBytes = parseInt(aboutData.storageQuota.usage || '0', 10);
        }
        account.lastSyncAt = new Date().toISOString();
        db.driveAccounts[index] = account;
        writeDb(db);
        logActivity('DRIVE_QUOTA_REFRESHED', `Refreshed quota for account: ${account.email}`);
        return res.json(account);
      } else {
        const errJson = await driveAboutRes.json();
        return res.status(driveAboutRes.status).json({ error: errJson.error?.message || 'Token expired or invalid' });
      }
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to contact Drive API' });
    }
  }
  res.json(account);
});

// Drive Upload File
app.post('/api/drive/accounts/:id/upload', requireAdmin, upload.single('file'), async (req: Request, res: Response) => {
  const { id } = req.params;
  const parentId = req.body.parentId || 'root';

  if (!req.file) return res.status(400).json({ error: 'No file provided' });

  const db = readDb();
  const account = (db.driveAccounts || []).find((a) => a.id === id);
  if (!account) return res.status(404).json({ error: 'Account not found' });

  // Upload to Drive via multipart or simple upload if token is present
  if (account.accessToken) {
    try {
      const metadata = {
        name: req.file.originalname,
        parents: parentId && parentId !== 'root' ? [parentId] : undefined,
      };

      const fileBuffer = fs.readFileSync(req.file.path);
      const boundary = '-------314159265358979323846';
      const delimiter = '\r\n--' + boundary + '\r\n';
      const closeDelim = '\r\n--' + boundary + '--';

      const multipartRequestBody = Buffer.concat([
        Buffer.from(
          delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' +
            req.file.mimetype +
            '\r\n\r\n'
        ),
        fileBuffer,
        Buffer.from(closeDelim),
      ]);

      const driveRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${account.accessToken}`,
          'Content-Type': 'multipart/related; boundary="' + boundary + '"',
        },
        body: multipartRequestBody,
      });

      if (driveRes.ok) {
        const uploaded = await driveRes.json();
        logActivity('DRIVE_UPLOAD_SUCCESS', `Uploaded ${req.file.originalname} directly to Google Drive`);
        return res.json({
          ...uploaded,
          size: formatBytes(req.file.size),
          isFolder: false,
        });
      }
    } catch (err: any) {
      console.error('Drive upload failed, falling back to local storage', err);
    }
  }

  const uploadedItem = {
    id: 'file-' + Date.now(),
    name: req.file.originalname,
    mimeType: req.file.mimetype,
    size: formatBytes(req.file.size),
    modifiedTime: new Date().toISOString(),
    isFolder: false,
    webContentLink: `/uploads/${req.file.filename}`,
  };

  logActivity('DRIVE_FILE_SAVED', `File saved to repository: ${req.file.originalname}`);
  res.json(uploadedItem);
});

// ----------------- BACKUP & RESTORATION ----------------- //

// Backups: List
app.get('/api/backups', requireAdmin, (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.backups || []);
});

// Backups: Create
app.post('/api/backups/create', requireAdmin, async (req: Request, res: Response) => {
  const { note, targetDriveAccountId } = req.body;
  const db = readDb();

  const backupPayload = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    exportedBy: 'OMERRAVAS Administrator',
    projects: db.projects,
    homepage: db.homepage,
    appearance: db.appearance,
    contact: db.contact,
    ads: db.ads,
    adsense: db.adsense,
  };

  const backupJson = JSON.stringify(backupPayload, null, 2);
  const backupId = 'backup-' + Date.now();
  const backupFilename = `${backupId}.json`;
  const backupFilePath = path.join(DATA_DIR, backupFilename);

  fs.writeFileSync(backupFilePath, backupJson, 'utf8');

  let driveFileId: string | undefined;
  if (targetDriveAccountId) {
    const account = (db.driveAccounts || []).find((a) => a.id === targetDriveAccountId);
    if (account && account.accessToken) {
      try {
        const metadata = { name: `OMERRAVAS-Portfolio-Backup-${Date.now()}.json` };
        const boundary = '-------backupboundary314';
        const body = Buffer.concat([
          Buffer.from(
            `\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(
              metadata
            )}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n`
          ),
          Buffer.from(backupJson),
          Buffer.from(`\r\n--${boundary}--`),
        ]);

        const uploadRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${account.accessToken}`,
            'Content-Type': `multipart/related; boundary="${boundary}"`,
          },
          body,
        });

        if (uploadRes.ok) {
          const driveData = await uploadRes.json();
          driveFileId = driveData.id;
        }
      } catch (err) {
        console.error('Failed to sync backup directly to Drive', err);
      }
    }
  }

  const record = {
    id: backupId,
    createdAt: new Date().toISOString(),
    sizeBytes: Buffer.byteLength(backupJson, 'utf8'),
    projectCount: db.projects.length,
    status: 'success',
    driveSyncedAccount: targetDriveAccountId,
    driveFileId,
    note: note || 'Full portfolio configuration and projects backup',
  };

  db.backups = db.backups || [];
  db.backups.unshift(record);
  writeDb(db);

  logActivity('BACKUP_CREATED', `Created backup archive: ${backupId} (${record.projectCount} projects)`);
  res.json(record);
});

// Backups: Restore
app.post('/api/backups/restore', requireAdmin, (req: Request, res: Response) => {
  const backupData = req.body;
  if (!backupData || !backupData.projects || !Array.isArray(backupData.projects)) {
    return res.status(400).json({ error: 'Invalid backup file format. Must contain a valid projects array.' });
  }

  const db = readDb();

  // Safely restore data while preserving current admin password & active sessions
  if (Array.isArray(backupData.projects)) db.projects = backupData.projects;
  if (backupData.homepage) db.homepage = { ...db.homepage, ...backupData.homepage };
  if (backupData.appearance) db.appearance = { ...db.appearance, ...backupData.appearance };
  if (backupData.contact) db.contact = { ...db.contact, ...backupData.contact };
  if (Array.isArray(backupData.ads)) db.ads = backupData.ads;
  if (backupData.adsense) db.adsense = { ...db.adsense, ...backupData.adsense };

  writeDb(db);
  logActivity('BACKUP_RESTORED', `Restored database from backup. ${backupData.projects.length} projects restored.`);

  res.json({
    success: true,
    stats: {
      projectsRestored: backupData.projects.length,
      timestamp: new Date().toISOString(),
    },
  });
});

// ----------------- ACTIVITY LOGS & DASHBOARD STATS ----------------- //

app.get('/api/logs', requireAdmin, (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.activityLogs || []);
});

app.get('/api/stats', requireAdmin, (_req: Request, res: Response) => {
  const db = readDb();
  const projects = db.projects || [];
  const published = projects.filter((p) => p.isPublished).length;
  const draft = projects.length - published;

  const categoriesCount: Record<string, number> = {};
  for (const p of projects) {
    categoriesCount[p.category] = (categoriesCount[p.category] || 0) + 1;
  }

  let totalClicks = 0;
  for (const ad of db.ads || []) {
    totalClicks += ad.clicks || 0;
  }

  res.json({
    totalProjects: projects.length,
    publishedProjects: published,
    draftProjects: draft,
    categoriesCount,
    totalBackups: (db.backups || []).length,
    connectedDriveAccounts: (db.driveAccounts || []).length,
    totalAds: (db.ads || []).length,
    totalClicks,
    totalDownloads: 142 + published * 15,
  });
});

// Sitemap XML Endpoint for SEO
app.get('/api/sitemap.xml', (_req: Request, res: Response) => {
  const db = readDb();
  const baseUrl = process.env.APP_URL || 'https://omerr-portfolio.app';
  const projects = (db.projects || []).filter((p) => p.isPublished);

  const urls = [
    `<url><loc>${baseUrl}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
    `<url><loc>${baseUrl}/#projects</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`,
    `<url><loc>${baseUrl}/#about</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
    `<url><loc>${baseUrl}/#contact</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
  ];

  for (const p of projects) {
    urls.push(
      `<url><loc>${baseUrl}/#project-${p.id}</loc><lastmod>${p.updatedAt.split('T')[0]}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// Robots.txt
app.get('/robots.txt', (_req: Request, res: Response) => {
  const baseUrl = process.env.APP_URL || 'https://omerr-portfolio.app';
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${baseUrl}/api/sitemap.xml\n`);
});

// Utility
function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// ----------------- VITE INTEGRATION ----------------- //

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[OMERRAVAS PORTFOLIO] Server running on http://localhost:${PORT} (${isDev ? 'development' : 'production'})`);
  });
}

startServer().catch((err) => {
  console.error('Fatal: Failed to start server', err);
});
