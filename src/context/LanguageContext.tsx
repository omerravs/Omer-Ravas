import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../locales/translations';

type TranslationKey = keyof typeof translations.ar;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  dir: 'rtl' | 'ltr';
  getLocalized: (obj?: { ar?: string; tr?: string; en?: string } | null) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('omerr_lang') as Language;
    return saved === 'ar' || saved === 'tr' || saved === 'en' ? saved : 'ar';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('omerr_lang', lang);
  };

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    document.documentElement.className = `${language}-lang ${dir}-layout`;
    // Synchronize font family via CSS variable or direct style
    document.documentElement.style.fontFamily = language === 'ar' 
      ? "'Tajawal', sans-serif" 
      : "'Inter', sans-serif";
  }, [language]);

  const getLocalized = (obj?: { ar?: string; tr?: string; en?: string } | null): string => {
    if (!obj) return '';
    return obj[language] || obj.ar || obj.en || obj.tr || '';
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.ar[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir: language === 'ar' ? 'rtl' : 'ltr', getLocalized }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
