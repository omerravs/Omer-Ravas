import React, { useState, useEffect } from 'react';
import { ConnectedDriveAccount, DriveItem, Project } from '../../types';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { signInWithGoogleDrive } from '../../services/firebase';
import {
  Cloud,
  PlusCircle,
  HardDrive,
  Folder,
  FileText,
  Upload,
  Trash2,
  ExternalLink,
  Download,
  RefreshCw,
  KeyRound,
  CheckCircle,
  AlertCircle,
  Shield,
  Edit2,
  Lock,
  Globe,
  FolderPlus,
  X,
  Sparkles,
} from 'lucide-react';

interface DriveAccountsManagerProps {
  onAttachFileToProject?: (file: DriveItem) => void;
  onRefreshData?: () => void;
}

export const DriveAccountsManager: React.FC<DriveAccountsManagerProps> = ({
  onAttachFileToProject,
  onRefreshData,
}) => {
  const { t, dir } = useLanguage();
  const [accounts, setAccounts] = useState<ConnectedDriveAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<ConnectedDriveAccount | null>(null);

  // Add / Connect Account Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [connectTab, setConnectTab] = useState<'google' | 'token'>('google');
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);

  // Manual token inputs
  const [manualEmail, setManualEmail] = useState('');
  const [manualToken, setManualToken] = useState('');
  const [manualName, setManualName] = useState('');

  // Files Explorer State
  const [files, setFiles] = useState<DriveItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState('root');
  const [folderPath, setFolderPath] = useState<{ id: string; name: string }[]>([
    { id: 'root', name: 'My Drive (الملفات الرئيسية)' },
  ]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [refreshingQuota, setRefreshingQuota] = useState(false);

  // Actions State
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Rename File Modal State
  const [renameModalItem, setRenameModalItem] = useState<DriveItem | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  // Protect File to Homepage Project Modal State
  const [protectFileItem, setProtectFileItem] = useState<DriveItem | null>(null);
  const [protectProjTitle, setProtectProjTitle] = useState('');
  const [protectCategory, setProtectCategory] = useState<'android' | 'web' | 'windows' | 'tools' | 'ai'>('android');
  const [protectPassword, setProtectPassword] = useState('');
  const [protectPasswordHint, setProtectPasswordHint] = useState('');
  const [isProtecting, setIsProtecting] = useState(false);

  // In-UI Confirmation Modal
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    message: string;
    confirmText?: string;
    confirmType?: 'danger' | 'primary';
    onConfirm: () => void;
  } | null>(null);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const data = await api.getDriveAccounts();
      setAccounts(data);
      if (data.length > 0 && !selectedAccount) {
        setSelectedAccount(data[0]);
      }
    } catch (err) {
      console.error('Failed to load drive accounts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      loadFilesForFolder(selectedAccount.id, currentFolderId);
    }
  }, [selectedAccount, currentFolderId]);

  const loadFilesForFolder = async (accountId: string, folderId: string, query = '') => {
    try {
      setLoadingFiles(true);
      setErrorMsg(null);
      const res = await api.getDriveFiles(accountId, folderId, query);
      setFiles(res.files || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'فشل تحميل ملفات Google Drive');
      setFiles([]);
    } finally {
      setLoadingFiles(false);
    }
  };

  // 1-Click Google Sign-In with real Google Account on computer
  const handleGoogleSignInWithFirebase = async () => {
    try {
      setIsConnectingGoogle(true);
      setErrorMsg(null);

      const result = await signInWithGoogleDrive();
      if (!result) {
        setIsConnectingGoogle(false);
        return;
      }

      const { user, accessToken } = result;

      // Connect with backend server to fetch real quota and setup integration
      const connected = await api.connectDriveAccount({
        email: user.email || 'google-drive@account.com',
        displayName: user.displayName || user.email?.split('@')[0] || 'حساب Google',
        photoUrl: user.photoURL || '',
        accessToken,
        tokenType: 'oauth_token',
      });

      setAccounts((prev) => [...prev.filter((a) => a.id !== connected.id), connected]);
      setSelectedAccount(connected);
      setAddModalOpen(false);
      setSuccessMsg(`تم ربط حساب Google الحقيقي بنجاح: ${connected.email}`);
      setTimeout(() => setSuccessMsg(null), 4000);

      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      console.error('Google Sign in error:', err);
      setErrorMsg(err.message || 'فشل تسجيل الدخول واختيار حساب Google. يرجى التأكد من السماح بالنوافذ المنبثقة.');
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  const handleConnectToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmail || !manualToken) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني ورمز Access Token');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      const connected = await api.connectDriveAccount({
        email: manualEmail,
        displayName: manualName || manualEmail.split('@')[0],
        accessToken: manualToken.trim(),
        tokenType: 'oauth_token',
      });
      setAccounts((prev) => [...prev.filter((a) => a.id !== connected.id), connected]);
      setSelectedAccount(connected);
      setAddModalOpen(false);
      setManualEmail('');
      setManualToken('');
      setManualName('');
      setSuccessMsg(`تم ربط حساب Google Drive بنجاح: ${connected.email}`);
      setTimeout(() => setSuccessMsg(null), 4000);

      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      setErrorMsg(err.message || 'فشل ربط الحساب. تحقق من صحة الرمز.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshQuota = async () => {
    if (!selectedAccount) return;
    try {
      setRefreshingQuota(true);
      setErrorMsg(null);
      const updated = await api.refreshDriveQuota(selectedAccount.id);
      setSelectedAccount(updated);
      setAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      setSuccessMsg('تم تحديث المساحة والمعلومات الفعلية من Google Drive بنجاح!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'فشل تحديث المساحة الفعلية من Drive');
    } finally {
      setRefreshingQuota(false);
    }
  };

  const handleDisconnect = (id: string, email: string) => {
    setConfirmDialog({
      title: 'إلغاء ربط حساب Google Drive',
      message: `هل أنت متأكد من رغبتك في إلغاء ربط الحساب (${email})؟`,
      confirmText: 'نعم، قم بإلغاء الربط',
      confirmType: 'danger',
      onConfirm: async () => {
        try {
          await api.disconnectDriveAccount(id);
          setAccounts((prev) => prev.filter((a) => a.id !== id));
          if (selectedAccount?.id === id) {
            const remaining = accounts.filter((a) => a.id !== id);
            setSelectedAccount(remaining[0] || null);
          }
          setSuccessMsg('تم إلغاء ربط الحساب بنجاح.');
          setTimeout(() => setSuccessMsg(null), 3000);
          if (onRefreshData) onRefreshData();
        } catch (err: any) {
          setErrorMsg(err.message || 'فشل إلغاء الربط');
        } finally {
          setConfirmDialog(null);
        }
      },
    });
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !selectedAccount) return;
    try {
      setCreatingFolder(true);
      await api.createDriveFolder(selectedAccount.id, newFolderName.trim(), currentFolderId);
      const createdName = newFolderName.trim();
      setNewFolderName('');
      loadFilesForFolder(selectedAccount.id, currentFolderId);
      setSuccessMsg(`تم إنشاء المجلد "${createdName}" بنجاح في Google Drive.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'فشل إنشاء المجلد في Google Drive');
    } finally {
      setCreatingFolder(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAccount) return;

    try {
      setUploadingFile(true);
      setErrorMsg(null);
      await api.uploadFileToDrive(selectedAccount.id, file, currentFolderId);
      loadFilesForFolder(selectedAccount.id, currentFolderId);
      setSuccessMsg(`تم رفع الملف "${file.name}" إلى Google Drive بنجاح!`);
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'فشل رفع الملف إلى Drive');
    } finally {
      setUploadingFile(false);
      e.target.value = '';
    }
  };

  const handleDeleteItem = (fileId: string, fileName: string) => {
    setConfirmDialog({
      title: 'حذف عنصر من Google Drive',
      message: `هل أنت متأكد من حذف "${fileName}" ونقله إلى سلة المهملات في Google Drive؟`,
      confirmText: 'نعم، حذف إلى المهملات',
      confirmType: 'danger',
      onConfirm: async () => {
        if (!selectedAccount) return;
        try {
          await api.deleteDriveItem(selectedAccount.id, fileId, false);
          loadFilesForFolder(selectedAccount.id, currentFolderId);
          setSuccessMsg(`تم نقل "${fileName}" إلى سلة مهملات Google Drive بنجاح.`);
          setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err: any) {
          setErrorMsg(err.message || 'فشل حذف العنصر');
        } finally {
          setConfirmDialog(null);
        }
      },
    });
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameModalItem || !renameInput.trim() || !selectedAccount) return;

    try {
      setIsRenaming(true);
      await api.renameDriveItem(selectedAccount.id, renameModalItem.id, renameInput.trim());
      setRenameModalItem(null);
      setRenameInput('');
      loadFilesForFolder(selectedAccount.id, currentFolderId);
      setSuccessMsg('تم تعديل اسم الملف في Google Drive بنجاح!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'فشل تعديل اسم الملف');
    } finally {
      setIsRenaming(false);
    }
  };

  // Publish / Attach Drive file as a password-protected project on homepage
  const handlePublishFileToHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!protectFileItem || !protectProjTitle.trim()) return;

    setIsProtecting(true);
    try {
      const isApk = protectFileItem.name.toLowerCase().endsWith('.apk');
      const isExe =
        protectFileItem.name.toLowerCase().endsWith('.exe') ||
        protectFileItem.name.toLowerCase().endsWith('.zip');
      const downloadLink = protectFileItem.webContentLink || protectFileItem.webViewLink || '';

      const platformVal = isApk
        ? 'Android APK'
        : isExe
        ? 'Windows Desktop'
        : protectCategory === 'web'
        ? 'Web App'
        : protectCategory === 'ai'
        ? 'AI System'
        : 'Tools & Utilities';

      const newProjectPayload: Partial<Project> = {
        title: {
          ar: protectProjTitle.trim(),
          tr: protectProjTitle.trim(),
          en: protectProjTitle.trim(),
        },
        shortDescription: {
          ar: `ملف مرفوع ومحمي عبر Google Drive: ${protectFileItem.name}`,
          tr: `Google Drive ile korunan dosya: ${protectFileItem.name}`,
          en: `Cloud protected file via Google Drive: ${protectFileItem.name}`,
        },
        fullDescription: {
          ar: `هذا الملف متاح للتحميل من Google Drive ومحمي بكلمة مرور خاصة ومحددة من قبل عمر الرفاس. حجم الملف: ${
            protectFileItem.size || 'سحابي'
          }.`,
          tr: `Bu dosya Google Drive üzerinden güvenli olarak sunulmaktadır.`,
          en: `This file is securely served via Google Drive and protected with a private download password.`,
        },
        category: protectCategory,
        platform: platformVal as any,
        tags: ['Google Drive', isApk ? 'Android APK' : isExe ? 'Windows' : 'Cloud File'],
        mainImage:
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        screenshots: [],
        downloadUrl: downloadLink,
        apkFileUrl: isApk ? downloadLink : undefined,
        desktopFileUrl: isExe ? downloadLink : undefined,
        driveFileId: protectFileItem.id,
        version: 'v1.0.0',
        releaseDate: new Date().toISOString().split('T')[0],
        fileSize: protectFileItem.size || 'Drive Cloud',
        isPublished: true,
        isFeatured: true,
        displayOrder: 1,
        requireDownloadPassword: !!protectPassword.trim(),
        downloadPassword: protectPassword.trim() || undefined,
        downloadPasswordHint:
          protectPasswordHint.trim() || 'تواصل مع عمر الرفاس عبر واتساب للحصول على كلمة المرور',
      };

      await api.saveProject(newProjectPayload);
      setProtectFileItem(null);
      setProtectProjTitle('');
      setProtectPassword('');
      setProtectPasswordHint('');
      setSuccessMsg('تم نشر الملف في الصفحة الرئيسية بنجاح مع تفعيل حماية كلمة المرور!');
      setTimeout(() => setSuccessMsg(null), 4000);

      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      setErrorMsg(err.message || 'فشل نشر الملف كمشروع');
    } finally {
      setIsProtecting(false);
    }
  };

  // Format real bytes
  const formatBytes = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStoragePercentage = (used?: number, total?: number): number => {
    if (!used || !total || total === 0) return 0;
    return Math.min(100, Math.round((used / total) * 100));
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Cloud className="w-6 h-6 text-cyan-400" />
            <span>{t.driveAccountsTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            ربط حسابات Google Drive الحقيقية عبر تسجيل الدخول، استعراض المساحة الفعلية والمجلدات، ورفع وإدارة ملفات APK والبرامج مع إمكانية قفل تحميلها بكلمة مرور مخصصة.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setErrorMsg(null);
            setAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.connectNewAccount}</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Accounts List & Storage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full p-12 text-center text-slate-400">
            <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-2" />
            <span>جاري استعلام حسابات Google Drive...</span>
          </div>
        ) : accounts.length === 0 ? (
          <div className="col-span-full p-10 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
            <Cloud className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">لا توجد حسابات Google Drive مربوطة حالياً</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              اضغط على زر "ربط حساب Google Drive جديد" لتسجيل الدخول التلقائي بحساب Google المفتوح في جهازك وتصفح ملفاتك ومساحتك الحقيقية.
            </p>
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ربط حسابك الآن</span>
            </button>
          </div>
        ) : (
          accounts.map((acc) => {
            const isSelected = selectedAccount?.id === acc.id;
            const percentage = getStoragePercentage(acc.usedStorageBytes, acc.totalStorageBytes);

            return (
              <div
                key={acc.id}
                onClick={() => setSelectedAccount(acc)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900/90 border-cyan-500 shadow-xl shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {acc.photoUrl ? (
                        <img
                          src={acc.photoUrl}
                          alt={acc.displayName}
                          className="w-10 h-10 rounded-full border border-cyan-500/40 object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold">
                          {acc.email.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-white line-clamp-1">
                          {acc.displayName || acc.email.split('@')[0]}
                        </h4>
                        <span className="text-[11px] text-slate-400 font-mono block line-clamp-1">
                          {acc.email}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDisconnect(acc.id, acc.email);
                      }}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="إلغاء ربط الحساب"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Real Storage Quota Display */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">المساحة الفعلية:</span>
                      <span className="font-mono text-cyan-300 font-semibold text-[11px]">
                        {formatBytes(acc.usedStorageBytes || 0)} /{' '}
                        {acc.totalStorageBytes ? formatBytes(acc.totalStorageBytes) : 'غير محدود'}
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>متصل فعلياً</span>
                  </span>

                  {isSelected && (
                    <span className="text-cyan-400 font-bold">المتصفح النشط</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Drive File Explorer Section */}
      {selectedAccount && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-2xl">
          {/* Top Explorer Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">
                  متصفح ملفات Drive ({selectedAccount.email})
                </h3>
              </div>

              {/* Breadcrumb Path */}
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-2 overflow-x-auto pb-1 font-mono">
                {folderPath.map((f, idx) => (
                  <React.Fragment key={f.id}>
                    {idx > 0 && <span className="text-slate-600">/</span>}
                    <button
                      type="button"
                      onClick={() => {
                        const newPath = folderPath.slice(0, idx + 1);
                        setFolderPath(newPath);
                        setCurrentFolderId(f.id);
                      }}
                      className={`hover:text-cyan-400 transition-colors ${
                        idx === folderPath.length - 1 ? 'text-cyan-400 font-bold' : ''
                      }`}
                    >
                      {f.name}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Refresh Quota & Files */}
              <button
                type="button"
                onClick={handleRefreshQuota}
                disabled={refreshingQuota}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700"
                title="تحديث المساحة والملفات من Google"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshingQuota ? 'animate-spin' : ''}`} />
                <span>{refreshingQuota ? 'جاري التحديث...' : 'تحديث المساحة'}</span>
              </button>

              {/* Upload to Drive */}
              <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer transition-all shadow-md shadow-emerald-600/20">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingFile ? 'جاري الرفع...' : 'رفع ملف إلى Drive'}</span>
                <input type="file" className="hidden" disabled={uploadingFile} onChange={handleFileUpload} />
              </label>
            </div>
          </div>

          {/* Create Folder Inline */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <FolderPlus className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="أدخل اسم مجلد جديد لإنشائه في هذا المسار..."
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              type="button"
              disabled={creatingFolder || !newFolderName.trim()}
              onClick={handleCreateFolder}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 transition-all"
            >
              <span>{creatingFolder ? 'جاري الإنشاء...' : 'إنشاء المجلد'}</span>
            </button>
          </div>

          {/* Files Grid */}
          {loadingFiles ? (
            <div className="p-16 text-center text-slate-400">
              <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-2" />
              <span>جاري استعراض محتويات المجلد من Google Drive...</span>
            </div>
          ) : files.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {file.isFolder ? (
                        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 flex-shrink-0">
                          <Folder className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}

                      <div className="overflow-hidden">
                        <h4
                          onClick={() => {
                            if (file.isFolder) {
                              setCurrentFolderId(file.id);
                              setFolderPath((prev) => [...prev, { id: file.id, name: file.name }]);
                            }
                          }}
                          className={`text-xs sm:text-sm font-bold text-white truncate ${
                            file.isFolder ? 'cursor-pointer hover:text-cyan-400' : ''
                          }`}
                          title={file.name}
                        >
                          {file.name}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          {file.size || 'مجلد'} • {file.modifiedTime?.split('T')[0] || ''}
                        </span>
                      </div>
                    </div>

                    {/* Rename Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setRenameModalItem(file);
                        setRenameInput(file.name);
                      }}
                      className="p-1.5 text-slate-500 hover:text-cyan-400 rounded-lg hover:bg-slate-900 transition-colors"
                      title="تعديل اسم الملف"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                    {file.isFolder ? (
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentFolderId(file.id);
                          setFolderPath((prev) => [...prev, { id: file.id, name: file.name }]);
                        }}
                        className="text-cyan-400 hover:underline font-semibold text-xs flex items-center gap-1"
                      >
                        <span>فتح المجلد</span>
                        <span>←</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        {/* Download link */}
                        <a
                          href={file.webContentLink || file.webViewLink || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-cyan-400 hover:underline font-semibold text-[11px]"
                        >
                          <Download className="w-3 h-3" />
                          <span>تنزيل</span>
                        </a>

                        {/* Attach to Homepage with password button */}
                        <button
                          type="button"
                          onClick={() => {
                            setProtectFileItem(file);
                            setProtectProjTitle(file.name.replace(/\.[^/.]+$/, ''));
                            setProtectPassword('');
                            setProtectPasswordHint('تواصل مع عمر الرفاس عبر واتساب للحصول على كلمة المرور');
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800/60 hover:bg-cyan-900/60 text-[10px] font-semibold transition-colors"
                          title="نشر هذا الملف في الصفحة الرئيسية مع حماية بكلمة مرور"
                        >
                          <Lock className="w-3 h-3 text-amber-300" />
                          <span>قفل بكلمة سر للرئيسية</span>
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5">
                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded-lg transition-colors"
                          title="فتح في Google Drive"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteItem(file.id, file.name)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="حذف إلى المهملات"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center text-slate-500 text-xs rounded-2xl bg-slate-950/40 border border-slate-800">
              <Folder className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <span>هذا المجلد فارغ حالياً في Google Drive.</span>
            </div>
          )}
        </div>
      )}

      {/* Rename File Modal */}
      {renameModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-cyan-400" />
              <span>تعديل اسم الملف في Google Drive</span>
            </h3>

            <form onSubmit={handleRenameSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">الاسم الجديد</label>
                <input
                  type="text"
                  required
                  value={renameInput}
                  onChange={(e) => setRenameInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRenameModalItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isRenaming || !renameInput.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 shadow-md"
                >
                  {isRenaming ? 'جاري الحفظ...' : 'تحديث الاسم'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Protect File to Homepage Modal */}
      {protectFileItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">نشر ملف Drive في الرئيسية مع حماية بكلمة مرور</h3>
                <p className="text-xs text-slate-400 truncate max-w-sm">الملف: {protectFileItem.name}</p>
              </div>
            </div>

            <form onSubmit={handlePublishFileToHomepage} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">اسم المشروع أو التطبيق في الصفحة الرئيسية</label>
                <input
                  type="text"
                  required
                  value={protectProjTitle}
                  onChange={(e) => setProtectProjTitle(e.target.value)}
                  placeholder="مثال: تطبيق أندرويد الخاص أو أداة سطح المكتب"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">تصنيف المشروع</label>
                  <select
                    value={protectCategory}
                    onChange={(e: any) => setProtectCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="android">Android APK</option>
                    <option value="windows">Desktop Software (Windows/PC)</option>
                    <option value="web">Web Application</option>
                    <option value="tools">Tools & Utilities</option>
                    <option value="ai">AI System</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    كلمة المرور المطلوبة للتحميل
                  </label>
                  <input
                    type="text"
                    required
                    value={protectPassword}
                    onChange={(e) => setProtectPassword(e.target.value)}
                    placeholder="مثال: pass2026"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  توجيه أو رسالة للزائر عند محاولة التحميل
                </label>
                <input
                  type="text"
                  value={protectPasswordHint}
                  onChange={(e) => setProtectPasswordHint(e.target.value)}
                  placeholder="مثال: تواصل مع عمر الرفاس عبر واتساب للحصول على كلمة المرور"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  لن يستطيع أي زائر تنزيل هذا الملف من الصفحة الرئيسية إلا بعد إدخال كلمة المرور الصحيحة التي تحددها هنا.
                </span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setProtectFileItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isProtecting || !protectProjTitle.trim() || !protectPassword.trim()}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 shadow-md"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isProtecting ? 'جاري النشر...' : 'نشر المشروع المحمي'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Connect Account Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-cyan-400" />
                <span>{t.connectNewAccount}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                سجل الدخول بحساب Google المتصل بجهازك للاتصال المباشر بجوجل درايف واستعراض الملفات والمساحة الحقيقية.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-800">
              <button
                type="button"
                onClick={() => setConnectTab('google')}
                className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                  connectTab === 'google'
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                الدخول التلقائي بحساب Google (الموصى به)
              </button>
              <button
                type="button"
                onClick={() => setConnectTab('token')}
                className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                  connectTab === 'token'
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                ربط عبر Access Token المباشر
              </button>
            </div>

            {connectTab === 'google' ? (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>تسجيل دخول سريع ومباشر بحسابك الفعلي:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    عند النقر على الزر أدناه، ستفتح نافذة Google الرسمية لاختيار حساب Google المتصل بجهاز الكمبيوتر لديك، وسيتم الربط فوراً وتظهر المساحة والملفات الحقيقية تلقائياً.
                  </p>
                </div>

                {/* Google Sign-in Official Button */}
                <button
                  type="button"
                  disabled={isConnectingGoogle}
                  onClick={handleGoogleSignInWithFirebase}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm text-slate-900 bg-white hover:bg-slate-100 disabled:opacity-50 transition-all shadow-xl hover:shadow-cyan-500/10 cursor-pointer"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>
                    {isConnectingGoogle
                      ? 'جاري فتح نافذة Google واختيار الحساب...'
                      : 'تسجيل الدخول واختيار حساب Google المتصل'}
                  </span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleConnectToken} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    البريد الإلكتروني لحساب Google
                  </label>
                  <input
                    type="email"
                    required
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="omer@gmail.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    اسم العرض (اختياري)
                  </label>
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="مثال: حساب العمل / أرشيف APK"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Google OAuth 2.0 Access Token
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    placeholder="ya29.a0AfH6SM..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !manualEmail || !manualToken}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 shadow-md"
                  >
                    {loading ? 'جاري التحقق...' : 'ربط الحساب'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle
                className={`w-5 h-5 ${
                  confirmDialog.confirmType === 'danger' ? 'text-red-400' : 'text-cyan-400'
                }`}
              />
              <span>{confirmDialog.title}</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">{confirmDialog.message}</p>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md ${
                  confirmDialog.confirmType === 'danger'
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                }`}
              >
                {confirmDialog.confirmText || 'تأكيد'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
