import React, { useState, useEffect } from 'react';
import { HomepageSettings } from '../../types';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import {
  Save,
  Upload,
  Check,
  Eye,
  Sliders,
  Sparkles,
  Layers,
  Plus,
  Trash2,
  AlertCircle,
} from 'lucide-react';

interface HomepageEditorProps {
  onSettingsUpdated?: (settings: HomepageSettings) => void;
}

export const HomepageEditor: React.FC<HomepageEditorProps> = ({ onSettingsUpdated }) => {
  const { t } = useLanguage();
  const [activeLang, setActiveLang] = useState<'ar' | 'tr' | 'en'>('ar');
  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    api.getHomepageSettings()
      .then((data) => setSettings(data))
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setErrorMsg(null);
    setSaveSuccess(false);

    try {
      const saved = await api.saveHomepageSettings(settings);
      setSettings(saved);
      if (onSettingsUpdated) onSettingsUpdated(saved);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'فشل حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    try {
      const res = await api.uploadFile(file, 'image');
      setSettings({ ...settings, logoUrl: res.url });
    } catch {
      alert('فشل رفع الشعار');
    }
  };

  const addSkill = () => {
    if (!settings) return;
    const newSkill = { name: 'New Skill', level: 85, category: 'General' };
    setSettings({
      ...settings,
      skills: [...(settings.skills || []), newSkill],
    });
  };

  const removeSkill = (index: number) => {
    if (!settings) return;
    const updated = [...settings.skills];
    updated.splice(index, 1);
    setSettings({ ...settings, skills: updated });
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">جاري تحميل إعدادات الصفحة الرئيسية...</div>;
  }
  if (!settings) return null;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <span>{t.tabHomepage}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تعديل النصوص، الشعار، نصوص الأزرار، والتحكم في ظهور وترتيب أقسام الصفحة الرئيسية.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all self-start sm:self-auto"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saving ? t.loading : saveSuccess ? 'تم الحفظ بنجاح!' : 'حفظ التعديلات'}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Language Tabs Selector */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300">لغة النصوص قيد التعديل:</span>
        <div className="flex items-center gap-2">
          {(['ar', 'tr', 'en'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLang(lang)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeLang === lang
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'العربية' : lang === 'tr' ? 'Türkçe' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* Brand & Logo Section */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>العلامة التجارية والهوية</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              اسم العلامة ({activeLang.toUpperCase()})
            </label>
            <input
              type="text"
              value={settings.brandName?.[activeLang] || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  brandName: { ...settings.brandName, [activeLang]: e.target.value } as any,
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              الشعار النصي الفرعي ({activeLang.toUpperCase()})
            </label>
            <input
              type="text"
              value={settings.brandTagline?.[activeLang] || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  brandTagline: { ...settings.brandTagline, [activeLang]: e.target.value } as any,
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Logo Upload */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-slate-300 block">
            شعار الموقع (Logo)
          </label>
          <div className="flex items-center gap-4">
            {settings.logoUrl && (
              <img src={settings.logoUrl} alt="Logo" className="w-12 h-12 rounded-xl object-cover bg-slate-950 border border-slate-800" />
            )}
            <input
              type="text"
              value={settings.logoUrl || ''}
              onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
              placeholder="رابط الشعار أو قم برفع ملف"
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-white"
            />
            <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer border border-slate-700">
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>رفع صورة</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </label>
          </div>
        </div>
      </div>

      {/* Hero Content Section */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>قسم البداية (Hero Section)</span>
        </h3>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              العنوان الرئيسي الكبير ({activeLang.toUpperCase()})
            </label>
            <input
              type="text"
              value={settings.heroHeadline?.[activeLang] || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  heroHeadline: { ...settings.heroHeadline, [activeLang]: e.target.value } as any,
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              النص التمهيدي المساعد ({activeLang.toUpperCase()})
            </label>
            <textarea
              rows={3}
              value={settings.heroSubtitle?.[activeLang] || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  heroSubtitle: { ...settings.heroSubtitle, [activeLang]: e.target.value } as any,
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                نص الزر الرئيسي ({activeLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={settings.heroPrimaryBtnText?.[activeLang] || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    heroPrimaryBtnText: { ...settings.heroPrimaryBtnText, [activeLang]: e.target.value } as any,
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                نص الزر الثانوي ({activeLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={settings.heroSecondaryBtnText?.[activeLang] || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    heroSecondaryBtnText: { ...settings.heroSecondaryBtnText, [activeLang]: e.target.value } as any,
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* About & Bio Section */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">
          نبذة عن المطور ({activeLang.toUpperCase()})
        </h3>
        <textarea
          rows={4}
          value={settings.aboutBio?.[activeLang] || ''}
          onChange={(e) =>
            setSettings({
              ...settings,
              aboutBio: { ...settings.aboutBio, [activeLang]: e.target.value } as any,
            })
          }
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
        />
      </div>

      {/* Section Visibility Toggles */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">
          التحكم في ظهور أقسام الصفحة الرئيسية
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(settings.sectionVisibility || {}).map(([key, isVisible]) => (
            <label
              key={key}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
            >
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    sectionVisibility: {
                      ...settings.sectionVisibility,
                      [key]: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 focus:ring-0"
              />
              <span className="text-xs font-semibold text-slate-300 capitalize">
                {key}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Skills Manager */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            قائمة المهارات والنسب المئوية
          </h3>
          <button
            type="button"
            onClick={addSkill}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-cyan-400"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة مهارة</span>
          </button>
        </div>

        <div className="space-y-3">
          {settings.skills?.map((skill, index) => (
            <div
              key={index}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3"
            >
              <input
                type="text"
                value={skill.name}
                onChange={(e) => {
                  const copy = [...settings.skills];
                  copy[index].name = e.target.value;
                  setSettings({ ...settings, skills: copy });
                }}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                placeholder="اسم التقنية"
              />

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={skill.level}
                  onChange={(e) => {
                    const copy = [...settings.skills];
                    copy[index].level = parseInt(e.target.value) || 0;
                    setSettings({ ...settings, skills: copy });
                  }}
                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white text-center font-mono"
                />
                <span className="text-xs text-slate-500 font-mono">%</span>
              </div>

              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
