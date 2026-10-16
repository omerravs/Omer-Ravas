import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppearanceSettings } from '../types';

interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  appearance: AppearanceSettings;
  setAppearance: (appearance: AppearanceSettings) => void;
  updateAppearanceOnServer: (appearance: AppearanceSettings) => Promise<void>;
}

const defaultAppearance: AppearanceSettings = {
  themeMode: 'dark',
  primaryColor: '#06b6d4', // cyan-500
  accentColor: '#3b82f6', // blue-500
  fontFamily: 'cairo_sans',
  borderRadius: 'rounded',
  customBackgroundUrl: '',
  backgroundOverlayOpacity: 85,
  cardStyle: 'glass',
  heroAnimationEnabled: true,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('omerr_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  const [appearance, setAppearance] = useState<AppearanceSettings>(defaultAppearance);

  useEffect(() => {
    // Fetch appearance from server on start
    fetch('/api/settings/appearance')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setAppearance(data);
          if (data.themeMode === 'light' || data.themeMode === 'dark') {
            setTheme(data.themeMode);
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('omerr_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const updateAppearanceOnServer = async (newAppearance: AppearanceSettings) => {
    setAppearance(newAppearance);
    if (newAppearance.themeMode === 'light' || newAppearance.themeMode === 'dark') {
      setTheme(newAppearance.themeMode);
    }
    try {
      const token = localStorage.getItem('omerr_admin_token');
      await fetch('/api/settings/appearance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAppearance),
      });
    } catch (err) {
      console.error('Failed to save appearance to server', err);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        appearance,
        setAppearance,
        updateAppearanceOnServer,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
