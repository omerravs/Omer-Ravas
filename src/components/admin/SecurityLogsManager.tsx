import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Shield,
  KeyRound,
  Activity,
  CheckCircle2,
  Clock,
  Lock,
  AlertCircle,
  Check,
} from 'lucide-react';

export const SecurityLogsManager: React.FC = () => {
  const { changePassword } = useAuth();
  const { t } = useLanguage();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Password change state
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [changingPass, setChangingPass] = useState(false);

  useEffect(() => {
    api.getActivityLogs()
      .then((data) => setLogs(data))
      .catch((err) => console.error('Failed to load logs', err))
      .finally(() => setLoading(false));
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPass || !newPass) return;

    setChangingPass(true);
    setPassMsg(null);

    try {
      const res = await changePassword(oldPass, newPass);
      if (res.success) {
        setPassMsg({ success: true, text: 'تم تحديث كلمة مرور المشرف بنجاح!' });
        setOldPass('');
        setNewPass('');
      } else {
        setPassMsg({ success: false, text: res.message || 'فشل تحديث كلمة المرور' });
      }
    } catch (err: any) {
      setPassMsg({ success: false, text: err.message || 'خطأ في الاتصال بالخادم' });
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span>{t.tabSecurity}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          إدارة حماية الحساب، تغيير كلمة مرور المشرف، ومراجعة سجل النشاطات والعمليات الإدارية.
        </p>
      </div>

      {/* Change Password Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-cyan-400" />
          <span>تغيير كلمة مرور المشرف</span>
        </h3>

        {passMsg && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
              passMsg.success
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-red-500/10 border-red-500/20 text-red-300'
            }`}
          >
            {passMsg.success ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
            <span>{passMsg.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">كلمة المرور الحالية</label>
            <input
              type="password"
              required
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              placeholder="••••"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">كلمة المرور الجديدة</label>
            <input
              type="password"
              required
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="4 أحرف على الأقل"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={changingPass}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{changingPass ? t.loading : 'تحديث كلمة المرور'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Activity Logs */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>سجل نشاطات النظام والعمليات الإدارية</span>
        </h3>

        {loading ? (
          <div className="p-12 text-center text-slate-400">جاري تحميل السجلات...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">لا توجد سجلات مسجلة.</div>
        ) : (
          <div className="space-y-2.5">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className={`w-4 h-4 flex-shrink-0 ${
                      log.success ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  />
                  <div>
                    <span className="font-bold text-white block mb-0.5">{log.action}</span>
                    <span className="text-slate-400 text-[11px]">{log.details}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono whitespace-nowrap">
                  <span>IP: {log.ip || 'internal'}</span>
                  <span>•</span>
                  <Clock className="w-3 h-3" />
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
