import { User } from '@supabase/supabase-js';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../features/auth/services/authService';
import { setAccessTokenGetter } from '../services/api/EdgeFunctionsProxy';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  accessToken: string | null;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      console.log('🔍 Verificando autenticação...');
      const result = await authService.getUser();
      
      if (!result.success || !result.data) {
        console.log('❌ Usuário não autenticado');
        setUser(null);
        setAccessToken(null);
      } else {
        console.log('✅ Usuário autenticado:', result.data.email);
        setUser(result.data);
      }
    } catch (e) {
      console.error('❌ Erro ao verificar autenticação:', e);
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Fazendo logout...');
      const { error } = await authService.signOut();
      if (error) {
        console.error('❌ Erro no logout Supabase:', error);
      }
      
      setUser(null);
      setAccessToken(null);
      console.log('✅ Logout realizado com sucesso');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      setUser(null);
      setAccessToken(null);
    }
  };

  // Configurar o getter do access_token para o EdgeFunctionsProxy
  useEffect(() => {
    setAccessTokenGetter(() => accessToken);
  }, [accessToken]);
  
  useEffect(() => {
    console.log('🎯 AuthProvider inicializado - verificando sessão');
    checkAuth();
  }, []);

  const isAuthenticated = !!user && !!accessToken;

  console.log('📱 Estado de autenticação:', {
    isAuthenticated,
    hasUser: !!user,
    hasToken: !!accessToken,
    isLoading
  });

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      isLoading, 
      accessToken,
      checkAuth, 
      logout,
      setAccessToken
    }}>
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