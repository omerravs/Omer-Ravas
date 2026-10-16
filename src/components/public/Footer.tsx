import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../types';
import { Shield, ArrowUp, Globe, FileText } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  brandName?: string;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, brandName }) => {
  const { t, language, setLanguage } = useLanguage();
  const [modalContent, setModalContent] = useState<'privacy' | 'terms' | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-mono font-bold text-sm">
                OR
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                {brandName || 'OMERRAVAS PORTFOLIO'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              منصة إدارة ونشر المشاريع البرمجية المتكاملة: تطبيقات الويب، حزم أندرويد APK، برمجيات ويندوز، ونماذج الذكاء الاصطناعي مع حلول التخزين والمزامنة السحابية.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              روابط سريعة
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#home" className="hover:text-cyan-400 transition-colors">
                  {t.navHome}
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-cyan-400 transition-colors">
                  {t.navProjects}
                </a>
              </li>
              <li>
                <a href="#drive" className="hover:text-cyan-400 transition-colors">
                  {t.navDrive}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-cyan-400 transition-colors">
                  {t.navAbout}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-cyan-400 transition-colors">
                  {t.navContact}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              الخصوصية والإدارة
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => setModalContent('privacy')}
                  className="hover:text-cyan-400 transition-colors text-left rtl:text-right"
                >
                  {t.privacyPolicy}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setModalContent('terms')}
                  className="hover:text-cyan-400 transition-colors text-left rtl:text-right"
                >
                  {t.termsOfService}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors mt-2"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{t.navAdmin}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            {t.footerRights} • {t.footerBuiltWith}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <button
                type="button"
                onClick={() => setLanguage('ar')}
                className={`hover:text-white ${language === 'ar' ? 'text-cyan-400 font-bold' : ''}`}
              >
                العربية
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setLanguage('tr')}
                className={`hover:text-white ${language === 'tr' ? 'text-cyan-400 font-bold' : ''}`}
              >
                Türkçe
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`hover:text-white ${language === 'en' ? 'text-cyan-400 font-bold' : ''}`}
              >
                English
              </button>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              title="Back to top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy / Terms Dialog */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>{modalContent === 'privacy' ? t.privacyPolicy : t.termsOfService}</span>
              </h3>
              <button
                type="button"
                onClick={() => setModalContent(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="text-xs sm:text-sm text-slate-300 space-y-3 max-h-96 overflow-y-auto leading-relaxed">
              {modalContent === 'privacy' ? (
                <>
                  <p>
                    نحن في <strong>OMERRAVAS PORTFOLIO</strong> نلتزم بأعلى معايير حماية البيانات والخصوصية.
                  </p>
                  <p>
                    - لا نقوم بجمع أو مشاركة أي بيانات شخصية للمستخدمين الزائرين دون إذن مسبق.
                  </p>
                  <p>
                    - استخدام Google Drive API يتم بموجب إذن صريح من صاحب الحساب لغرض قراءة ومزامنة الملفات المرخص بها فقط، دون تخزين كلمات المرور أو تصديرها لأي طرف ثالث.
                  </p>
                  <p>
                    - ملفات تعريف الارتباط تستخدم حصراً لحفظ تفضيلات المظهر واللغة وجلسة المشرف المؤقتة.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    شروط الاستخدام لمنصة <strong>OMERRAVAS PORTFOLIO</strong>:
                  </p>
                  <p>
                    - كافة المشاريع وحزم APK المعروضة في المنصة هي ملك لمطورها أو مرخصة للاستخدام والتجربة وفق الشروط المصاحبة لكل مشروع.
                  </p>
                  <p>
                    - يحظر استخدام المنصة أو واجهات برمجة التطبيقات لأي أغراض تخالف القوانين أو تضر بالأنظمة السحابية.
                  </p>
                  <p>
                    - يحتفظ المشرف بحق تحديث أو تعديل شروط الخدمة لضمان أمان واستقرار المنصة.
                  </p>
                </>
              )}
            </div>
            <div className="pt-3 border-t border-slate-800 text-end">
              <button
                type="button"
                onClick={() => setModalContent(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
              >
                {t.closeModal}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
