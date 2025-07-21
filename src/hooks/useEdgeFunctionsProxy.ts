import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AppContext';
import { ApiResponse, EdgeFunctionsProxy } from '../services/api/EdgeFunctionsProxy';

interface UseEdgeFunctionsProxyOptions<T> {
    autoExecute?: boolean;
    dependencies?: any[];
    onError?: (error: string) => void;
    onSuccess?: (data: T) => void;
}

export const useEdgeFunctionsProxy = <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
    body?: any,
    options: UseEdgeFunctionsProxyOptions<T> = {}
) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(options.autoExecute || false);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();
    const [proxy] = useState(() => new EdgeFunctionsProxy());

    const execute = useCallback(async (runtimeBody?: any, params?: Record<string, string>) => {
        if (!isAuthenticated) {
            const authError = 'Usuário não autenticado.';
            setError(authError);
            options.onError?.(authError);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const requestBody = runtimeBody ?? body;
            const response: ApiResponse<T> = await proxy.request(endpoint, method, requestBody, params);

            if (response.success) {
                setData(response.data || null);
                options.onSuccess?.(response.data as T);
            } else {
                setError(response.error || 'Erro na requisição');
                options.onError?.(response.error || 'Erro na requisição');
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Erro desconhecido';
            setError(errorMessage);
            options.onError?.(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [endpoint, method, body, isAuthenticated, options.onSuccess, options.onError, proxy]);

    useEffect(() => {
        if (options.autoExecute) {
            execute();
        }
    }, [execute, options.autoExecute, ...(options.dependencies || [])]);

    return { data, loading, error, execute };
}; 