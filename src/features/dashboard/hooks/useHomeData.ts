import { useUserData } from '@/contexts/UserDataContext';
import { getAdditionalInfo, getChartData, getDashboardData, getFaturamentoWhitelabel, getFinancialSummary, getTopProducts, getTopSellers } from '@/features/dashboard/services';
import { logger } from '@/utils/logger';
import { useCallback, useEffect, useState } from 'react';

export const useHomeData = () => {
  const { company, loading: isUserLoading } = useUserData();

  const [dateRange, setDateRange] = useState(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30); // Padrão de 30 dias para mais dados
    return { startDate, endDate };
  });

  const [data, setData] = useState<{
    financialSummary: any;
    dashboardData: any;
    chartData: any[];
    additionalInfo: any;
    topSellers: any[];
    topProducts: any[];
    whitelabelBilling: any;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (isUserLoading) {
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

      logger.dashboard('Iniciando carregamento de dados da Home', {
        startDate: startDateString,
        endDate: endDateString,
        companyId: company?.id
      });

      // Executar todas as chamadas em paralelo
      const results = await Promise.allSettled([
        getFinancialSummary(startDateString, endDateString),
        getDashboardData(startDateString, endDateString),
        getChartData(startDateString, endDateString),
        getAdditionalInfo(startDateString, endDateString),
        getTopSellers(startDateString, endDateString),
        getTopProducts(startDateString, endDateString),
        getFaturamentoWhitelabel(startDateString, endDateString),
      ]);

      // Extrair dados ou null para cada resultado
      const financialSummary = results[0].status === 'fulfilled' ? (results[0] as PromiseFulfilledResult<any>).value : null;
      const dashboardData = results[1].status === 'fulfilled' ? (results[1] as PromiseFulfilledResult<any>).value : null;
      const chartData = results[2].status === 'fulfilled' ? (results[2] as PromiseFulfilledResult<any>).value?.data || [] : [];
      const additionalInfo = results[3].status === 'fulfilled' ? (results[3] as PromiseFulfilledResult<any>).value : null;
      const topSellers = results[4].status === 'fulfilled' ? (results[4] as PromiseFulfilledResult<any>).value?.data || [] : [];
      const topProducts = results[5].status === 'fulfilled' ? (results[5] as PromiseFulfilledResult<any>).value?.data || [] : [];
      const whitelabelBilling = results[6].status === 'fulfilled' ? (results[6] as PromiseFulfilledResult<any>).value : null;

      setData({ 
        financialSummary, 
        dashboardData, 
        chartData, 
        additionalInfo, 
        topSellers, 
        topProducts, 
        whitelabelBilling 
      });

      logger.success('Dados da Home carregados com sucesso', {
        financialSummary: !!financialSummary,
        dashboardData: !!dashboardData,
        chartData: chartData?.length || 0,
        additionalInfo: !!additionalInfo,
        topSellers: topSellers?.length || 0,
        topProducts: topProducts?.length || 0,
        whitelabelBilling: !!whitelabelBilling
      });

      // Log erros individuais mas não falhe completamente
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const endpointNames = ['financialSummary', 'dashboardData', 'chartData', 'additionalInfo', 'topSellers', 'topProducts', 'whitelabelBilling'];
          logger.warn(`Erro ao carregar ${endpointNames[index]}`, result.reason);
        }
      });

    } catch (e: any) {
      logger.error('Falha ao carregar dados da Home', e);
      setError(e.message || 'Ocorreu um erro ao buscar os dados.');
    } finally {
      setIsLoading(false);
    }
  }, [company?.id, isUserLoading, dateRange.startDate, dateRange.endDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  
  const overallLoading = isUserLoading || isLoading;

  return { data, isLoading: overallLoading, error, setDateRange, refetch: loadData };
}; 