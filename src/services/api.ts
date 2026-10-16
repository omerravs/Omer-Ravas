import {
  Project,
  HomepageSettings,
  ContactInfo,
  Advertisement,
  AdSenseConfig,
  ConnectedDriveAccount,
  DriveItem,
  BackupRecord,
  ActivityLog,
} from '../types';

const getAuthHeaders = () => {
  const token = localStorage.getItem('omerr_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Projects
  async getProjects(params?: { category?: string; platform?: string; search?: string; all?: boolean }): Promise<Project[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.platform) query.append('platform', params.platform);
    if (params?.search) query.append('search', params.search);
    if (params?.all) query.append('all', 'true');

    const res = await fetch(`/api/projects?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async getProject(id: string): Promise<Project> {
    const res = await fetch(`/api/projects/${id}`);
    if (!res.ok) throw new Error('Project not found');
    return res.json();
  },

  async saveProject(project: Partial<Project>, isEdit = false): Promise<Project> {
    const url = isEdit ? `/api/projects/${project.id}` : '/api/projects';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(project),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save project');
    }
    return res.json();
  },

  async duplicateProject(id: string): Promise<Project> {
    const res = await fetch(`/api/projects/${id}/duplicate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to duplicate project');
    return res.json();
  },

  async deleteProject(id: string): Promise<void> {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete project');
  },

  // File Upload
  async uploadFile(file: File, fileType: 'image' | 'apk' | 'desktop'): Promise<{ url: string; filename: string; size: number }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);

    const token = localStorage.getItem('omerr_admin_token');
    const res = await fetch('/api/uploads', {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to upload file');
    }
    return res.json();
  },

  // Homepage Settings
  async getHomepageSettings(): Promise<HomepageSettings> {
    const res = await fetch('/api/settings/homepage');
    if (!res.ok) throw new Error('Failed to load homepage settings');
    return res.json();
  },

  async saveHomepageSettings(settings: HomepageSettings): Promise<HomepageSettings> {
    const res = await fetch('/api/settings/homepage', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to save homepage settings');
    return res.json();
  },

  // Contact Info
  async getContactInfo(): Promise<ContactInfo> {
    const res = await fetch('/api/settings/contact');
    if (!res.ok) throw new Error('Failed to load contact info');
    return res.json();
  },

  async saveContactInfo(contactInfo: ContactInfo): Promise<ContactInfo> {
    const res = await fetch('/api/settings/contact', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(contactInfo),
    });
    if (!res.ok) throw new Error('Failed to save contact settings');
    return res.json();
  },

  // Ads
  async getAds(includeDisabled = false): Promise<Advertisement[]> {
    const res = await fetch(`/api/ads?all=${includeDisabled}`);
    if (!res.ok) throw new Error('Failed to fetch advertisements');
    return res.json();
  },

  async saveAd(ad: Partial<Advertisement>): Promise<Advertisement> {
    const isEdit = !!ad.id;
    const url = isEdit ? `/api/ads/${ad.id}` : '/api/ads';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(ad),
    });
    if (!res.ok) throw new Error('Failed to save advertisement');
    return res.json();
  },

  async deleteAd(id: string): Promise<void> {
    const res = await fetch(`/api/ads/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete ad');
  },

  async recordAdClick(id: string): Promise<void> {
    fetch(`/api/ads/${id}/click`, { method: 'POST' }).catch(() => {});
  },

  async getAdSenseConfig(): Promise<AdSenseConfig> {
    const res = await fetch('/api/settings/adsense');
    if (!res.ok) throw new Error('Failed to load AdSense config');
    return res.json();
  },

  async saveAdSenseConfig(config: AdSenseConfig): Promise<AdSenseConfig> {
    const res = await fetch('/api/settings/adsense', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(config),
    });
    if (!res.ok) throw new Error('Failed to save AdSense config');
    return res.json();
  },

  // Google Drive
  async getDriveAccounts(): Promise<ConnectedDriveAccount[]> {
    const res = await fetch('/api/drive/accounts', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load Drive accounts');
    return res.json();
  },

  async connectDriveAccount(account: Partial<ConnectedDriveAccount>): Promise<ConnectedDriveAccount> {
    const res = await fetch('/api/drive/accounts', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(account),
    });
    if (!res.ok) throw new Error('Failed to connect Drive account');
    return res.json();
  },

  async disconnectDriveAccount(id: string): Promise<void> {
    const res = await fetch(`/api/drive/accounts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to disconnect Drive account');
  },

  async getDriveFiles(accountId: string, folderId = 'root', query = ''): Promise<{ files: DriveItem[]; nextPageToken?: string }> {
    const q = new URLSearchParams({ folderId, query });
    const res = await fetch(`/api/drive/accounts/${accountId}/files?${q.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to list Drive files');
    }
    return res.json();
  },

  async createDriveFolder(accountId: string, name: string, parentId = 'root'): Promise<DriveItem> {
    const res = await fetch(`/api/drive/accounts/${accountId}/folders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, parentId }),
    });
    if (!res.ok) throw new Error('Failed to create Drive folder');
    return res.json();
  },

  async deleteDriveItem(accountId: string, fileId: string, permanent = false): Promise<void> {
    const res = await fetch(`/api/drive/accounts/${accountId}/files/${fileId}?permanent=${permanent}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete Drive item');
  },

  async renameDriveItem(accountId: string, fileId: string, name: string): Promise<DriveItem> {
    const res = await fetch(`/api/drive/accounts/${accountId}/files/${fileId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Failed to rename Drive item');
    return res.json();
  },

  async refreshDriveQuota(accountId: string): Promise<ConnectedDriveAccount> {
    const res = await fetch(`/api/drive/accounts/${accountId}/refresh-quota`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to refresh Drive storage quota');
    return res.json();
  },

  async uploadFileToDrive(accountId: string, file: File, parentId = 'root'): Promise<DriveItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('parentId', parentId);

    const token = localStorage.getItem('omerr_admin_token');
    const res = await fetch(`/api/drive/accounts/${accountId}/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload file to Google Drive');
    return res.json();
  },

  // Backups
  async getBackups(): Promise<BackupRecord[]> {
    const res = await fetch('/api/backups', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load backups');
    return res.json();
  },

  async createBackup(note?: string, targetDriveAccountId?: string): Promise<BackupRecord> {
    const res = await fetch('/api/backups/create', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ note, targetDriveAccountId }),
    });
    if (!res.ok) throw new Error('Failed to create backup');
    return res.json();
  },

  async restoreBackup(backupData: any): Promise<{ success: boolean; stats: any }> {
    const res = await fetch('/api/backups/restore', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(backupData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to restore backup');
    }
    return res.json();
  },

  // Activity Logs & Stats
  async getActivityLogs(): Promise<ActivityLog[]> {
    const res = await fetch('/api/logs', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load logs');
    return res.json();
  },

  async getDashboardStats(): Promise<{
    totalProjects: number;
    publishedProjects: number;
    draftProjects: number;
    categoriesCount: Record<string, number>;
    totalBackups: number;
    connectedDriveAccounts: number;
    totalAds: number;
    totalDownloads: number;
  }> {
    const res = await fetch('/api/stats', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load stats');
    return res.json();
  },
};
