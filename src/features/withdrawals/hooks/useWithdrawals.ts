import { useCallback, useEffect, useState } from 'react';
import { getWithdrawals, getWithdrawalsAggregates, type Withdrawal } from '../services/withdrawalService';

export const useWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [aggregates, setAggregates] = useState<{
    done: number;
    failed: number;
    cancelled: number;
    approved: number;
    pending: number;
    total: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWithdrawals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Carregando dados de saques...');

      // Carregar lista de saques
      const withdrawalsRes = await getWithdrawals();
      if (withdrawalsRes.success && withdrawalsRes.data) {
        setWithdrawals(withdrawalsRes.data.withdrawals || []);
        console.log('✅ Saques carregados:', withdrawalsRes.data.withdrawals?.length || 0, 'itens');
      } else {
        throw new Error(withdrawalsRes.error || 'Erro ao buscar saques.');
      }

      // Carregar dados agregados
      const aggregatesRes = await getWithdrawalsAggregates();
      if (aggregatesRes.success && aggregatesRes.data) {
        setAggregates(aggregatesRes.data.aggregates);
        console.log('✅ Dados agregados carregados:', aggregatesRes.data.aggregates);
      } else {
        console.warn('⚠️ Erro ao carregar dados agregados:', aggregatesRes.error);
      }

    } catch (err: any) {
      console.error('❌ Falha ao buscar saques:', err);
      setError(err.message || 'Ocorreu um erro ao carregar os saques.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  return {
    withdrawals,
    aggregates,
    isLoading,
    error,
    refetch: fetchWithdrawals,
  };
}; 