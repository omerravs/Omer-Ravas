import React, { useState } from 'react';
import { Project } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { DownloadPasswordModal } from './DownloadPasswordModal';
import {
  ExternalLink,
  Download,
  Info,
  Smartphone,
  AppWindow,
  Globe,
  Cpu,
  Package,
  Lock,
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onOpenDetails: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenDetails }) => {
  const { t, getLocalized } = useLanguage();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [targetDownloadUrl, setTargetDownloadUrl] = useState<string | null>(null);

  const title = getLocalized(project.title) || 'Untitled Project';
  const shortDesc = getLocalized(project.shortDescription) || '';

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Android APK':
        return <Smartphone className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Windows Desktop':
        return <AppWindow className="w-3.5 h-3.5 text-blue-400" />;
      case 'AI / ML':
        return <Cpu className="w-3.5 h-3.5 text-purple-400" />;
      case 'Web App':
        return <Globe className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <Package className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="group flex flex-col bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1">
      {/* Cover Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={project.mainImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Platform & Version Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-white shadow-md">
            {getPlatformIcon(project.platform)}
            <span>{project.platform}</span>
          </span>

          {project.version && (
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 backdrop-blur-md">
              {project.version}
            </span>
          )}
        </div>

        {/* Featured Ribbon */}
        {project.isFeatured && (
          <div className="absolute bottom-2.5 left-3">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1 mb-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2 mb-4">
            {shortDesc}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[11px] font-medium rounded bg-slate-800/80 text-slate-300 border border-slate-700/50"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="text-[11px] text-slate-500 self-center">
                +{project.tags.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {/* Details Button */}
          <button
            type="button"
            onClick={() => onOpenDetails(project)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.viewDetails}</span>
          </button>

          {/* Android APK Download or Direct Binary Download */}
          {(project.apkFileUrl || project.downloadUrl) && (
            <button
              type="button"
              onClick={() => {
                const url = project.apkFileUrl || project.downloadUrl!;
                if (project.requireDownloadPassword && project.downloadPassword) {
                  setTargetDownloadUrl(url);
                  setShowPasswordModal(true);
                } else {
                  window.open(url, '_blank');
                }
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white transition-colors shadow-sm"
              title={project.fileSize ? `Download APK (${project.fileSize})` : 'Download APK'}
            >
              {project.requireDownloadPassword ? (
                <Lock className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>APK</span>
            </button>
          )}

          {/* Windows Desktop File Download */}
          {project.desktopFileUrl && !project.apkFileUrl && (
            <button
              type="button"
              onClick={() => {
                const url = project.desktopFileUrl!;
                if (project.requireDownloadPassword && project.downloadPassword) {
                  setTargetDownloadUrl(url);
                  setShowPasswordModal(true);
                } else {
                  window.open(url, '_blank');
                }
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-blue-600/90 hover:bg-blue-500 text-white transition-colors shadow-sm"
              title={project.fileSize ? `Download EXE (${project.fileSize})` : 'Download Desktop'}
            >
              {project.requireDownloadPassword ? (
                <Lock className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>EXE</span>
            </button>
          )}

          {/* Live Web Demo */}
          {project.websiteUrl && (
            <a
              href={project.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-cyan-600 rounded-lg transition-colors"
              title={t.btnLiveDemo}
              aria-label="Open live demo in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Password Verification Modal */}
      {showPasswordModal && (
        <DownloadPasswordModal
          project={project}
          downloadUrl={targetDownloadUrl}
          onClose={() => {
            setShowPasswordModal(false);
            setTargetDownloadUrl(null);
          }}
        />
      )}
    </div>
  );
};
