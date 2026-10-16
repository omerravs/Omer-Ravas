import React, { useState } from 'react';
import { Project } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { DownloadPasswordModal } from './DownloadPasswordModal';
import {
  X,
  ExternalLink,
  Download,
  Calendar,
  Layers,
  Smartphone,
  HardDrive,
  CheckCircle,
  Lock,
} from 'lucide-react';

interface ProjectDetailsModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ project, onClose }) => {
  const { t, getLocalized } = useLanguage();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [targetDownloadUrl, setTargetDownloadUrl] = useState<string | null>(null);

  if (!project) return null;

  const title = getLocalized(project.title) || 'Untitled';
  const fullDesc = getLocalized(project.fullDescription) || getLocalized(project.shortDescription);
  const images = project.screenshots && project.screenshots.length > 0 ? project.screenshots : [project.mainImage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden z-10 my-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {project.platform}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {project.version || 'v1.0.0'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Screenshot & Thumbnails */}
          <div className="space-y-3">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src={images[activeImageIndex] || project.mainImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImageIndex === idx ? 'border-cyan-400 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project Title & Metadata Grid */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              {title}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Layers className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <div>
                  <span className="text-slate-500 block">{t.categoryLabel}</span>
                  <span className="font-semibold capitalize">{project.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Calendar className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="text-slate-500 block">{t.releasedOn}</span>
                  <span className="font-semibold">{project.releaseDate || '2026'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Smartphone className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <div>
                  <span className="text-slate-500 block">{t.versionLabel}</span>
                  <span className="font-mono font-semibold">{project.version || 'v1.0.0'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300">
                <HardDrive className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div>
                  <span className="text-slate-500 block">File Size</span>
                  <span className="font-semibold">{project.fileSize || 'Direct Link'}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-3 mb-6">
              <p className="whitespace-pre-line">{fullDesc}</p>
            </div>

            {/* Tech Stack Tags */}
            <div className="space-y-2 mb-8">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                {t.tagsLabel}
              </span>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 text-cyan-300 border border-slate-700"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* APK Download Button */}
            {(project.apkFileUrl || (project.platform === 'Android APK' && project.downloadUrl)) && (
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
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 transition-all"
              >
                {project.requireDownloadPassword ? (
                  <Lock className="w-4 h-4 text-amber-300" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{t.btnDownloadApk} {project.fileSize && `(${project.fileSize})`}</span>
              </button>
            )}

            {/* Windows Desktop File Download */}
            {project.desktopFileUrl && (
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
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all"
              >
                {project.requireDownloadPassword ? (
                  <Lock className="w-4 h-4 text-amber-300" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>تحميل البرنامج للويندوز (EXE)</span>
              </button>
            )}

            {/* Live Demo Website */}
            {project.websiteUrl && (
              <a
                href={project.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-200 bg-slate-800 hover:bg-cyan-600 border border-slate-700 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{t.btnLiveDemo}</span>
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            {t.closeModal}
          </button>
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
