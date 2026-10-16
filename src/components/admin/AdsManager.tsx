import React, { useState, useEffect } from 'react';
import { Advertisement, AdSenseConfig } from '../../types';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import {
  Megaphone,
  PlusCircle,
  Trash2,
  Edit,
  Check,
  Sparkles,
  ExternalLink,
  Settings,
} from 'lucide-react';

export const AdsManager: React.FC = () => {
  const { t } = useLanguage();
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [adsense, setAdsense] = useState<AdSenseConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // New/Edit Ad Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Partial<Advertisement> | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [adsData, adsenseData] = await Promise.all([api.getAds(true), api.getAdSenseConfig()]);
      setAds(adsData);
      setAdsense(adsenseData);
    } catch (err) {
      console.error('Failed to load ads', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAd || !editingAd.title) return;

    try {
      await api.saveAd(editingAd);
      setModalOpen(false);
      setEditingAd(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'فشل حفظ الإعلان');
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
    try {
      await api.deleteAd(id);
      setAds((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert('فشل حذف الإعلان');
    }
  };

  const handleSaveAdsense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adsense) return;
    try {
      await api.saveAdSenseConfig(adsense);
      alert('تم حفظ إعدادات AdSense بنجاح!');
    } catch {
      alert('فشل حفظ إعدادات AdSense');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-400" />
            <span>{t.adsTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            إدارة الحملات الإعلانية الخاصة بك وربط شبكة Google AdSense.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingAd({
              title: '',
              description: '',
              imageUrl: '',
              targetUrl: '',
              advertiserName: 'OMERRAVAS Studio',
              placement: 'between_sections',
              startDate: new Date().toISOString().split('T')[0],
              endDate: '2027-12-31',
              isEnabled: true,
            });
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-amber-500/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.addAdBtn}</span>
        </button>
      </div>

      {/* Own Promoted Ads Grid */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>إعلاناتك الترويجية واللافتات الخاصة</span>
        </h3>

        {loading ? (
          <div className="p-12 text-center text-slate-400">جاري التحميل...</div>
        ) : ads.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">لا توجد إعلانات نشطة حالياً.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ads.map((ad) => (
              <div
                key={ad.id}
                className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/10 text-cyan-400">
                      {ad.placement}
                    </span>
                    <span className={`text-[11px] font-bold ${ad.isEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {ad.isEnabled ? 'مفعل' : 'متوقف'}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mb-1">{ad.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {ad.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                    <span>النقرات: <strong className="text-cyan-400">{ad.clicks || 0}</strong></span>
                    <span>•</span>
                    <span>{ad.advertiserName}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAd(ad);
                      setModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300"
                  >
                    <Edit className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAd(ad.id)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-red-500/20 text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Google AdSense Settings */}
      {adsense && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-400" />
            <span>{t.adsenseSettingsTitle}</span>
          </h3>

          <form onSubmit={handleSaveAdsense} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Publisher ID (معرف الناشر)</label>
                <input
                  type="text"
                  value={adsense.publisherId || ''}
                  onChange={(e) => setAdsense({ ...adsense, publisherId: e.target.value })}
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Banner Slot ID (معرف الإعلان)</label>
                <input
                  type="text"
                  value={adsense.bannerSlotId || ''}
                  onChange={(e) => setAdsense({ ...adsense, bannerSlotId: e.target.value })}
                  placeholder="XXXXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white font-mono"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adsense.isNetworkEnabled}
                  onChange={(e) => setAdsense({ ...adsense, isNetworkEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700"
                />
                <span className="text-xs font-bold text-white">تفعيل إعلانات Google AdSense في الموقع</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adsense.isTestMode}
                  onChange={(e) => setAdsense({ ...adsense, isTestMode: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
                />
                <span className="text-xs font-bold text-amber-400">وضع الاختبار (Test Mode)</span>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all"
              >
                <Check className="w-4 h-4" />
                <span>حفظ إعدادات AdSense</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ad Form Modal */}
      {modalOpen && editingAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-7 space-y-5">
            <h3 className="text-lg font-bold text-white">
              {editingAd.id ? 'تعديل الإعلان' : t.addAdBtn}
            </h3>

            <form onSubmit={handleSaveAd} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">{t.adTitleLabel}</label>
                <input
                  type="text"
                  required
                  value={editingAd.title || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">وصف الإعلان</label>
                <textarea
                  rows={2}
                  value={editingAd.description || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">{t.adTargetUrlLabel}</label>
                <input
                  type="text"
                  value={editingAd.targetUrl || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, targetUrl: e.target.value })}
                  placeholder="https://... أو #contact"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">{t.adPlacementLabel}</label>
                  <select
                    value={editingAd.placement || 'between_sections'}
                    onChange={(e) => setEditingAd({ ...editingAd, placement: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    <option value="hero_banner">Hero Banner</option>
                    <option value="between_sections">Between Sections</option>
                    <option value="project_gallery">Project Gallery</option>
                    <option value="footer">Footer</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">اسم المعلن</label>
                  <input
                    type="text"
                    value={editingAd.advertiserName || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, advertiserName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 bg-slate-800"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-md"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
