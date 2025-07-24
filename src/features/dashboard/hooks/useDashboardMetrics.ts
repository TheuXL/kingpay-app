import { getAdditionalInfo, getDashboardData } from '@/features/dashboard/services/dashboardService';
import { useCallback, useEffect, useState } from 'react';

export const useDashboardMetrics = (initialStartDate: Date, initialEndDate: Date) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [additionalInfo, setAdditionalInfo] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        mainData,
        infoData,
      ] = await Promise.all([
        getDashboardData(startDate, endDate),
        getAdditionalInfo(startDate, endDate),
      ]);

      setDashboardData(mainData);
      setAdditionalInfo(infoData);

    } catch (err: any) {
      console.error("Erro detalhado no useDashboardMetrics:", err);
      setError(err.message || 'Ocorreu um erro ao buscar as métricas do dashboard.');
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setDateRange = (newStartDate: Date, newEndDate: Date) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return {
    dashboardData,
    additionalInfo,
    isLoading,
    error,
    refetch: fetchData,
    setDateRange,
    startDate,
    endDate
  };
}; 