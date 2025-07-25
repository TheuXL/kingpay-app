import { authService } from '@/features/auth/services/authService';
import { getAdditionalInfo, getChartData, getDashboardData } from '@/features/dashboard/services/dashboardService';
import { formatDateForApi } from '@/utils/formatters';
import { useCallback, useEffect, useState } from 'react';

export const useHomeData = () => {
  const [user, setUser] = useState<any>(null);
  const [financialSummary, setFinancialSummary] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [additionalInfo, setAdditionalInfo] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    console.log('🔄 Iniciando fetchData...');
    setIsLoading(true);
    setError(null);
    
    try {
      const today = new Date();
      const thirtyDaysAgo = new Date(new Date().setDate(today.getDate() - 30));
      const sixMonthsAgo = new Date(new Date().setMonth(today.getMonth() - 6));
      
      const formattedToday = formatDateForApi(today);
      const formattedThirtyDaysAgo = formatDateForApi(thirtyDaysAgo);
      const formattedSixMonthsAgo = formatDateForApi(sixMonthsAgo);

      console.log('📅 Períodos configurados:', {
        startDate: formattedThirtyDaysAgo,
        endDate: formattedToday,
        chartStartDate: formattedSixMonthsAgo
      });

      // Carregar dados em paralelo
      const [userData, dashboardRes, chartRes, additionalRes] = await Promise.all([
        authService.getUser(),
        getDashboardData(formattedThirtyDaysAgo, formattedToday),
        getChartData(formattedSixMonthsAgo, formattedToday),
        getAdditionalInfo(formattedThirtyDaysAgo, formattedToday),
      ]);

      console.log('📊 Respostas recebidas:', {
        userData: userData.success,
        dashboardRes: dashboardRes.success,
        chartRes: chartRes.success,
        additionalRes: additionalRes.success
      });

      // Processar dados do usuário
      if (userData.success && userData.data) {
        setUser(userData.data);
        console.log('✅ Dados do usuário carregados');
      } else {
        console.warn('⚠️ Erro ao carregar dados do usuário:', userData.error);
        setUser(null);
      }

      // Processar dados do dashboard
      if (dashboardRes.success && dashboardRes.data) {
        setFinancialSummary(dashboardRes.data);
        console.log('✅ Dados do dashboard carregados:', dashboardRes.data);
      } else {
        console.warn('⚠️ Erro ao carregar dados do dashboard:', dashboardRes.error);
        setFinancialSummary(null);
      }

      // Processar dados do gráfico
      if (chartRes.success && chartRes.data) {
        setChartData(chartRes.data);
        console.log('✅ Dados do gráfico carregados:', chartRes.data.length, 'pontos');
      } else {
        console.warn('⚠️ Erro ao carregar dados do gráfico:', chartRes.error);
        setChartData([]);
      }

      // Processar informações adicionais
      if (additionalRes.success && additionalRes.data) {
        setAdditionalInfo(additionalRes.data);
        console.log('✅ Informações adicionais carregadas:', additionalRes.data);
      } else {
        console.warn('⚠️ Erro ao carregar informações adicionais:', additionalRes.error);
        setAdditionalInfo(null);
      }

    } catch (err: any) {
      console.error('❌ Erro detalhado no useHomeData:', err);
      setError('Não foi possível carregar todos os dados da Home.');
    } finally {
      console.log('🏁 Finalizando fetchData...');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('🎯 useEffect executado - chamando fetchData');
    fetchData();
  }, [fetchData]);

  console.log('📱 Estado atual:', {
    isLoading,
    hasUser: !!user,
    hasFinancialSummary: !!financialSummary,
    hasChartData: !!chartData,
    hasAdditionalInfo: !!additionalInfo,
    error
  });

  return {
    user,
    financialSummary,
    chartData,
    additionalInfo,
    isLoading,
    error,
    refetch: fetchData,
  };
}; 