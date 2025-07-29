import { useCallback, useEffect, useState } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import * as walletService from '../services/walletService';

// Adicionar tipos para os dados da carteira
interface FinancialData {
    total_balances: {
        total_balance: number;
        total_balance_card: number;
        total_financial_reserve: number;
    };
    pending_withdrawals: {
        total_pending_withdrawals: number;
    };
    // Adicione outros campos que vierem da API
}

interface Statement {
    id: string;
    created_at: string;
    tipo: string;
    value: number;
    entrada: boolean;
}

export const useWalletData = () => {
    const { user } = useAppContext();
    const [financialData, setFinancialData] = useState<FinancialData | null>(null);
    const [statement, setStatement] = useState<Statement[]>([]);
    const [anticipations, setAnticipations] = useState<any[]>([]);
    const [withdrawals, setWithdrawals] = useState<any[]>([]);
    const [pixKeys, setPixKeys] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);

            const [
                financial,
                statementData,
                anticipationsData,
                withdrawalsData,
                pixKeysData
            ] = await Promise.all([
                walletService.getFinancialData(),
                walletService.getWalletStatement(user.id),
                walletService.getAnticipations(),
                walletService.getWithdrawals(),
                walletService.getPixKeys(),
            ]);

            // O retorno da API para financialData pode estar aninhado
            if (financial) {
                 setFinancialData(financial);
            }

            // O retorno do extrato pode vir dentro de um objeto { "extrato": [...] }
            if (statementData && statementData.extrato) {
                setStatement(statementData.extrato);
            } else if (Array.isArray(statementData)) {
                setStatement(statementData);
            }

            if (anticipationsData && anticipationsData.data) {
                setAnticipations(anticipationsData.data);
            }
            
            if (withdrawalsData && withdrawalsData.withdrawals) {
                setWithdrawals(withdrawalsData.withdrawals);
            }
            
            if (pixKeysData && pixKeysData.data) {
                setPixKeys(pixKeysData.data);
            }

        } catch (err: any) {
            console.error("Erro ao buscar dados da carteira:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        financialSummary: financialData,
        walletStatement: statement,
        anticipations,
        withdrawals,
        pixKeys,
        isLoading: loading,
        error,
        refetch: fetchData
    };
}; 