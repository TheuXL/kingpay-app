import { useState } from 'react';
import { useAuth } from '../../../contexts/AppContext';
import { authService } from '../services/authService';

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
  const { checkAuth, logout: contextLogout } = useAuth();

  const handleAuthAction = async (action: Promise<any>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await action;
      if (result.error) {
        setError(result.error.message);
        return false;
      }
      await checkAuth(); // Atualiza o estado de autenticação global
      return true;
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (params: any) => {
    return handleAuthAction(authService.login(params));
  };

  const signup = async (params: any) => {
    return handleAuthAction(authService.signup(params));
  };

  const logout = async () => {
    setLoading(true);
    await authService.logout();
    await contextLogout();
    setLoading(false);
  };

  return { loading, error, login, signup, logout };
}; 