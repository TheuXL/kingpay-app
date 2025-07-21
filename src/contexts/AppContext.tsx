import { User } from '@supabase/supabase-js';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../features/authentication/services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean; // Adicionando a propriedade que faltava
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    setIsLoading(true);
    const response = await authService.getCurrentUser();
    if (response.success) {
      setUser(response.session?.user ?? null);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 