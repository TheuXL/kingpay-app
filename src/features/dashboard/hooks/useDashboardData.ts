import { useCallback, useEffect, useState } from 'react';
import { getDashboardData } from '../services/dashboardService';

// Idealmente, isso viria de um arquivo de tipos compartilhado
export interface DashboardData {
    countTotal: number;
    countPaid: number;
    sumPaid: number;
    sumValorLiquido: number;
    valorLiquidoAdmin: number;
    countPending: number;
    sumPending: number;
    countRefused: number;
    sumRefused: number; // Usado para estornos/reembolsos
    countChargeback: number;
    sumChargeback: number; // Usado para cashback/chargeback
    taxaAprovacao: number;
    taxaChargeback: number;
    ticketMedio: number;
}

export const useDashboardData = (startDate: string, endDate: string) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getDashboardData(startDate, endDate);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Erro ao buscar dados do dashboard.');
      }
    } catch (err: any) {
      console.error('Falha ao buscar dados do dashboard:', err);
      setError(err.message || 'Ocorreu um erro ao carregar o dashboard.');
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (startDate && endDate) {
        fetchData();
    }
  }, [fetchData, startDate, endDate]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}; 