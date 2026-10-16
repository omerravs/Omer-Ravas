import React, { useState } from 'react';
import { ContactInfo } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  Phone,
  MessageSquare,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Send,
  Github,
  Linkedin,
  Twitter,
  Disc as Discord,
} from 'lucide-react';

interface ContactSectionProps {
  contactInfo: ContactInfo;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ contactInfo }) => {
  const { t } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const handleCopyEmail = () => {
    if (contactInfo.email) {
      navigator.clipboard.writeText(contactInfo.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const handleCopyPhone = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedPhone(number);
    setTimeout(() => setCopiedPhone(null), 2500);
  };

  const openWhatsApp = (number: string, defaultMessage?: string) => {
    const cleanNumber = number.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(defaultMessage || t.whatsappQuickMsg);
    const a = document.createElement('a');
    a.href = `https://wa.me/${cleanNumber}?text=${text}`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <section id="contact" className="py-20 relative bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>{t.contactTitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {t.contactTitle}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {t.contactSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Phone Numbers Card */}
          <div className="p-7 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-6">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-5">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {t.phoneNumbersTitle}
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                الاتصال الهاتفي المباشر للاستفسارات والخدمات العاجلة.
              </p>

              <div className="space-y-3">
                {contactInfo.phoneNumbers
                  ?.filter((p) => p.enabled)
                  .map((phone) => (
                    <div
                      key={phone.id}
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-[11px] text-slate-400 font-medium">{phone.label}</div>
                        <a
                          href={`tel:${phone.number}`}
                          className="text-sm font-bold text-white hover:text-cyan-400 font-mono tracking-wide transition-colors"
                        >
                          {phone.number}
                        </a>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyPhone(phone.number)}
                        className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg transition-colors"
                        title="Copy phone number"
                      >
                        {copiedPhone === phone.number ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            <div className="text-xs text-slate-500">
              * متاح للمكالمات خلال أوقات العمل الرسمية.
            </div>
          </div>

          {/* WhatsApp Direct Chat Card */}
          <div className="p-7 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {t.whatsappChat}
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                محادثة فورية وسريعة لبدء مناقشة أي متطلبات أو استفسارات برمجية.
              </p>

              <div className="space-y-3">
                {contactInfo.whatsappNumbers
                  ?.filter((w) => w.enabled)
                  .map((wa) => (
                    <div
                      key={wa.id}
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-[11px] text-emerald-400 font-semibold">{wa.label}</div>
                        <div className="text-sm font-bold text-white font-mono">{wa.number}</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => openWhatsApp(wa.number, wa.defaultMessage)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>محادثة</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const primary = contactInfo.whatsappNumbers?.find((w) => w.isPrimary) || contactInfo.whatsappNumbers?.[0];
                if (primary) openWhatsApp(primary.number, primary.defaultMessage);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/30"
            >
              <MessageSquare className="w-4 h-4" />
              <span>محادثة عبر واتساب الآن</span>
            </button>
          </div>

          {/* Email & Social Links Card */}
          <div className="p-7 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-6">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {t.emailTitle}
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                للمراسلات الرسمية وتفاصيل عروض العمل والعقود البرمجية.
              </p>

              {/* Email Copier */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 mb-6">
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-xs sm:text-sm font-semibold text-white hover:text-cyan-400 font-mono truncate"
                >
                  {contactInfo.email || 'omerelravas@gmail.com'}
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg transition-colors flex-shrink-0"
                  title="Copy email"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Social Profiles */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                  {t.socialLinksTitle}
                </span>

                <div className="grid grid-cols-2 gap-2.5">
                  {contactInfo.telegramUrl && (
                    <a
                      href={contactInfo.telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-cyan-400 border border-slate-800 transition-colors"
                    >
                      <Send className="w-4 h-4 text-cyan-400" />
                      <span>Telegram</span>
                    </a>
                  )}

                  {contactInfo.githubUrl && (
                    <a
                      href={contactInfo.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 transition-colors"
                    >
                      <Github className="w-4 h-4 text-slate-300" />
                      <span>GitHub</span>
                    </a>
                  )}

                  {contactInfo.linkedinUrl && (
                    <a
                      href={contactInfo.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-blue-400 border border-slate-800 transition-colors"
                    >
                      <Linkedin className="w-4 h-4 text-blue-400" />
                      <span>LinkedIn</span>
                    </a>
                  )}

                  {contactInfo.discordUrl && (
                    <a
                      href={contactInfo.discordUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-purple-400 border border-slate-800 transition-colors"
                    >
                      <Discord className="w-4 h-4 text-purple-400" />
                      <span>Discord</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500">
              الرد على الرسائل يتم عادةً خلال أقل من ساعتين.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
