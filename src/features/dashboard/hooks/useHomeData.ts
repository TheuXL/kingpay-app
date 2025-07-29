import { useUserData } from '@/contexts/UserDataContext';
import { getChartData, getDashboardData, getFinancialSummary } from '@/features/dashboard/services';
import { logger } from '@/utils/logger';
import { useCallback, useEffect, useState } from 'react';

export const useHomeData = () => {
  const { companyId, isLoading: isUserLoading } = useUserData();

  const [dateRange, setDateRange] = useState(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7); // Padrão de 7 dias
    return { startDate, endDate };
  });

  const [data, setData] = useState<{
    financialSummary: any;
    dashboardData: any;
    chartData: any[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!companyId || isUserLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const startDateString = dateRange.startDate.toISOString().split('T')[0];
      const endDateString = dateRange.endDate.toISOString().split('T')[0];

      if (!startDateString || !endDateString) {
        throw new Error('Datas de início ou fim inválidas para a consulta.');
      }

      const results = await Promise.allSettled([
        getFinancialSummary(),
        getDashboardData(companyId, startDateString, endDateString),
        getChartData(companyId, startDateString, endDateString),
      ]);

      const financialSummary = results[0].status === 'fulfilled' ? (results[0] as PromiseFulfilledResult<any>).value : null;
      const dashboardData = results[1].status === 'fulfilled' ? (results[1] as PromiseFulfilledResult<any>).value : null;
      const chartData = results[2].status === 'fulfilled' ? (results[2] as PromiseFulfilledResult<any[]>).value : [];

      setData({ financialSummary, dashboardData, chartData });

      const firstError = results.find((r) => r.status === 'rejected') as PromiseRejectedResult | undefined;
      if (firstError) {
        throw firstError.reason;
      }
    } catch (e: any) {
      logger.error('Falha ao carregar dados da Home:', e);
      setError(e.message || 'Ocorreu um erro ao buscar os dados.');
    } finally {
      setIsLoading(false);
    }
  }, [companyId, isUserLoading, dateRange.startDate, dateRange.endDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  
  const overallLoading = isUserLoading || isLoading;

  return { data, isLoading: overallLoading, error, setDateRange, refetch: loadData };
}; 