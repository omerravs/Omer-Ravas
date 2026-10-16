import React from 'react';
import { HomepageSettings } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  User,
  CheckCircle2,
  Code2,
  Cpu,
  Layers,
  Award,
  Terminal,
} from 'lucide-react';

interface AboutSectionProps {
  homepage: HomepageSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ homepage }) => {
  const { t, getLocalized } = useLanguage();

  const bio =
    getLocalized(homepage.aboutBio) ||
    'مهندس برمجيات ذو خبرة متقدمة في تطوير تطبيقات الويب السحابية، وتطبيقات الأندرويد، والبرمجيات الذكية.';

  const defaultSkills = [
    { name: 'TypeScript / React / Next.js', level: 95, category: 'Frontend' },
    { name: 'Android (Kotlin / Jetpack Compose)', level: 90, category: 'Mobile' },
    { name: 'Node.js & Express REST APIs', level: 92, category: 'Backend' },
    { name: 'Windows (.NET 8 / C# / WPF)', level: 85, category: 'Desktop' },
    { name: 'Google Cloud & Drive API v3', level: 94, category: 'Cloud' },
    { name: 'AI Models & Gemini Integration', level: 88, category: 'AI / ML' },
    { name: 'PostgreSQL, Firestore & SQLite', level: 90, category: 'Database' },
    { name: 'Tailwind CSS & Modern UI/UX', level: 96, category: 'Design' },
  ];

  const skills = homepage.skills && homepage.skills.length > 0 ? homepage.skills : defaultSkills;

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            <User className="w-3.5 h-3.5" />
            <span>{t.aboutTitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {t.aboutTitle}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {t.aboutSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Bio & Highlights (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black font-mono shadow-lg">
                  OR
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {getLocalized(homepage.brandName) || 'عمر الرفاس'}
                  </h3>
                  <span className="text-xs text-cyan-400 font-semibold">
                    {getLocalized(homepage.brandTagline) || 'مهندس برمجيات ومطور حلول رقمية'}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line mb-6">
                {bio}
              </p>

              {/* Verified Pillars */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>برمجيات متوافقة مع أحدث معايير الأمان وتشفير البيانات</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>تطبيقات أندرويد أصلية مع حزم تثبيت APK جاهزة وموثقة</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>تكامل كامل مع Google Drive API للمزامنة والتخزين السحابي</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>دعم كامل للغات الثلاث: العربية (RTL)، التركية، والإنجليزية</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white font-mono">8+</div>
                  <div className="text-xs text-slate-400">{t.experienceYears}</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white font-mono">40+</div>
                  <div className="text-xs text-slate-400">{t.completedProjectsCount}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Skills Breakdown (7 cols) */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <span>{t.skillsTitle}</span>
              </h3>
              <span className="text-xs text-slate-400">Proficiency Breakdown</span>
            </div>

            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-200">{skill.name}</span>
                    <span className="text-cyan-400 font-mono">{skill.level}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${skill.level}%`,
                        background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">المجالات:</span>
              {['Frontend', 'Backend', 'Mobile (Android)', 'Cloud & Drive API', 'DevOps', 'AI Systems'].map((area) => (
                <span
                  key={area}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
