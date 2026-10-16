import React, { useState, useEffect } from 'react';
import { BackupRecord, ConnectedDriveAccount } from '../../types';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import {
  HardDrive,
  Download,
  RotateCcw,
  PlusCircle,
  Cloud,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileJson,
} from 'lucide-react';

export const BackupManager: React.FC = () => {
  const { t } = useLanguage();
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [accounts, setAccounts] = useState<ConnectedDriveAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedDriveAccount, setSelectedDriveAccount] = useState<string>('');
  const [backupNote, setBackupNote] = useState('');
  const [restoreConfirmData, setRestoreConfirmData] = useState<any | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bData, aData] = await Promise.all([api.getBackups(), api.getDriveAccounts()]);
      setBackups(bData);
      setAccounts(aData);
    } catch (err) {
      console.error('Failed to load backups', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateBackup = async () => {
    try {
      setCreating(true);
      await api.createBackup(backupNote || 'Manual backup from dashboard', selectedDriveAccount || undefined);
      setBackupNote('');
      loadData();
      alert('تم إنشاء النسخة الاحتياطية بنجاح!');
    } catch (err: any) {
      alert(err.message || 'فشل إنشاء النسخة الاحتياطية');
    } finally {
      setCreating(false);
    }
  };

  const handleFileUploadRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setRestoreConfirmData(json);
      } catch {
        alert('ملف النسخ الاحتياطي غير صالح (JSON غير متوافق)');
      }
    };
    reader.readAsText(file);
  };

  const executeRestore = async () => {
    if (!restoreConfirmData) return;
    try {
      await api.restoreBackup(restoreConfirmData);
      setRestoreConfirmData(null);
      alert('تم استعادة النسخة الاحتياطية وتحديث بيانات المنصة بنجاح!');
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'فشل عملية الاستعادة');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-purple-400" />
            <span>{t.backupTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t.backupSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 cursor-pointer border border-slate-700 transition-all">
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span>{t.btnRestoreBackup}</span>
            <input type="file" accept=".json" className="hidden" onChange={handleFileUploadRestore} />
          </label>
        </div>
      </div>

      {/* Create Backup Action Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-cyan-400" />
          <span>إنشاء نسخة احتياطية جديدة</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">ملاحظة أو وصف النسخة</label>
            <input
              type="text"
              value={backupNote}
              onChange={(e) => setBackupNote(e.target.value)}
              placeholder="مثال: نسخة احتياطية قبل تحديث المشاريع الكبرى"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">مزامنة تلقائية مع حساب Google Drive</label>
            <select
              value={selectedDriveAccount}
              onChange={(e) => setSelectedDriveAccount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white"
            >
              <option value="">(تخزين محلي فقط - بدون مزامنة درايف)</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.email} ({acc.displayName})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            disabled={creating}
            onClick={handleCreateBackup}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-600/25 disabled:opacity-50 transition-all"
          >
            <HardDrive className="w-4 h-4" />
            <span>{creating ? t.loading : t.btnCreateBackupNow}</span>
          </button>
        </div>
      </div>

      {/* Backup History List */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FileJson className="w-4 h-4 text-emerald-400" />
          <span>{t.backupHistoryTitle}</span>
        </h3>

        {loading ? (
          <div className="p-12 text-center text-slate-400">جاري التحميل...</div>
        ) : backups.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">لا توجد نسخ احتياطية مسجلة بعد.</div>
        ) : (
          <div className="space-y-3">
            {backups.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{b.note}</h4>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-0.5">
                      <span>{b.projectCount} مشروع محفوظ</span>
                      <span>•</span>
                      <span>{(b.sizeBytes / 1024).toFixed(1)} KB</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(b.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {b.driveFileId && (
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      مزامنة Drive
                    </span>
                  )}
                  <a
                    href={`/api/backups`}
                    download={`${b.id}.json`}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>تنزيل JSON</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Restore Confirmation Modal */}
      {restoreConfirmData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-bold text-white">تأكيد استعادة النسخة الاحتياطية</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.confirmRestore}
            </p>
            <div className="p-3 rounded-xl bg-slate-950 text-xs text-slate-400 font-mono">
              <div>تاريخ النسخة: {restoreConfirmData.timestamp || 'غير معروف'}</div>
              <div>عدد المشاريع: {restoreConfirmData.projects?.length || 0}</div>
            </div>
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setRestoreConfirmData(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 bg-slate-800"
              >
                {t.cancelBtn}
              </button>
              <button
                type="button"
                onClick={executeRestore}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500"
              >
                استعادة واستبدال البيانات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
