import { useState } from 'react';
import { useAuth } from '../../../contexts/AppContext';
import { edgeFunctionsProxy } from '../../../services/api/EdgeFunctionsProxy';
import { authService } from '../../auth/services/authService';

interface AuthHook {
  loading: boolean;
  error: string | null;
  login: (params: any) => Promise<boolean>;
  signup: (params: any) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthentication = (): AuthHook => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { checkAuth, logout: contextLogout, setAccessToken } = useAuth();

  const handleAuthAction = async (action: Promise<any>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await action;
      if (result.error) {
        setError(result.error.message);
        return false;
      }
      await checkAuth();
      return true;
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }: { email: string, password: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔐 Iniciando login...');
      
      // 1. Fazer login no Supabase
      const { error: signInError } = await authService.signIn(email, password);
      if (signInError) {
        console.error('❌ Erro no login Supabase:', signInError);
        setError(signInError.message);
        return false;
      }
      console.log('✅ Login Supabase realizado com sucesso');

      // 2. Obter access_token do endpoint correto
      const tokenResponse = await edgeFunctionsProxy.post('token?grant_type=password', {
        email,
        password
      });

      if (tokenResponse.success && tokenResponse.data?.access_token) {
        console.log('✅ Access token obtido com sucesso');
        setAccessToken(tokenResponse.data.access_token);
        
        await checkAuth();
        
        console.log('✅ Login completo realizado');
        return true;
      } else {
        console.error('❌ Erro ao obter access token:', tokenResponse.error);
        setError(tokenResponse.error || 'Erro ao obter token de acesso.');
        return false;
      }

    } catch (err: any) {
      console.error('❌ Erro inesperado no login:', err);
      setError(err.message || 'Ocorreu um erro inesperado.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ email, password, name }: { email: string, password: string, name?: string }) => {
    return handleAuthAction(authService.signUp({ email, password, fullName: name }));
  };

  const logout = async () => {
    setLoading(true);
    try {
      console.log('🚪 Iniciando logout...');
      await authService.signOut();
      setAccessToken(null);
      await contextLogout();
      console.log('✅ Logout realizado com sucesso');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, login, signup, logout };
}; 