import { 
  getAdditionalInfo, 
  getChartData, 
  getDashboardData, 
  getTopProducts, 
  getTopSellers,
  getWhitelabelBilling,
  getWhitelabelFinancial,
  getProviders,
  getAcquirers
} from '@/features/dashboard/services/dashboardService';
import type {
  DashboardData,
  ChartDataPoint,
  AdditionalInfo,
  TopProduct,
  TopSeller,
  WhitelabelBilling,
  WhitelabelFinancial,
  Provider,
  Acquirer
} from '@/types/dashboard';
import { formatDateForApi } from '@/utils/formatters';
import { useCallback, useEffect, useState } from 'react';

export const useDashboardMetrics = (initialStartDate: Date, initialEndDate: Date) => {
  // ===== ESTADOS PRINCIPAIS =====
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topSellers, setTopSellers] = useState<TopSeller[]>([]);

  // ===== ESTADOS WHITELABEL =====
  const [whitelabelBilling, setWhitelabelBilling] = useState<WhitelabelBilling | null>(null);
  const [whitelabelFinancial, setWhitelabelFinancial] = useState<WhitelabelFinancial | null>(null);

  // ===== ESTADOS ADICIONAIS =====
  const [providers, setProviders] = useState<Provider[]>([]);
  const [acquirers, setAcquirers] = useState<Acquirer[]>([]);

  // ===== ESTADOS DE CONTROLE =====
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formattedStartDate = formatDateForApi(startDate);
      const formattedEndDate = formatDateForApi(endDate);

      console.log('🔄 Buscando dados do dashboard...');
      console.log(`📅 Período: ${formattedStartDate} até ${formattedEndDate}`);

      // ===== REQUISIÇÕES PRINCIPAIS =====
      const [
        mainRes,
        infoRes,
        chartRes,
        productsRes,
        sellersRes
      ] = await Promise.all([
        getDashboardData(formattedStartDate, formattedEndDate),
        getAdditionalInfo(formattedStartDate, formattedEndDate),
        getChartData(formattedStartDate, formattedEndDate),
        getTopProducts(formattedStartDate, formattedEndDate),
        getTopSellers(formattedStartDate, formattedEndDate)
      ]);

      // ===== REQUISIÇÕES WHITELABEL =====
      const [
        billingRes,
        financialRes
      ] = await Promise.all([
        getWhitelabelBilling(formattedStartDate, formattedEndDate),
        getWhitelabelFinancial(formattedStartDate, formattedEndDate)
      ]);

      // ===== REQUISIÇÕES ADICIONAIS =====
      const [
        providersRes,
        acquirersRes
      ] = await Promise.all([
        getProviders(formattedStartDate, formattedEndDate),
        getAcquirers(formattedStartDate, formattedEndDate)
      ]);

      // ===== VALIDAÇÃO E ATUALIZAÇÃO DOS ESTADOS =====
      
      // Dados principais
      if (mainRes.success) {
        setDashboardData(mainRes.data || null);
        console.log('✅ Dados principais carregados');
      } else {
        throw new Error(mainRes.error || 'Erro ao buscar dados do dashboard');
      }

      if (infoRes.success) {
        setAdditionalInfo(infoRes.data || null);
        console.log('✅ Informações adicionais carregadas');
      } else {
        console.warn('⚠️ Erro ao buscar infos adicionais:', infoRes.error);
      }
      
      // Dados do gráfico
      if (chartRes.success) {
        setChartData(Array.isArray(chartRes.data) ? chartRes.data : []);
        console.log('✅ Dados do gráfico carregados');
      } else {
        console.warn('⚠️ Erro ao buscar dados do gráfico:', chartRes.error);
      }

      // Top produtos
      if (productsRes.success) {
        setTopProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
        console.log('✅ Top produtos carregados');
      } else {
        console.warn('⚠️ Erro ao buscar top produtos:', productsRes.error);
      }

      // Top vendedores
      if (sellersRes.success) {
        setTopSellers(Array.isArray(sellersRes.data) ? sellersRes.data : []);
        console.log('✅ Top vendedores carregados');
      } else {
        console.warn('⚠️ Erro ao buscar top vendedores:', sellersRes.error);
      }

      // ===== DADOS WHITELABEL =====
      if (billingRes.success) {
        setWhitelabelBilling(billingRes.data || null);
        console.log('✅ Dados de faturamento whitelabel carregados');
      } else {
        console.warn('⚠️ Erro ao buscar faturamento whitelabel:', billingRes.error);
      }

      if (financialRes.success) {
        setWhitelabelFinancial(financialRes.data || null);
        console.log('✅ Dados financeiros whitelabel carregados');
      } else {
        console.warn('⚠️ Erro ao buscar dados financeiros whitelabel:', financialRes.error);
      }

      // ===== DADOS ADICIONAIS =====
      if (providersRes.success) {
        setProviders(Array.isArray(providersRes.data) ? providersRes.data : []);
        console.log('✅ Dados de provedores carregados');
      } else {
        console.warn('⚠️ Erro ao buscar dados de provedores:', providersRes.error);
      }

      if (acquirersRes.success) {
        setAcquirers(Array.isArray(acquirersRes.data) ? acquirersRes.data : []);
        console.log('✅ Dados de adquirentes carregados');
      } else {
        console.warn('⚠️ Erro ao buscar dados de adquirentes:', acquirersRes.error);
      }

      console.log('🎉 Todos os dados do dashboard carregados com sucesso!');

    } catch (err: any) {
      console.error("❌ Erro detalhado no useDashboardMetrics:", err);
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
    // ===== DADOS PRINCIPAIS =====
    dashboardData,
    additionalInfo,
    chartData,
    topProducts,
    topSellers,
    
    // ===== DADOS WHITELABEL =====
    whitelabelBilling,
    whitelabelFinancial,
    
    // ===== DADOS ADICIONAIS =====
    providers,
    acquirers,
    
    // ===== ESTADOS DE CONTROLE =====
    isLoading,
    error,
    refetch: fetchData,
    setDateRange,
  };
}; 