import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { ProjectFormModal } from './ProjectFormModal';
import {
  PlusCircle,
  Search,
  Edit,
  Copy,
  Trash2,
  ExternalLink,
  Check,
  Smartphone,
  Eye,
  EyeOff,
  Filter,
} from 'lucide-react';

export const ProjectManager: React.FC = () => {
  const { t, getLocalized } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getProjects({ all: true });
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDuplicate = async (id: string) => {
    try {
      const duplicated = await api.duplicateProject(id);
      setProjects((prev) => [duplicated, ...prev]);
    } catch (err) {
      alert('فشل نسخ المشروع');
    }
  };

  const handleTogglePublish = async (project: Project) => {
    try {
      const updated = await api.saveProject(
        { ...project, isPublished: !project.isPublished },
        true
      );
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      alert('فشل تحديث حالة النشر');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      alert('فشل حذف المشروع');
    }
  };

  const copyProjectLink = (id: string) => {
    const url = `${window.location.origin}/#project-${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = projects.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        p.title?.ar?.toLowerCase().includes(q) ||
        p.title?.en?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {t.tabProjects}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            إدارة كافة المشاريع، حزم الأندرويد APK، وتطبيقات الويب وسطح المكتب.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingProject(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.addNewProject}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute top-1/2 -translate-y-1/2 right-3.5 rtl:right-auto rtl:left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث في المشاريع..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto self-end">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">كافة التصنيفات</option>
            <option value="web">Web Apps</option>
            <option value="android">Android APK</option>
            <option value="windows">Windows Desktop</option>
            <option value="ai">AI / ML</option>
            <option value="tools">Tools</option>
            <option value="services">Services</option>
          </select>
          <span className="text-xs text-slate-500 font-mono">
            ({filtered.length})
          </span>
        </div>
      </div>

      {/* Projects Table / Cards */}
      {loading ? (
        <div className="p-16 text-center text-slate-400">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-2" />
          <span>جاري تحميل المشاريع...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs">
          لا توجد مشاريع مضافة بعد. اضغط على "إضافة مشروع جديد" للبدء.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 mb-3 border border-slate-800">
                  <img
                    src={proj.mainImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80'}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 inset-x-2 flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-950/80 text-white font-semibold backdrop-blur-sm">
                      {proj.platform}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(proj)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded font-bold backdrop-blur-sm transition-all ${
                        proj.isPublished
                          ? 'bg-emerald-500/90 text-slate-950'
                          : 'bg-amber-500/90 text-slate-950'
                      }`}
                    >
                      {proj.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{proj.isPublished ? 'منشور' : 'مسودة'}</span>
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white line-clamp-1 mb-1">
                  {getLocalized(proj.title) || 'مشروع بدون اسم'}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {getLocalized(proj.shortDescription)}
                </p>

                {/* Meta details */}
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                  <span>{proj.version || 'v1.0.0'}</span>
                  <span>•</span>
                  <span>{proj.releaseDate || '2026'}</span>
                  {proj.apkFileUrl && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-400 font-sans font-semibold">APK مرفق</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProject(proj);
                    setModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  title={t.edit}
                >
                  <Edit className="w-3.5 h-3.5 text-cyan-400" />
                  <span>تعديل</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDuplicate(proj.id)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title={t.duplicateProject}
                >
                  <Copy className="w-3.5 h-3.5 text-blue-400" />
                  <span>نسخ</span>
                </button>

                <button
                  type="button"
                  onClick={() => copyProjectLink(proj.id)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="نسخ رابط المشروع"
                >
                  {copiedId === proj.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ExternalLink className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(proj.id)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-red-400 transition-colors"
                  title={t.delete}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">
              {t.deleteProject}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.confirmDeleteProject}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
              >
                {t.cancelBtn}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Form Modal */}
      <ProjectFormModal
        isOpen={modalOpen}
        project={editingProject}
        onClose={() => {
          setModalOpen(false);
          setEditingProject(null);
        }}
        onSaved={(saved) => {
          setProjects((prev) => {
            const index = prev.findIndex((p) => p.id === saved.id);
            if (index >= 0) {
              const copy = [...prev];
              copy[index] = saved;
              return copy;
            }
            return [saved, ...prev];
          });
        }}
      />
    </div>
  );
};
