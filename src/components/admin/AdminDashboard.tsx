import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { DashboardOverview } from './DashboardOverview';
import { ProjectManager } from './ProjectManager';
import { HomepageEditor } from './HomepageEditor';
import { AppearanceEditor } from './AppearanceEditor';
import { DriveAccountsManager } from './DriveAccountsManager';
import { BackupManager } from './BackupManager';
import { AdsManager } from './AdsManager';
import { ContactsSettingsManager } from './ContactsSettingsManager';
import { SecurityLogsManager } from './SecurityLogsManager';
import {
  Shield,
  Layers,
  Sliders,
  Palette,
  Cloud,
  HardDrive,
  Megaphone,
  Mail,
  Lock,
  LogOut,
  ArrowRight,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';

import { ContactInfo } from '../../types';

interface AdminDashboardProps {
  onClose: () => void;
  onOpenNewProject: () => void;
  onRefreshData?: () => void;
  onContactUpdated?: (contact: ContactInfo) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  onOpenNewProject,
  onRefreshData,
  onContactUpdated,
}) => {
  const { logout } = useAuth();
  const { t, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: t.tabOverview, icon: Shield },
    { id: 'projects', label: t.tabProjects, icon: Layers },
    { id: 'homepage', label: t.tabHomepage, icon: Sliders },
    { id: 'appearance', label: t.tabAppearance, icon: Palette },
    { id: 'drive', label: t.tabDrive, icon: Cloud },
    { id: 'backups', label: t.tabBackups, icon: HardDrive },
    { id: 'ads', label: t.tabAds, icon: Megaphone },
    { id: 'contacts', label: t.tabContacts, icon: Mail },
    { id: 'security', label: t.tabSecurity, icon: Lock },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <DashboardOverview
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenNewProject={onOpenNewProject}
            onViewPublic={onClose}
          />
        );
      case 'projects':
        return <ProjectManager />;
      case 'homepage':
        return <HomepageEditor />;
      case 'appearance':
        return <AppearanceEditor />;
      case 'drive':
        return <DriveAccountsManager />;
      case 'backups':
        return <BackupManager />;
      case 'ads':
        return <AdsManager />;
      case 'contacts':
        return (
          <ContactsSettingsManager
            onUpdated={(contact) => {
              if (onContactUpdated) onContactUpdated(contact);
              if (onRefreshData) onRefreshData();
            }}
          />
        );
      case 'security':
        return <SecurityLogsManager />;
      default:
        return (
          <DashboardOverview
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenNewProject={onOpenNewProject}
            onViewPublic={onClose}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 text-slate-950 font-bold flex items-center justify-center font-mono text-sm">
            OR
          </div>
          <span className="font-extrabold text-sm text-white">لوحة الإدارة</span>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 bg-slate-800 rounded-lg"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 ${
          dir === 'rtl' ? 'right-0' : 'left-0'
        } z-40 w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : dir === 'rtl' ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Brand */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-mono font-bold flex items-center justify-center shadow-lg shadow-cyan-500/20">
                OR
              </div>
              <div>
                <span className="font-black text-white tracking-tight block text-sm">OMERRAVAS</span>
                <span className="text-[10px] text-cyan-400 font-semibold tracking-wider">ADMIN PANEL</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/80"
              title="العودة للموقع"
            >
              {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/40">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.btnLogout}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto bg-slate-950">
        <div className="max-w-6xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
};
