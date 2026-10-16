import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { HomepageSettings } from '../../types';
import {
  ArrowDown,
  Terminal,
  Smartphone,
  AppWindow,
  Cpu,
  Download,
  Send,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface HeroSectionProps {
  homepage: HomepageSettings;
  projectsCount?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ homepage, projectsCount = 6 }) => {
  const { t, getLocalized } = useLanguage();
  const { appearance } = useTheme();

  const headline = getLocalized(homepage.heroHeadline) || t.heroDefaultTitle;
  const subtitle = getLocalized(homepage.heroSubtitle) || t.heroDefaultSubtitle;

  const platformPills = [
    { label: 'Android APK', icon: Smartphone, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
    { label: 'Web Apps', icon: Terminal, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
    { label: 'Windows Suite', icon: AppWindow, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
    { label: 'AI & Intelligence', icon: Cpu, color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
  ];

  return (
    <section id="home" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-16 sm:py-24">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[600px] sm:h-[600px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-2/3 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-600/10 blur-[110px] rounded-full pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        {/* Engineering Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner mb-6">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs sm:text-sm font-medium text-slate-300 tracking-wide">
            {t.heroBadge}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight sm:leading-tight mb-6">
          <span className="block mb-2 font-mono text-cyan-400 text-lg sm:text-2xl font-semibold tracking-wider">
            {getLocalized(homepage.brandName) || 'OMERRAVAS'}
          </span>
          <span
            className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400"
            style={{
              backgroundImage: `linear-gradient(to right, #ffffff, #e2e8f0, ${appearance.primaryColor || '#06b6d4'})`,
            }}
          >
            {headline}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-slate-300 font-normal leading-relaxed mb-10">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <a
            href={homepage.heroPrimaryBtnUrl || '#projects'}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-white shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 hover:shadow-cyan-500/40"
            style={{
              background: `linear-gradient(135deg, ${appearance.primaryColor || '#06b6d4'}, ${appearance.accentColor || '#3b82f6'})`,
            }}
          >
            <Download className="w-5 h-5" />
            <span>{getLocalized(homepage.heroPrimaryBtnText) || t.btnExploreProjects}</span>
          </a>

          <a
            href={homepage.heroSecondaryBtnUrl || '#contact'}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-500 transition-all transform hover:-translate-y-0.5"
          >
            <Send className="w-4 h-4 text-cyan-400" />
            <span>{getLocalized(homepage.heroSecondaryBtnText) || t.btnContactMe}</span>
          </a>
        </div>

        {/* Supported Platforms Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 max-w-3xl mx-auto mb-12">
          {platformPills.map((pill) => {
            const Icon = pill.icon;
            return (
              <div
                key={pill.label}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold tracking-wide ${pill.color} backdrop-blur-sm`}
              >
                <Icon className="w-4 h-4" />
                <span>{pill.label}</span>
              </div>
            );
          })}
        </div>

        {/* Quick Highlights Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
              {projectsCount}+
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">{t.completedProjectsCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              100%
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Production Tested</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono">
              3
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Languages (AR / TR / EN)</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono flex items-center justify-center gap-1">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Google Drive API v3</div>
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="mt-12 flex justify-center">
          <a
            href="#projects"
            className="p-2 text-slate-400 hover:text-cyan-400 transition-colors animate-bounce"
            aria-label="Scroll to projects"
          >
            <ArrowDown className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};
