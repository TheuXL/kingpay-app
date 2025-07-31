import { authService } from '@/features/authentication/services/authService';
import { edgeFunctionsProxy } from '@/services/api/EdgeFunctionsProxy';
import { logger } from '@/utils/logger';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface AppContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!(user && accessToken);

  const handleAuthChange = async (event: AuthChangeEvent, session: Session | null) => {
    logger.auth(`Mudança de estado de autenticação detectada`, { event });
    
    const sessionUser = session?.user ?? null;
    const sessionToken = session?.access_token ?? null;

    // Otimização: Evitar atualizações de estado se os dados não mudaram.
    if (user?.id === sessionUser?.id && accessToken === sessionToken) {
      if (isLoading) setIsLoading(false);
      return;
    }

    setUser(sessionUser);
    setAccessToken(sessionToken);
    
    if (sessionUser && sessionToken) {
        logger.system(`Login detectado via listener`, { email: sessionUser.email, userId: sessionUser.id });
        edgeFunctionsProxy.setAccessTokenGetter(() => Promise.resolve(sessionToken));
        edgeFunctionsProxy.setUserIdGetter(() => sessionUser.id);
    } else if (event === 'SIGNED_OUT') {
        logger.auth('Logout detectado via listener');
        edgeFunctionsProxy.setAccessTokenGetter(() => Promise.resolve(null));
        edgeFunctionsProxy.setUserIdGetter(() => null);
    }
    
    if (isLoading) {
        setIsLoading(false);
    }
  };

  const checkAuth = async () => {
    setIsLoading(true);
    logger.auth('Iniciando verificação de autenticação');
    try {
        const session = await authService.getSession();
        await handleAuthChange('INITIAL_SESSION', session);
    } catch (error) {
        const e = error instanceof Error ? error : new Error(String(error));
        logger.error('Erro durante a verificação inicial de autenticação.', e);
        await handleAuthChange('SIGNED_OUT', null);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const authListener = authService.onAuthStateChange(handleAuthChange);
    const subscription = authListener?.data?.subscription;

    return () => {
      if (subscription) {
        logger.system('Removendo listener de autenticação');
        subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    logger.auth('Iniciando processo de login', { email });
    const { data, error } = await authService.signIn(email, password);
    if (error || !data.session) {
        logger.error('Falha no login', error);
        // Garante que o estado seja limpo em caso de falha
        await handleAuthChange('SIGNED_OUT', null);
        throw error || new Error('Sessão não encontrada após o login.');
    }
    
    // O listener onAuthStateChange irá lidar com a atualização de estado,
    // mas podemos chamar manualmente para uma atualização mais rápida da UI.
    await handleAuthChange('SIGNED_IN', data.session);
  };

  const logout = async () => {
    const currentUserId = user?.id ?? null;
    logger.auth('Iniciando logout', { userId: currentUserId });
    await authService.signOut();
  };

  useEffect(() => {
    logger.auth('Estado de autenticação alterado', {
      isAuthenticated,
      hasUser: !!user,
      hasToken: !!accessToken,
      isLoading,
      userId: user?.id
    });
  }, [isAuthenticated, user, accessToken, isLoading]);

  return (
    <AppContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de um AppProvider');
  }
  return context;
}; 