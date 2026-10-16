import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Language } from '../../types';
import {
  Globe,
  Sun,
  Moon,
  Shield,
  Menu,
  X,
  Layers,
  Cloud,
  Mail,
  User,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  brandName?: string;
  logoUrl?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, brandName, logoUrl }) => {
  const { language, setLanguage, t, dir } = useLanguage();
  const { theme, toggleTheme, appearance } = useTheme();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'ar', name: 'العربية (RTL)', flag: '🇸🇦' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  const navLinks = [
    { href: '#home', label: t.navHome, icon: Sparkles },
    { href: '#projects', label: t.navProjects, icon: Layers },
    { href: '#drive', label: t.navDrive, icon: Cloud },
    { href: '#about', label: t.navAbout, icon: User },
    { href: '#contact', label: t.navContact, icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 dark:bg-slate-950/85 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-cyan-500/20" />
            ) : (
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-lg transition-transform group-hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${appearance.primaryColor || '#06b6d4'}, ${appearance.accentColor || '#3b82f6'})`,
                }}
              >
                <span className="text-xl tracking-wider font-extrabold font-mono">OR</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                {brandName || 'OMERRAVAS'}
              </span>
              <span className="text-xs text-slate-400 font-medium tracking-wide">
                PORTFOLIO & LABS
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Controls: Language, Theme, Admin */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-300 bg-slate-900 border border-slate-700/80 rounded-lg hover:border-slate-500 transition-colors"
                aria-label="Change language"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="uppercase font-semibold">{language}</span>
              </button>

              {langMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)} />
                  <div
                    className={`absolute top-full mt-2 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 ${
                      dir === 'rtl' ? 'left-0' : 'right-0'
                    }`}
                  >
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          setLanguage(l.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs sm:text-sm text-left transition-colors ${
                          language === l.code
                            ? 'bg-cyan-500/15 text-cyan-400 font-bold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{l.flag}</span>
                          <span>{l.name}</span>
                        </span>
                        {language === l.code && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-slate-300 bg-slate-900 border border-slate-700/80 rounded-lg hover:text-amber-300 hover:border-slate-500 transition-colors"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Admin Dashboard Entry Button */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white bg-slate-800/90 hover:bg-cyan-600/90 border border-slate-700 hover:border-cyan-500 rounded-lg shadow-sm transition-all"
              title={t.navAdmin}
            >
              <Shield className={`w-4 h-4 ${isAuthenticated ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{isAuthenticated ? t.tabOverview : t.navAdmin}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 bg-slate-900 border border-slate-700 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800/80 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-200 hover:text-cyan-400 hover:bg-slate-900 rounded-lg"
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  {link.label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
