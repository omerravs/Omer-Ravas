import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import {
  Layers,
  Smartphone,
  Cloud,
  HardDrive,
  Activity,
  PlusCircle,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
} from 'lucide-react';

interface DashboardOverviewProps {
  onNavigateTab: (tab: string) => void;
  onOpenNewProject: () => void;
  onViewPublic: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateTab,
  onOpenNewProject,
  onViewPublic,
}) => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getDashboardStats(), api.getActivityLogs()])
      .then(([statsData, logsData]) => {
        setStats(statsData);
        setLogs(logsData.slice(0, 8));
      })
      .catch((err) => console.error('Failed to load dashboard data', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16 text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mb-2" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>لوحة التحكم المركزية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              مرحباً بك في إدارة OMERRAVAS PORTFOLIO
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              تحكم كامل في نشر المشاريع، حزم الأندرويد APK، إعدادات الواجهة، وحسابات Google Drive المتعددة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenNewProject}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.addNewProject}</span>
            </button>

            <button
              type="button"
              onClick={onViewPublic}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>معاينة الموقع العام</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              إجمالي المشاريع
            </span>
            <div className="text-3xl font-black text-white font-mono">
              {stats?.totalProjects ?? 0}
            </div>
            <span className="text-[11px] text-emerald-400 font-medium mt-1 block">
              {stats?.publishedProjects ?? 0} منشور • {stats?.draftProjects ?? 0} مسودة
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400">
            <Layers className="w-7 h-7" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              حسابات Google Drive
            </span>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              {stats?.connectedDriveAccounts ?? 0}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Google Drive API v3
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400">
            <Cloud className="w-7 h-7" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              النسخ الاحتياطية
            </span>
            <div className="text-3xl font-black text-purple-400 font-mono">
              {stats?.totalBackups ?? 0}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              حزم سحابية جاهزة
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400">
            <HardDrive className="w-7 h-7" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              إجمالي التحميلات
            </span>
            <div className="text-3xl font-black text-amber-400 font-mono">
              {stats?.totalDownloads ?? 142}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              حزم APK وبرامج
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400">
            <Download className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Category Breakdown & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>توزيع المشاريع حسب التصنيف</span>
          </h3>

          <div className="space-y-3 pt-2">
            {[
              { label: 'تطبيقات أندرويد (APK)', key: 'android', color: 'bg-emerald-500' },
              { label: 'تطبيقات الويب', key: 'web', color: 'bg-cyan-500' },
              { label: 'برامج ويندوز', key: 'windows', color: 'bg-blue-500' },
              { label: 'الذكاء الاصطناعي (AI)', key: 'ai', color: 'bg-purple-500' },
              { label: 'أدوات ومساعدات', key: 'tools', color: 'bg-amber-500' },
              { label: 'خدمات سحابية', key: 'services', color: 'bg-rose-500' },
            ].map((cat) => {
              const count = stats?.categoriesCount?.[cat.key] || 0;
              const total = stats?.totalProjects || 1;
              const percentage = Math.round((count / total) * 100);

              return (
                <div key={cat.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-300">{cat.label}</span>
                    <span className="text-slate-400 font-mono">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className={`h-full ${cat.color} transition-all duration-700`}
                      style={{ width: `${Math.max(percentage, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => onNavigateTab('projects')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-cyan-400 transition-colors"
            >
              الانتقال إلى مدير المشاريع الكامل ←
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>النشاط الإداري الأخير والعمليات</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab('security')}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              عرض السجل كاملاً
            </button>
          </div>

          <div className="space-y-2.5 pt-2">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2
                      className={`w-4 h-4 flex-shrink-0 ${
                        log.success ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    />
                    <div>
                      <span className="font-semibold text-slate-200 block">
                        {log.action}
                      </span>
                      <span className="text-slate-400 text-[11px] line-clamp-1">
                        {log.details}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono whitespace-nowrap">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                لا توجد سجلات حديثة.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
