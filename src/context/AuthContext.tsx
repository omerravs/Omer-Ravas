import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  login: (password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('omerr_admin_token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('omerr_admin_token');
      if (!storedToken) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/verify', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        if (res.ok) {
          setIsAuthenticated(true);
          setToken(storedToken);
        } else {
          setIsAuthenticated(false);
          setToken(null);
          localStorage.removeItem('omerr_admin_token');
        }
      } catch (err) {
        console.error('Auth verification error', err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem('omerr_admin_token', data.token);
        return { success: true };
      } else {
        return { success: false, message: data.error || 'Invalid password' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Server connection error' };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // ignore
    } finally {
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('omerr_admin_token');
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true };
      }
      return { success: false, message: data.error || 'Failed to update password' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error' };
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, isLoading, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
