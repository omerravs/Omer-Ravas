import React, { useState } from 'react';
import { Project, ContactInfo } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  Lock,
  Unlock,
  KeyRound,
  Download,
  X,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

interface DownloadPasswordModalProps {
  project: Project | null;
  downloadUrl: string | null;
  contactInfo?: ContactInfo | null;
  onClose: () => void;
}

export const DownloadPasswordModal: React.FC<DownloadPasswordModalProps> = ({
  project,
  downloadUrl,
  contactInfo,
  onClose,
}) => {
  const { getLocalized, dir } = useLanguage();
  const [inputPassword, setInputPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!project || !downloadUrl) return null;

  const projectTitle = getLocalized(project.title);
  const waNumber =
    contactInfo?.whatsappNumbers?.find((w) => w.enabled)?.number ||
    contactInfo?.phoneNumbers?.find((p) => p.enabled)?.number ||
    '';

  const handleVerifyAndDownload = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // If password protection is configured on this project
    if (project.requireDownloadPassword && project.downloadPassword) {
      if (inputPassword.trim() === project.downloadPassword.trim()) {
        setIsSuccess(true);
        setTimeout(() => {
          // Trigger file download
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', '');
          link.setAttribute('target', '_blank');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setTimeout(() => {
            onClose();
          }, 1200);
        }, 600);
      } else {
        setErrorMsg('كلمة المرور غير صحيحة. يرجى التواصل مع عمر الرفاس للحصول على كلمة المرور الصحيحة.');
      }
    } else {
      // Direct download if no password needed
      window.open(downloadUrl, '_blank');
      onClose();
    }
  };

  const handleRequestPasswordViaWa = () => {
    if (!waNumber) {
      alert('يرجى التواصل عبر البريد الإلكتروني أو الهاتف الموضح في قسم اتصل بي.');
      return;
    }
    const clean = waNumber.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `مرحباً عمر الرفاس، أود الحصول على كلمة مرور لتحميل ملف مشروع: "${projectTitle}" (الإصدار: ${project.version || 'الأخير'}).`
    );
    window.open(`https://wa.me/${clean}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="text-center mb-6 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-cyan-500/10">
            {isSuccess ? <Unlock className="w-7 h-7 text-emerald-400" /> : <Lock className="w-7 h-7" />}
          </div>
          <h3 className="text-xl font-bold text-white mb-1">
            ملف محمي بكلمة مرور خاصة
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            لتحميل حزمة مشروع <span className="text-cyan-300 font-semibold">{projectTitle}</span>، يرجى إدخال كلمة المرور المعتمدة من قِبل عمر الرفاس.
          </p>
        </div>

        {/* Password Hint if provided */}
        {project.downloadPasswordHint && (
          <div className="mb-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>توجيه: {project.downloadPasswordHint}</span>
          </div>
        )}

        {/* Success notification */}
        {isSuccess && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>تم التحقق بنجاح! يبدأ التحميل الآن...</span>
          </div>
        )}

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handleVerifyAndDownload} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              كلمة مرور تحميل الملف
            </label>
            <div className="relative">
              <KeyRound className="absolute top-1/2 -translate-y-1/2 right-3.5 rtl:right-auto rtl:left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type="text"
                autoFocus
                disabled={isSuccess}
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                placeholder="أدخل كلمة المرور المصرح بها"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!inputPassword.trim() || isSuccess}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            <span>تأكيد وبدء التحميل</span>
          </button>
        </form>

        {/* WhatsApp Request Password Option */}
        <div className="mt-5 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400 mb-2">ليس لديك كلمة المرور؟ يمكنك طلبها مباشرة من المطور:</p>
          <button
            type="button"
            onClick={handleRequestPasswordViaWa}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-all w-full"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>طلب كلمة المرور عبر واتساب</span>
          </button>
        </div>
      </div>
    </div>
  );
};
