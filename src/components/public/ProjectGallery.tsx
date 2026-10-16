import React, { useState, useMemo } from 'react';
import { Project, ProjectCategory } from '../../types';
import { ProjectCard } from './ProjectCard';
import { useLanguage } from '../../context/LanguageContext';
import { Search, Filter, Layers, FolderOpen } from 'lucide-react';

interface ProjectGalleryProps {
  projects: Project[];
  onOpenDetails: (project: Project) => void;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ projects, onOpenDetails }) => {
  const { t, getLocalized } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: t.allCategories },
    { key: 'web', label: t.categoryWeb },
    { key: 'android', label: t.categoryAndroid },
    { key: 'windows', label: t.categoryWindows },
    { key: 'ai', label: t.categoryAi },
    { key: 'tools', label: t.categoryTools },
    { key: 'services', label: t.categoryServices },
  ];

  const platforms = ['all', 'Web App', 'Android APK', 'Windows Desktop', 'AI / ML', 'UI / UX Design'];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      if (selectedPlatform !== 'all' && p.platform !== selectedPlatform) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch =
          p.title?.ar?.toLowerCase().includes(q) ||
          p.title?.tr?.toLowerCase().includes(q) ||
          p.title?.en?.toLowerCase().includes(q);
        const descMatch =
          p.shortDescription?.ar?.toLowerCase().includes(q) ||
          p.shortDescription?.tr?.toLowerCase().includes(q) ||
          p.shortDescription?.en?.toLowerCase().includes(q);
        const tagMatch = p.tags?.some((t) => t.toLowerCase().includes(q));
        if (!titleMatch && !descMatch && !tagMatch) {
          return false;
        }
      }
      return true;
    });
  }, [projects, selectedCategory, selectedPlatform, searchQuery]);

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>{t.allProjectsTitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {t.allProjectsTitle}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {t.projectsSubtitle}
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-4 mb-10">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.key
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 scale-[1.02]'
                    : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar & Platform Dropdown */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute top-1/2 -translate-y-1/2 right-3.5 rtl:right-auto rtl:left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>

            {/* Platform Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto self-end">
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">{t.filterByPlatform}: All</option>
                {platforms.filter((p) => p !== 'all').map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <span className="text-xs font-medium text-slate-400 px-2 py-1 rounded bg-slate-900 border border-slate-800">
                {filteredProjects.length}
              </span>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpenDetails={onOpenDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/80">
            <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300 mb-1">
              {projects.length === 0
                ? 'لا توجد مشاريع مضافة حتى الآن'
                : t.noProjectsFound}
            </h3>
            <p className="text-xs text-slate-500">
              {projects.length === 0
                ? 'يمكنك إضافة مشاريعك وتطبيقاتك الحقيقية وتحديد كلمات المرور للتحميل عبر لوحة الإدارة.'
                : 'حاول تغيير عبارة البحث أو اختيار تصنيف آخر.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
