import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Cloud,
  FileCode,
  Download,
  ExternalLink,
  ShieldCheck,
  Check,
  FolderOpen,
} from 'lucide-react';

interface PublicDriveFile {
  id: string;
  name: string;
  type: string;
  size: string;
  updated: string;
  url: string;
  isDirect: boolean;
}

export const DrivePublicShowcase: React.FC = () => {
  const { t } = useLanguage();
  const [sharedFiles, setSharedFiles] = useState<PublicDriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/drive/public-files')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setSharedFiles(data))
      .catch(() => setSharedFiles([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = (fileId: string, url: string, isDirect: boolean) => {
    setDownloadSuccess(fileId);
    setTimeout(() => setDownloadSuccess(null), 3000);
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    if (isDirect) {
      a.download = '';
    }
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <section id="drive" className="py-20 relative bg-slate-950/60 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            <Cloud className="w-3.5 h-3.5" />
            <span>Google Drive API v3 Cloud Storage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {t.driveShowcaseTitle}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {t.driveShowcaseSubtitle}
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-2" />
            <span className="text-xs">جاري فحص مستودع Google Drive...</span>
          </div>
        ) : sharedFiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            {sharedFiles.map((file) => (
              <div
                key={file.id}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                    <FileCode className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5 break-all">
                    {file.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mb-4">
                    <span>{file.type || 'ملف سحابي'}</span>
                    <span>•</span>
                    <span>{file.size}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500">
                    {file.updated}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDownload(file.id, file.url, file.isDirect)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all"
                  >
                    {downloadSuccess === file.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>بدأ التحميل</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>{t.btnDownload}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-xl mx-auto text-center p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 space-y-3">
            <Cloud className="w-10 h-10 text-cyan-400/60 mx-auto" />
            <h3 className="text-sm font-bold text-slate-200">مستودع Google Drive السحابي</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              الملفات السحابية وحزم التثبيت مرتبطة مباشرة بـ Google Drive. عند إضافة أو نشر أي ملفات جديدة من لوحة التحكم، ستظهر هنا فورياً للزوار مع الحماية المحددة.
            </p>
          </div>
        )}

        <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>حماية وتحقق بروتوكول OAuth 2.0</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-cyan-400" />
            <span>مزامنة مباشرة وآمنة</span>
          </div>
        </div>
      </div>
    </section>
  );
};
