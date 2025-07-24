import { getUser } from '@/features/auth/services/authService';
import {
    getAdditionalInfo,
    getChartData,
    getFinancialSummary,
    getTransactionSummary,
} from '@/features/dashboard/services/dashboardService';
import { useCallback, useEffect, useState } from 'react';

export const useHomeData = () => {
  const [user, setUser] = useState<any>(null);
  const [financialSummary, setFinancialSummary] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [salesSummary, setSalesSummary] = useState<any>(null);
  const [additionalInfo, setAdditionalInfo] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false); // Alterado para false
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const today = new Date();
      const thirtyDaysAgo = new Date(new Date().setDate(today.getDate() - 30));
      const sixMonthsAgo = new Date(new Date().setMonth(today.getMonth() - 6));

      const [userData, financialData, chartResponse, summaryData, additionalData] = await Promise.all([
        getUser(),
        getFinancialSummary(),
        getChartData(sixMonthsAgo, today),
        getTransactionSummary(thirtyDaysAgo, today),
        getAdditionalInfo(thirtyDaysAgo, today),
      ]);

      setUser(userData.user);
      setFinancialSummary(financialData);
      setChartData(chartResponse);
      setSalesSummary(summaryData);
      setAdditionalInfo(additionalData);
    } catch (err: any) {
      console.error('Erro detalhado no useHomeData:', err);
      setError(err.message || 'Ocorreu um erro ao buscar os dados da Home.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // fetchData(); // Temporariamente desativado para focar na UI
  }, [fetchData]);

  return {
    user,
    financialSummary,
    chartData,
    salesSummary,
    additionalInfo,
    isLoading,
    error,
    refetch: fetchData,
  };
}; 