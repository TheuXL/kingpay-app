import { useAppContext } from "@/contexts/AppContext";
import { authService } from "@/features/auth/services/authService";
import { logger } from "@/lib/logger/logger";
import { useState } from "react";

/**
 * Hook customizado para gerenciar o fluxo de autenticação.
 */
export const useAuthentication = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login, logout } = useAppContext();

    /**
     * Realiza o login do usuário.
     */
    const handleLogin = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            await login(email, password);
            logger.success('AUTH', 'Login bem-sucedido no useAuthentication');
            setIsLoading(false);
            return true;
        } catch (e: any) {
            const errorMessage = e.message || 'Erro desconhecido durante o login';
            logger.error('AUTH', `Falha no handleLogin: ${errorMessage}`, e);
            setError(errorMessage);
            setIsLoading(false);
            return false;
        }
    };

    /**
     * Registra um novo usuário.
     */
    const handleSignup = async (email: string, password: string, fullName?: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const { error: signupError } = await authService.signUp({ email, password, fullName });
            if (signupError) {
                throw signupError;
            }
            logger.success('AUTH', 'Registro bem-sucedido no useAuthentication');
            setIsLoading(false);
            return true;
        } catch (e: any) {
            const errorMessage = e.message || 'Erro desconhecido durante o registro';
            logger.error('AUTH', `Falha no handleSignup: ${errorMessage}`, e);
            setError(errorMessage);
            setIsLoading(false);
            return false;
        }
    };

    /**
     * Realiza o logout do usuário.
     */
    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await logout();
            logger.success('AUTH', 'Logout bem-sucedido no useAuthentication');
        } catch (e: any) {
            logger.error('AUTH', `Falha no handleLogout: ${e.message}`, e);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
    };
}; 