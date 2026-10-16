import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import { AppearanceSettings } from '../../types';
import { Palette, Check, Sun, Moon, Upload } from 'lucide-react';

export const AppearanceEditor: React.FC = () => {
  const { appearance, updateAppearanceOnServer } = useTheme();
  const [form, setForm] = useState<AppearanceSettings>({ ...appearance });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);

  const colorPresets = [
    { name: 'Cyan Tech', primary: '#06b6d4', accent: '#3b82f6' },
    { name: 'Emerald Forest', primary: '#10b981', accent: '#059669' },
    { name: 'Purple Neon', primary: '#a855f7', accent: '#6366f1' },
    { name: 'Amber Sunset', primary: '#f59e0b', accent: '#ea580c' },
    { name: 'Rose Red', primary: '#f43f5e', accent: '#be123c' },
  ];

  const handleSave = async () => {
    await updateAppearanceOnServer(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBg(true);
    try {
      const res = await api.uploadFile(file, 'image');
      setForm((prev) => ({ ...prev, customBackgroundUrl: res.url }));
    } catch {
      alert('فشل رفع الخلفية');
    } finally {
      setUploadingBg(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Palette className="w-5 h-5 text-cyan-400" />
            <span>المظهر، الألوان، والثيمات</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تخصيص الهوية البصرية، ألوان الأزرار والتدرجات، وصور الخلفية العامة للموقع.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition-all self-start sm:self-auto"
        >
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{savedSuccess ? 'تم حفظ المظهر!' : 'حفظ الإعدادات'}</span>
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">الوضع الافتراضي (Dark / Light)</h3>
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <button
            type="button"
            onClick={() => setForm({ ...form, themeMode: 'dark' })}
            className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
              form.themeMode === 'dark'
                ? 'bg-cyan-500/15 border-cyan-500 text-white font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-5 h-5 text-cyan-400" />
            <div className="text-start">
              <span className="block text-xs font-bold">الوضع الليلي (Dark)</span>
              <span className="text-[11px] text-slate-500 font-normal">مظهر رقمي تقني عالي التباين</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setForm({ ...form, themeMode: 'light' })}
            className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
              form.themeMode === 'light'
                ? 'bg-cyan-500/15 border-cyan-500 text-white font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-400" />
            <div className="text-start">
              <span className="block text-xs font-bold">الوضع الفاتح (Light)</span>
              <span className="text-[11px] text-slate-500 font-normal">خلفيات واضحة ومشرقة</span>
            </div>
          </button>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
        <h3 className="text-base font-bold text-white">الألوان الرئيسية والتركيبات</h3>
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400">قوالب ألوان جاهزة:</span>
          <div className="flex flex-wrap gap-3">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    primaryColor: preset.primary,
                    accentColor: preset.accent,
                  })
                }
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center -space-x-1">
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.primary }} />
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.accent }} />
                </div>
                <span className="text-xs text-slate-300 font-medium">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">اللون الأساسي (Primary Color)</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.primaryColor}
                onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={form.primaryColor}
                onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs font-mono text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">اللون الثانوي والتمييز (Accent Color)</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.accentColor}
                onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={form.accentColor}
                onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs font-mono text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">صورة خلفية مخصصة للموقع (Wallpaper)</h3>
        <p className="text-xs text-slate-400">
          يمكنك تعيين صورة خلفية مخصصة بدقة عالية مع طبقة تغطية نصف شفافة للحفاظ على وضوح النصوص.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={form.customBackgroundUrl || ''}
            onChange={(e) => setForm({ ...form, customBackgroundUrl: e.target.value })}
            placeholder="رابط الصورة أو قم برفع ملف مباشرة"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
          />
          <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer border border-slate-700">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>{uploadingBg ? 'جاري الرفع...' : 'رفع صورة'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
          </label>
        </div>
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">شفافية طبقة التعتيم الخلفية:</span>
            <span className="text-cyan-400 font-mono font-bold">{form.backgroundOverlayOpacity || 85}%</span>
          </div>
          <input
            type="range"
            min={30}
            max={98}
            value={form.backgroundOverlayOpacity || 85}
            onChange={(e) => setForm({ ...form, backgroundOverlayOpacity: parseInt(e.target.value) })}
            className="w-full accent-cyan-500"
          />
        </div>
      </div>
    </div>
  );
};
