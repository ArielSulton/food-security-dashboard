'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple authentication credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';
const AUTH_STORAGE_KEY = 'food-security-auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage using lazy initialization
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    const authStatus = localStorage.getItem(AUTH_STORAGE_KEY);
    return authStatus === 'authenticated';
  });

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STORAGE_KEY, 'authenticated');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
