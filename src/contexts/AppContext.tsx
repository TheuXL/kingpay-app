import { User } from '@supabase/supabase-js';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../features/authentication/services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    // Não precisa de setIsLoading(true) aqui, pois já é setado no estado inicial
    try {
        const { data, error } = await authService.getUser();
        
        if (error) {
            console.warn("Check auth error:", error.message);
            setUser(null);
        } else {
            setUser(data.user);
            if (data.user) {
                console.log('✅ Sessão ativa encontrada na inicialização:', { email: data.user.email, userId: data.user.id });
            }
        }
    } catch (e) {
        console.error("Erro fatal no checkAuth:", e);
        setUser(null);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    await authService.signOut(); // Corrigindo para a função signOut do serviço
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