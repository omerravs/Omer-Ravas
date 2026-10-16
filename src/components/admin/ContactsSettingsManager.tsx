import React, { useState, useEffect } from 'react';
import { ContactInfo } from '../../types';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import {
  Mail,
  Phone,
  MessageSquare,
  Plus,
  Trash2,
  Save,
  Check,
  Globe,
  Share2,
  AlertCircle,
} from 'lucide-react';

interface ContactsSettingsManagerProps {
  onUpdated?: (contact: ContactInfo) => void;
}

export const ContactsSettingsManager: React.FC<ContactsSettingsManagerProps> = ({ onUpdated }) => {
  const { t } = useLanguage();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    api.getContactInfo()
      .then((data) => setContactInfo(data))
      .catch((err) => console.error('Failed to load contact info', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo) return;

    setSaving(true);
    setSavedSuccess(false);
    setErrorMsg(null);

    try {
      const saved = await api.saveContactInfo(contactInfo);
      setContactInfo(saved);
      if (onUpdated) {
        onUpdated(saved);
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'فشل حفظ بيانات الاتصال');
    } finally {
      setSaving(false);
    }
  };

  const addPhone = () => {
    if (!contactInfo) return;
    const newItem = {
      id: 'phone-' + Date.now(),
      label: 'خط مباشر إضافي',
      number: '+90 552 000 0000',
      countryCode: '+90',
      isPrimary: false,
      enabled: true,
    };
    setContactInfo({
      ...contactInfo,
      phoneNumbers: [...(contactInfo.phoneNumbers || []), newItem],
    });
  };

  const removePhone = (id: string) => {
    if (!contactInfo) return;
    setContactInfo({
      ...contactInfo,
      phoneNumbers: contactInfo.phoneNumbers.filter((p) => p.id !== id),
    });
  };

  const addWhatsapp = () => {
    if (!contactInfo) return;
    const newItem = {
      id: 'wa-' + Date.now(),
      label: 'واتساب إضافي',
      number: '+905520000000',
      countryCode: '+90',
      defaultMessage: 'مرحباً عمر، أود الاستفسار حول مشروع جديد...',
      isPrimary: false,
      enabled: true,
    };
    setContactInfo({
      ...contactInfo,
      whatsappNumbers: [...(contactInfo.whatsappNumbers || []), newItem],
    });
  };

  const removeWhatsapp = (id: string) => {
    if (!contactInfo) return;
    setContactInfo({
      ...contactInfo,
      whatsappNumbers: contactInfo.whatsappNumbers.filter((w) => w.id !== id),
    });
  };

  if (loading || !contactInfo) {
    return <div className="p-12 text-center text-slate-400">جاري التحميل...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-400" />
            <span>{t('tabContacts')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            إدارة أرقام الهواتف، قنوات واتساب، البريد الإلكتروني، والشبكات الاجتماعية.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all self-start sm:self-auto cursor-pointer"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saving ? t('loading') : savedSuccess ? 'تم الحفظ وتحديث الموقع!' : 'حفظ التعديلات'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center gap-3">
          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>تم حفظ كافة بيانات الاتصال وأرقام الهواتف بنجاح وتحديثها فورياً في الموقع العام!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Email & Social Links */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>البريد الإلكتروني والروابط الاجتماعية</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">{t('emailTitle')}</label>
            <input
              type="email"
              value={contactInfo.email || ''}
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">Telegram URL</label>
            <input
              type="text"
              value={contactInfo.telegramUrl || ''}
              onChange={(e) => setContactInfo({ ...contactInfo, telegramUrl: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">GitHub URL</label>
            <input
              type="text"
              value={contactInfo.githubUrl || ''}
              onChange={(e) => setContactInfo({ ...contactInfo, githubUrl: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">LinkedIn URL</label>
            <input
              type="text"
              value={contactInfo.linkedinUrl || ''}
              onChange={(e) => setContactInfo({ ...contactInfo, linkedinUrl: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* Phone Numbers Manager */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>{t('phoneNumbersTitle')}</span>
          </h3>
          <button
            type="button"
            onClick={addPhone}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-emerald-400"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة رقم هاتف</span>
          </button>
        </div>

        <div className="space-y-3">
          {contactInfo.phoneNumbers?.map((phone, idx) => (
            <div key={phone.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={phone.label}
                  onChange={(e) => {
                    const val = e.target.value;
                    setContactInfo({
                      ...contactInfo,
                      phoneNumbers: contactInfo.phoneNumbers.map((p, i) =>
                        i === idx ? { ...p, label: val } : p
                      ),
                    });
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs text-white w-48"
                  placeholder="تسمية الرقم"
                />

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={phone.enabled}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setContactInfo({
                          ...contactInfo,
                          phoneNumbers: contactInfo.phoneNumbers.map((p, i) =>
                            i === idx ? { ...p, enabled: checked } : p
                          ),
                        });
                      }}
                      className="rounded text-cyan-500 bg-slate-900"
                    />
                    <span>مفعل</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => removePhone(phone.id)}
                    className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <input
                type="text"
                value={phone.number}
                onChange={(e) => {
                  const val = e.target.value;
                  setContactInfo({
                    ...contactInfo,
                    phoneNumbers: contactInfo.phoneNumbers.map((p, i) =>
                      i === idx ? { ...p, number: val } : p
                    ),
                  });
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono"
                placeholder="+90 552 000 0000"
              />
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp Numbers Manager */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>قنوات ومقرات واتساب المباشرة</span>
          </h3>
          <button
            type="button"
            onClick={addWhatsapp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-emerald-400"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة رقم واتساب</span>
          </button>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={contactInfo.showFloatingWhatsApp}
              onChange={(e) => setContactInfo({ ...contactInfo, showFloatingWhatsApp: e.target.checked })}
              className="rounded text-emerald-500 bg-slate-900"
            />
            <span className="text-xs font-bold text-white">إظهار زر واتساب العائم (Floating Widget) في أسفل الموقع العام</span>
          </label>

          {contactInfo.whatsappNumbers?.map((wa, idx) => (
            <div key={wa.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={wa.label}
                  onChange={(e) => {
                    const val = e.target.value;
                    setContactInfo({
                      ...contactInfo,
                      whatsappNumbers: contactInfo.whatsappNumbers.map((w, i) =>
                        i === idx ? { ...w, label: val } : w
                      ),
                    });
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs text-white w-48"
                />

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wa.enabled}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setContactInfo({
                          ...contactInfo,
                          whatsappNumbers: contactInfo.whatsappNumbers.map((w, i) =>
                            i === idx ? { ...w, enabled: checked } : w
                          ),
                        });
                      }}
                      className="rounded text-emerald-500 bg-slate-900"
                    />
                    <span>مفعل</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => removeWhatsapp(wa.id)}
                    className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={wa.number}
                  onChange={(e) => {
                    const val = e.target.value;
                    setContactInfo({
                      ...contactInfo,
                      whatsappNumbers: contactInfo.whatsappNumbers.map((w, i) =>
                        i === idx ? { ...w, number: val } : w
                      ),
                    });
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono"
                  placeholder="+905520000000"
                />

                <input
                  type="text"
                  value={wa.defaultMessage}
                  onChange={(e) => {
                    const val = e.target.value;
                    setContactInfo({
                      ...contactInfo,
                      whatsappNumbers: contactInfo.whatsappNumbers.map((w, i) =>
                        i === idx ? { ...w, defaultMessage: val } : w
                      ),
                    });
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                  placeholder="الرسالة التلقائية الافتراضية"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
