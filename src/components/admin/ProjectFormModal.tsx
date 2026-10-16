import React, { useState } from 'react';
import { Project, ProjectCategory, ProjectPlatform } from '../../types';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import {
  X,
  Upload,
  Check,
  Smartphone,
  AppWindow,
  Globe,
  FileCode,
  AlertCircle,
} from 'lucide-react';

interface ProjectFormModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (project: Project) => void;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  project,
  isOpen,
  onClose,
  onSaved,
}) => {
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'ar' | 'tr' | 'en'>('ar');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Project>>(() => {
    if (project) return { ...project };
    return {
      title: { ar: '', tr: '', en: '' },
      shortDescription: { ar: '', tr: '', en: '' },
      fullDescription: { ar: '', tr: '', en: '' },
      category: 'web' as ProjectCategory,
      platform: 'Web App' as ProjectPlatform,
      tags: [],
      mainImage: '',
      screenshots: [],
      websiteUrl: '',
      downloadUrl: '',
      apkFileUrl: '',
      desktopFileUrl: '',
      version: 'v1.0.0',
      releaseDate: new Date().toISOString().split('T')[0],
      isPublished: true,
      isFeatured: false,
      displayOrder: 1,
      fileSize: '',
    };
  });

  const [tagsInput, setTagsInput] = useState<string>(
    formData.tags ? formData.tags.join(', ') : ''
  );

  if (!isOpen) return null;

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'mainImage' | 'apkFileUrl' | 'desktopFileUrl',
    fileType: 'image' | 'apk' | 'desktop'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field);
    setErrorMsg(null);

    try {
      const res = await api.uploadFile(file, fileType);
      setFormData((prev) => ({
        ...prev,
        [field]: res.url,
        fileSize: field === 'apkFileUrl' || field === 'desktopFileUrl' ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : prev.fileSize,
      }));
    } catch (err: any) {
      setErrorMsg(err.message || 'فشل رفع الملف');
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.ar && !formData.title?.en) {
      setErrorMsg('يرجى إدخال عنوان المشروع على الأقل بالعربية أو الإنجليزية');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        tags: parsedTags,
      };

      const saved = await api.saveProject(payload, !!project);
      onSaved(saved);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'فشل حفظ المشروع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8 z-10">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-cyan-400" />
            <span>{project ? t.editProject : t.addNewProject}</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Localization Tabs */}
          <div className="border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 me-2">لغة المحتوى:</span>
              {(['ar', 'tr', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveTab(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === lang
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? 'العربية (AR)' : lang === 'tr' ? 'Türkçe (TR)' : 'English (EN)'}
                </button>
              ))}
            </div>
          </div>

          {/* Localized Fields depending on tab */}
          <div className="space-y-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                عنوان المشروع ({activeTab.toUpperCase()})
              </label>
              <input
                type="text"
                value={formData.title?.[activeTab] || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: { ...formData.title, [activeTab]: e.target.value } as any,
                  })
                }
                placeholder={`أدخل اسم المشروع بـ ${activeTab}`}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                وصف موجز ({activeTab.toUpperCase()})
              </label>
              <textarea
                rows={2}
                value={formData.shortDescription?.[activeTab] || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shortDescription: { ...formData.shortDescription, [activeTab]: e.target.value } as any,
                  })
                }
                placeholder="وصف مختصر يظهر في بطاقة المشروع..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                الوصف الكامل والتفاصيل ({activeTab.toUpperCase()})
              </label>
              <textarea
                rows={4}
                value={formData.fullDescription?.[activeTab] || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullDescription: { ...formData.fullDescription, [activeTab]: e.target.value } as any,
                  })
                }
                placeholder="شرح كامل للمشروع، مزاياه، وكيفية استخدامه..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Category & Platform */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                {t.categoryLabel}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="web">Web Application (ويب)</option>
                <option value="android">Android App / APK (أندرويد)</option>
                <option value="windows">Windows Desktop (ويندوز)</option>
                <option value="ai">Artificial Intelligence (ذكاء اصطناعي)</option>
                <option value="tools">Tools & Utilities (أدوات برمجية)</option>
                <option value="services">Cloud Service / API (خدمات)</option>
                <option value="design">UI/UX Design (تصميم)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                {t.platformLabel}
              </label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value as ProjectPlatform })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Web App">Web App</option>
                <option value="Android APK">Android APK</option>
                <option value="Windows Desktop">Windows Desktop</option>
                <option value="AI / ML">AI / ML</option>
                <option value="API / Service">API / Service</option>
                <option value="UI / UX Design">UI / UX Design</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              {t.tagsLabel}
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="مثال: React, TypeScript, Kotlin, APK, Google Drive"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Media & Uploads Section */}
          <div className="space-y-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              رفع الملفات والوسائط للمشروع
            </h3>

            {/* Cover Image */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                {t.mainImageUpload}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={formData.mainImage || ''}
                  onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                  placeholder="رابط الصورة أو قم برفع ملف مباشرة"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                />
                <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-colors flex-shrink-0">
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{uploadingField === 'mainImage' ? 'جاري الرفع...' : 'رفع صورة'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'mainImage', 'image')}
                  />
                </label>
              </div>
            </div>

            {/* Android APK Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>{t.apkUploadLabel}</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={formData.apkFileUrl || ''}
                  onChange={(e) => setFormData({ ...formData, apkFileUrl: e.target.value })}
                  placeholder="/uploads/sample-app.apk أو رابط خارجي"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
                <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600/90 hover:bg-emerald-500 text-white cursor-pointer transition-colors flex-shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingField === 'apkFileUrl' ? 'جاري الرفع...' : 'رفع ملف APK'}</span>
                  <input
                    type="file"
                    accept=".apk"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'apkFileUrl', 'apk')}
                  />
                </label>
              </div>
            </div>

            {/* Windows Desktop File Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <AppWindow className="w-4 h-4 text-blue-400" />
                <span>{t.desktopUploadLabel}</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={formData.desktopFileUrl || ''}
                  onChange={(e) => setFormData({ ...formData, desktopFileUrl: e.target.value })}
                  placeholder="/uploads/installer.exe أو .zip"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
                <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600/90 hover:bg-blue-500 text-white cursor-pointer transition-colors flex-shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingField === 'desktopFileUrl' ? 'جاري الرفع...' : 'رفع EXE/ZIP'}</span>
                  <input
                    type="file"
                    accept=".exe,.zip,.msi"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'desktopFileUrl', 'desktop')}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* URLs & Versions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                {t.websiteUrlLabel}
              </label>
              <input
                type="url"
                value={formData.websiteUrl || ''}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://example.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                {t.versionLabel}
              </label>
              <input
                type="text"
                value={formData.version || ''}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                placeholder="v1.0.0"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                {t.releasedOn}
              </label>
              <input
                type="date"
                value={formData.releaseDate || ''}
                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Download Access Password Protection */}
          <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requireDownloadPassword || false}
                  onChange={(e) =>
                    setFormData({ ...formData, requireDownloadPassword: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 focus:ring-0"
                />
                <span className="text-xs sm:text-sm font-bold text-cyan-300">
                  قفل تحميل الملفات بكلمة مرور خاصة (Password Protected Download)
                </span>
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                حماية التحميل
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              عند التفعيل، لن يتمكن أي زائر من تحميل حزمة APK أو ملف البرنامج من الموقع العام إلا بعد إدخال كلمة المرور التي تحددها بنفسك.
            </p>

            {formData.requireDownloadPassword && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    كلمة مرور التحميل المطلوبة
                  </label>
                  <input
                    type="text"
                    value={formData.downloadPassword || ''}
                    onChange={(e) => setFormData({ ...formData, downloadPassword: e.target.value })}
                    placeholder="مثال: secret2026"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    توجيه أو رسالة للزائر
                  </label>
                  <input
                    type="text"
                    value={formData.downloadPasswordHint || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, downloadPasswordHint: e.target.value })
                    }
                    placeholder="مثال: يرجى التواصل عبر واتساب للحصول على تصريح التحميل"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-white bg-slate-800 transition-colors"
            >
              {t.cancelBtn}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/20"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? t.loading : t.saveProjectBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
