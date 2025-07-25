/**
 * 📊 Módulo: Dashboard
 * ===================
 * 
 * Endpoints para consulta de dados agregados para os painéis.
 * Baseado na documentação REFATORACAO_COMPLETA.md
 */

import { edgeFunctionsProxy } from "../../../services/api/EdgeFunctionsProxy";
import type {
  DashboardResponse,
  ChartResponse,
  AdditionalInfoResponse,
  TopProductsResponse,
  TopSellersResponse,
  WhitelabelBillingResponse,
  WhitelabelFinancialResponse,
  ProvidersResponse,
  AcquirersResponse
} from "../../../types/dashboard";

/**
 * 🎯 DADOS PRINCIPAIS DO DASHBOARD
 * Endpoint: POST /functions/v1/dados-dashboard
 * 
 * Retorna dados consolidados como:
 * - countTotal, countPaid, sumPaid
 * - countPending, sumPending
 * - countRefused, sumRefused
 * - countCancelled, sumCancelled
 * - countChargeback, sumChargeback
 * - countPreChargeback, sumPreChargeback
 * - countRefunded, sumRefunded
 * - Dados de antecipação (countAntecipacao, sumAntecipacao, etc.)
 */
export const getDashboardData = async (startDate: string, endDate: string): Promise<DashboardResponse> => {
  const params = `?start_date=${startDate}&end_date=${endDate}`;
  return edgeFunctionsProxy.post(`dados-dashboard${params}`, {});
};

/**
 * 📈 DADOS DO GRÁFICO DE EVOLUÇÃO
 * Endpoint: POST /functions/v1/dados-dashboard/grafico
 * 
 * Retorna dados para gráfico de evolução de vendas:
 * - data: "06/2025", "07/2025"
 * - total_paid_amount
 * - total_pending_amount
 * - total_refunded_amount
 */
export const getChartData = async (startDate: string, endDate: string): Promise<ChartResponse> => {
  const params = `?start_date=${startDate}&end_date=${endDate}`;
  return edgeFunctionsProxy.post(`dados-dashboard/grafico${params}`, {});
};

/**
 * 💳 INFORMAÇÕES ADICIONAIS (MÉTODOS DE PAGAMENTO)
 * Endpoint: POST /functions/v1/dados-dashboard/infos-adicionais
 * 
 * Retorna dados de métodos de pagamento:
 * - paymentMethods: [{ metodo: "PIX", vendas: 0, valorTotal: 0 }]
 */
export const getAdditionalInfo = async (startDate: string, endDate: string): Promise<AdditionalInfoResponse> => {
  const params = `?start_date=${startDate}&end_date=${endDate}`;
  return edgeFunctionsProxy.post(`dados-dashboard/infos-adicionais${params}`, {});
};

/**
 * 🏆 TOP PRODUTOS MAIS VENDIDOS
 * Endpoint: POST /functions/v1/dados-dashboard/top-produtos
 * 
 * Retorna lista de produtos mais vendidos:
 * - product_name
 * - total_revenue
 * - total_sales
 */
export const getTopProducts = async (startDate: string, endDate: string): Promise<TopProductsResponse> => {
  const params = `?start_date=${startDate}&end_date=${endDate}`;
  return edgeFunctionsProxy.post(`dados-dashboard/top-produtos${params}`, {});
};

/**
 * 👥 TOP VENDEDORES
 * Endpoint: POST /functions/v1/dados-dashboard/top-sellers
 * 
 * Retorna lista de melhores vendedores:
 * - seller_name
 * - total_revenue
 * - total_sales
 */
export const getTopSellers = async (startDate: string, endDate: string): Promise<TopSellersResponse> => {
  const params = `?start_date=${startDate}&end_date=${endDate}`;
  return edgeFunctionsProxy.post(`dados-dashboard/top-sellers${params}`, {});
};

/**
 * 🏢 FATURAMENTO WHITELABEL
 * Endpoint: POST /functions/v1/faturamento-whitelabel
 * 
 * Retorna dados de faturamento do whitelabel:
 * - faturamentoTotal
 * - entradasTransacoes, entradasSaque, estornos
 * - entradasAntecipacao, entradasPreChargeback, chargeback
 * - taxasDeAdquirente, taxasDeBaaS, taxasDeIntermediacao
 * - taxasDeAntecipacao, taxasDeSaque, taxasDeEstorno
 * - taxasDeChargeback, taxasDePreChargeback
 * - Dados detalhados de antecipação
 */
export const getWhitelabelBilling = async (startDate: string, endDate: string): Promise<WhitelabelBillingResponse> => {
  const params = `?start_date=${startDate}&end_date=${endDate}`;
  return edgeFunctionsProxy.post(`faturamento-whitelabel${params}`, {});
};

/**
 * 💰 DADOS FINANCEIROS WHITELABEL
 * Endpoint: POST /functions/v1/whitelabel-financeiro
 * 
 * Retorna dados financeiros do whitelabel:
 * - total_balances: { total_balance, total_balance_card, total_financial_reserve }
 * - pending_withdrawals: { pending_withdrawals_count, pending_withdrawals_amount }
 * - pending_anticipations: { pending_anticipations_count, pending_anticipations_amount }
 */
export const getWhitelabelFinancial = async (startDate: string, endDate: string): Promise<WhitelabelFinancialResponse> => {
  const params = `?start_date=${startDate}&end_date=${endDate}`;
  return edgeFunctionsProxy.post(`whitelabel-financeiro${params}`, {});
};

/**
 * 🔌 DADOS DE PROVEDORES
 * Endpoint: POST /functions/v1/dados-dashboard/providers
 * 
 * Retorna dados de provedores:
 * - provider_name
 * - total_revenue
 * - total_sales
 */
export const getProviders = async (startDate: string, endDate: string): Promise<ProvidersResponse> => {
  const params = `?start_date=${startDate}&end_date=${endDate}`;
  return edgeFunctionsProxy.post(`dados-dashboard/providers${params}`, {});
};

/**
 * 💳 DADOS DE ADQUIRENTES
 * Endpoint: POST /functions/v1/dados-dashboard/acquirer
 * 
 * Retorna dados de adquirentes:
 * - acquirer_name
 * - total_revenue
 * - total_sales
 */
export const getAcquirers = async (startDate: string, endDate: string): Promise<AcquirersResponse> => {
  const params = `?start_date=${startDate}&end_date=${endDate}`;
  return edgeFunctionsProxy.post(`dados-dashboard/acquirer${params}`, {});
};

/**
 * 📊 TOP VENDEDORES (ALTERNATIVO)
 * Endpoint: GET /functions/v1/dados-dashboard/top-sellers
 * 
 * Versão GET do endpoint de top vendedores
 * Retorna dados paginados com estrutura:
 * - items: TopSeller[]
 * - pagination: { page, pageSize, totalItems, totalPages, hasNextPage, hasPreviousPage }
 */
export const getTopSellersPaginated = async (startDate: string, endDate: string, page: number = 1, pageSize: number = 10) => {
  const params = `?start_date=${startDate}&end_date=${endDate}&page=${page}&pageSize=${pageSize}`;
  return edgeFunctionsProxy.get(`dados-dashboard/top-sellers${params}`);
}; 