export type Language = 'ar' | 'tr' | 'en';

export interface LocalizedString {
  ar: string;
  tr: string;
  en: string;
}

export type ProjectCategory = 'web' | 'android' | 'windows' | 'ai' | 'tools' | 'services' | 'design';

export type ProjectPlatform = 'Web App' | 'Android APK' | 'Windows Desktop' | 'AI / ML' | 'API / Service' | 'UI / UX Design';

export interface Project {
  id: string;
  title: LocalizedString;
  shortDescription: LocalizedString;
  fullDescription: LocalizedString;
  category: ProjectCategory;
  platform: ProjectPlatform;
  tags: string[];
  mainImage: string;
  screenshots: string[];
  websiteUrl?: string;
  downloadUrl?: string;
  apkFileUrl?: string;
  desktopFileUrl?: string;
  version: string;
  releaseDate: string;
  isPublished: boolean;
  isFeatured: boolean;
  displayOrder: number;
  fileSize?: string;
  requireDownloadPassword?: boolean;
  downloadPassword?: string;
  downloadPasswordHint?: string;
  driveFileId?: string;
  seoTitle?: LocalizedString;
  seoDescription?: LocalizedString;
  createdAt: string;
  updatedAt: string;
}

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  advertiserName: string;
  placement: 'hero_banner' | 'between_sections' | 'project_gallery' | 'footer';
  startDate: string;
  endDate: string;
  isEnabled: boolean;
  clicks: number;
}

export interface AdSenseConfig {
  publisherId: string;
  bannerSlotId: string;
  inFeedSlotId: string;
  isAutoAdsEnabled: boolean;
  isNetworkEnabled: boolean;
  isTestMode: boolean;
}

export interface ContactInfo {
  phoneNumbers: {
    id: string;
    label: string;
    number: string;
    countryCode: string;
    isPrimary: boolean;
    enabled: boolean;
  }[];
  whatsappNumbers: {
    id: string;
    label: string;
    number: string;
    countryCode: string;
    defaultMessage: string;
    isPrimary: boolean;
    enabled: boolean;
  }[];
  email: string;
  telegramUrl: string;
  discordUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  showFloatingWhatsApp: boolean;
}

export interface AppearanceSettings {
  themeMode: 'dark' | 'light' | 'system';
  primaryColor: string; // hex or tailwind token
  accentColor: string;
  fontFamily: 'cairo_sans' | 'inter' | 'mono';
  borderRadius: 'rounded' | 'sharp' | 'pill';
  customBackgroundUrl: string;
  backgroundOverlayOpacity: number;
  cardStyle: 'glass' | 'solid' | 'bordered';
  heroAnimationEnabled: boolean;
}

export interface HomepageSettings {
  brandName: LocalizedString;
  brandTagline: LocalizedString;
  logoUrl: string;
  heroHeadline: LocalizedString;
  heroSubtitle: LocalizedString;
  heroPrimaryBtnText: LocalizedString;
  heroPrimaryBtnUrl: string;
  heroSecondaryBtnText: LocalizedString;
  heroSecondaryBtnUrl: string;
  aboutBio: LocalizedString;
  skills: { name: string; level: number; category: string }[];
  sectionVisibility: {
    hero: boolean;
    featuredProjects: boolean;
    allProjects: boolean;
    about: boolean;
    advertisements: boolean;
    contact: boolean;
    driveShowcase: boolean;
  };
  sectionOrder: string[];
}

export interface ConnectedDriveAccount {
  id: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  connectedAt: string;
  lastSyncAt?: string;
  tokenType: 'oauth_token' | 'api_key' | 'service_account';
  accessToken?: string;
  scopes: string[];
  totalStorageBytes?: number;
  usedStorageBytes?: number;
  status: 'connected' | 'expired' | 'error';
  errorMessage?: string;
}

export interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
  iconLink?: string;
  isFolder: boolean;
  parentId?: string;
}

export interface DriveShowcaseItem {
  id: string;
  name: string;
  description?: string;
  fileId: string;
  accountId: string;
  accountEmail: string;
  mimeType: string;
  size?: string;
  downloadUrl?: string;
  hasPassword: boolean;
  password?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackupRecord {
  id: string;
  createdAt: string;
  sizeBytes: number;
  projectCount: number;
  status: 'success' | 'failed';
  driveSyncedAccount?: string;
  driveFileId?: string;
  note?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  ip?: string;
  success: boolean;
}

export interface AdminUser {
  username: string;
  lastLogin?: string;
}
