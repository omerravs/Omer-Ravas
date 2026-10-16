import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/public/Navbar';
import { HeroSection } from './components/public/HeroSection';
import { ProjectGallery } from './components/public/ProjectGallery';
import { ProjectDetailsModal } from './components/public/ProjectDetailsModal';
import { DrivePublicShowcase } from './components/public/DrivePublicShowcase';
import { AboutSection } from './components/public/AboutSection';
import { ContactSection } from './components/public/ContactSection';
import { AdBanner } from './components/public/AdBanner';
import { WhatsAppFloatingButton } from './components/public/WhatsAppFloatingButton';
import { Footer } from './components/public/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProjectFormModal } from './components/admin/ProjectFormModal';
import { Project, HomepageSettings, ContactInfo, Advertisement, AdSenseConfig } from './types';
import { api } from './services/api';

function MainApp() {
  const { appearance } = useTheme();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [homepage, setHomepage] = useState<HomepageSettings | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [adsense, setAdsense] = useState<AdSenseConfig | null>(null);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [isAdminView, setIsAdminView] = useState(true);

  const refreshAllData = async () => {
    try {
      const [projData, homeData, contactData, adsData, adsenseData] = await Promise.all([
        api.getProjects(),
        api.getHomepageSettings(),
        api.getContactInfo(),
        api.getAds(),
        api.getAdSenseConfig(),
      ]);
      setProjects(projData);
      setHomepage(homeData);
      setContactInfo(contactData);
      setAds(adsData);
      setAdsense(adsenseData);
    } catch (err) {
      console.error('Failed to refresh data', err);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setIsAdminView(true);
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // If user is authenticated and in admin view, show Admin Dashboard
  if (isAuthenticated && isAdminView) {
    return (
      <AdminDashboard
        onClose={() => {
          refreshAllData();
          setIsAdminView(false);
        }}
        onOpenNewProject={() => setShowNewProjectModal(true)}
        onRefreshData={refreshAllData}
        onContactUpdated={(updated) => setContactInfo(updated)}
      />
    );
  }

  // If Admin Login prompt is requested
  if (showAdminLogin) {
    return <AdminLogin onCancel={() => setShowAdminLogin(false)} />;
  }

  return (
    <div
      className="min-h-screen text-slate-100 relative selection:bg-cyan-500/30 selection:text-cyan-200"
      style={{
        backgroundColor: appearance.themeMode === 'light' ? '#f8fafc' : '#030712',
        backgroundImage: appearance.customBackgroundUrl ? `url(${appearance.customBackgroundUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background Overlay */}
      {appearance.customBackgroundUrl && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: appearance.themeMode === 'light' ? '#ffffff' : '#030712',
            opacity: (appearance.backgroundOverlayOpacity || 85) / 100,
          }}
        />
      )}

      {/* Admin Mode Floating Header Bar */}
      {isAuthenticated && !isAdminView && (
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 text-white px-4 py-2 text-xs flex items-center justify-between shadow-xl sticky top-0 z-50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
            <span className="font-extrabold tracking-wide">
              معاينة الموقع العام كمسؤول (التعديلات وأرقام الهواتف محفوظة وتظهر مباشرة للزوار)
            </span>
          </div>
          <button
            onClick={() => {
              refreshAllData();
              setIsAdminView(true);
            }}
            className="px-3.5 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-950 text-cyan-300 font-bold transition-all shadow-sm"
          >
            العودة إلى لوحة الإدارة ←
          </button>
        </div>
      )}

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <Navbar
          onOpenAdmin={() => {
            if (isAuthenticated) {
              setIsAdminView(true);
            } else {
              setShowAdminLogin(true);
            }
          }}
          brandName={homepage?.brandName?.ar || 'OMERRAVAS'}
          logoUrl={homepage?.logoUrl}
        />

        <main className="flex-1">
          {/* Hero Banner Ad */}
          <AdBanner ads={ads} adsense={adsense || undefined} placement="hero_banner" />

          {/* Hero Section */}
          {homepage && homepage.sectionVisibility?.hero !== false && (
            <HeroSection homepage={homepage} projectsCount={projects.length} />
          )}

          {/* Ad Banner between Hero and Projects */}
          <AdBanner ads={ads} adsense={adsense || undefined} placement="between_sections" />

          {/* Projects Gallery */}
          {homepage && homepage.sectionVisibility?.allProjects !== false && (
            <ProjectGallery
              projects={projects}
              onOpenDetails={(p) => setSelectedProject(p)}
            />
          )}

          {/* Google Drive Public Showcase */}
          {homepage && homepage.sectionVisibility?.driveShowcase !== false && (
            <DrivePublicShowcase />
          )}

          {/* About Section */}
          {homepage && homepage.sectionVisibility?.about !== false && homepage && (
            <AboutSection homepage={homepage} />
          )}

          {/* Contact Section */}
          {contactInfo && homepage && homepage.sectionVisibility?.contact !== false && (
            <ContactSection contactInfo={contactInfo} />
          )}
        </main>

        {/* Floating WhatsApp Chat */}
        {contactInfo && <WhatsAppFloatingButton contactInfo={contactInfo} />}

        {/* Footer */}
        <Footer
          onOpenAdmin={() => setShowAdminLogin(true)}
          brandName={homepage?.brandName?.ar || 'OMERRAVAS PORTFOLIO'}
        />

        {/* Project Details Modal */}
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />

        {/* New Project Modal triggered from quick action */}
        {showNewProjectModal && (
          <ProjectFormModal
            isOpen={showNewProjectModal}
            project={null}
            onClose={() => setShowNewProjectModal(false)}
            onSaved={(saved) => {
              setProjects((prev) => [saved, ...prev]);
              setShowNewProjectModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
