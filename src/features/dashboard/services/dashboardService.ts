/**
 * 📊 Módulo: Dashboard
 * ===================
 * 
 * Endpoints para consulta de dados agregados para os painéis.
 * Baseado na documentação REFATORACAO_COMPLETA.md
 */

import { edgeFunctionsProxy } from '../../../services/api/EdgeFunctionsProxy';
import type {
    AdditionalInfoResponse,
    ChartResponse,
    DashboardResponse,
    TopSellersResponse,
    WhitelabelBillingResponse,
    WhitelabelFinancialResponse,
} from '../../../types/dashboard';

export const getDashboardData = async (
  startDate: string,
  endDate: string,
): Promise<DashboardResponse> => {
  const params = `?start_date=${startDate}&end_date=${endDate}`;
  const response = await edgeFunctionsProxy.invoke(
    `dados-dashboard${params}`,
    'POST',
    {},
  );
  return response;
};

/**
 * Busca os dados para o gráfico de vendas.
 * @param startDate
 * @param endDate
 * @returns
 */
export const getChartData = async (
  startDate: string,
  endDate: string,
): Promise<ChartResponse> => {
  const params = `?start_date=${startDate}&end_date=${endDate}`;
  const response = await edgeFunctionsProxy.invoke(
    `dados-dashboard/grafico${params}`,
    'POST',
    {},
  );
  return response;
};

export const getAdditionalInfo = async (
  startDate: string,
  endDate: string,
): Promise<AdditionalInfoResponse> => {
  const params = `?start_date=${startDate}&end_date=${endDate}`;
  const response = await edgeFunctionsProxy.invoke(
    `dados-dashboard/infos-adicionais${params}`,
    'POST',
    {},
  );
  return response;
};

export const getTopSellers = async (
  startDate: string,
  endDate: string,
): Promise<TopSellersResponse> => {
  const params = `?start_date=${startDate}&end_date=${endDate}`;
  const response = await edgeFunctionsProxy.invoke(
    `dados-dashboard/top-sellers${params}`,
    'POST',
    {},
  );
  return response;
};

export const getTopProducts = async (
  startDate: string,
  endDate: string,
): Promise<any> => {
  const params = `?start_date=${startDate}&end_date=${endDate}`;
  const response = await edgeFunctionsProxy.invoke(
    `dados-dashboard/top-produtos${params}`,
    'POST',
    {},
  );
  return response;
};

export const getFaturamentoWhitelabel = async (
  startDate: string,
  endDate: string,
): Promise<WhitelabelBillingResponse> => {
  const params = `?start_date=${startDate}&end_date=${endDate}`;
  const response = await edgeFunctionsProxy.invoke(
    `faturamento-whitelabel${params}`,
    'POST',
    {},
  );
  return response;
};

export const getFinancialSummary = async (
  startDate?: string,
  endDate?: string,
): Promise<WhitelabelFinancialResponse> => {
  const params = startDate && endDate ? `?start_date=${startDate}&end_date=${endDate}` : '';
  const response = await edgeFunctionsProxy.invoke(
    `whitelabel-financeiro${params}`,
    'POST',
    {},
  );
  return response;
};

export const getProviders = async (
  startDate: string,
  endDate: string,
): Promise<any> => {
  const params = `?start_date=${startDate}&end_date=${endDate}`;
  const response = await edgeFunctionsProxy.invoke(
    `dados-dashboard/providers${params}`,
    'POST',
    {},
  );
  return response;
};

export const getAcquirers = async (
  startDate: string,
  endDate: string,
): Promise<any> => {
  const params = `?start_date=${startDate}&end_date=${endDate}`;
  const response = await edgeFunctionsProxy.invoke(
    `dados-dashboard/acquirer${params}`,
    'POST',
    {},
  );
  return response;
};