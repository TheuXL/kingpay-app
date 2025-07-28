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
  const response = await edgeFunctionsProxy.invoke(
    `analytics-reports/top-sellers?start_date=${startDate}&end_date=${endDate}`,
    'GET',
  );
  return response;
};

export const getFaturamentoWhitelabel = async (
  startDate: string,
  endDate: string,
): Promise<WhitelabelBillingResponse> => {
  const response = await edgeFunctionsProxy.invoke(
    `faturamento-whitelabel?start_date=${startDate}&end_date=${endDate}`,
    'GET',
  );
  return response;
};

export const getAcquirer = async (
  acquirerId: string,
): Promise<WhitelabelFinancialResponse> => {
  const response = await edgeFunctionsProxy.invoke(
    `acquirer/${acquirerId}`,
    'GET',
  );
  return response;
};

export const getFinancialSummary = async (): Promise<WhitelabelFinancialResponse> => {
  const response = await edgeFunctionsProxy.invoke(
    `whitelabel-financeiro`,
    'POST',
    {},
  );
  return response;
};