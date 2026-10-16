import React from 'react';
import { ContactInfo } from '../../types';
import { MessageSquare } from 'lucide-react';

interface WhatsAppFloatingButtonProps {
  contactInfo: ContactInfo;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({ contactInfo }) => {
  if (!contactInfo.showFloatingWhatsApp) return null;

  const primaryWa =
    contactInfo.whatsappNumbers?.find((w) => w.isPrimary && w.enabled) ||
    contactInfo.whatsappNumbers?.find((w) => w.enabled);

  if (!primaryWa) return null;

  const handleClick = () => {
    const cleanNumber = primaryWa.number.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(primaryWa.defaultMessage || 'مرحباً عمر، أود مناقشة مشروع برمجي جديد...');
    const a = document.createElement('a');
    a.href = `https://wa.me/${cleanNumber}?text=${message}`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed bottom-6 end-6 z-40">
      <button
        type="button"
        onClick={handleClick}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-all duration-300"
        title="Chat on WhatsApp"
        aria-label="Direct WhatsApp Chat"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageSquare className="w-5 h-5 fill-slate-950" />
        <span className="hidden sm:inline font-bold">تواصل عبر واتساب</span>
      </button>
    </div>
  );
};
