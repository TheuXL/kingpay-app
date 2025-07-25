import { useCallback, useEffect, useState } from 'react';
import { getWalletStatement } from '../services/walletService';
import { WalletExtract } from '../types'; // Corrigido para WalletExtract

export const useWalletStatement = () => {
    const [statement, setStatement] = useState<WalletExtract[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStatement = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getWalletStatement();
            if (response.success && response.data) {
                const statementData = (response.data as any).extrato;
                if (Array.isArray(statementData)) {
                    setStatement(statementData);
                } else {
                    setStatement([]);
                }
            } else {
                throw new Error(response.error || 'Erro ao carregar extrato');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStatement();
    }, [fetchStatement]);

    return {
        statement,
        isLoading,
        error,
        refetch: fetchStatement,
        // Mock de paginação por enquanto
        isLoadingMore: false,
        hasMore: false,
        loadMore: () => {},
    };
}; 