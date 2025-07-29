/**
 * Módulo: Carteira e Financeiro
 * Endpoints relacionados a wallet, saques e movimentações
 */
import { edgeFunctionsProxy } from "../../../services/api/EdgeFunctionsProxy";

/**
 * Busca os dados da carteira do usuário (saldos).
 * Endpoint: GET /functions/v1/wallet
 */
export const getWalletData = async () => {
    return edgeFunctionsProxy.invoke('wallet', 'GET');
};

/**
 * Busca os dados financeiros consolidados.
 * Endpoint: POST /whitelabel-financeiro
 */
export const getFinancialData = async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    // O endpoint espera POST, mas os parâmetros vão na URL, o corpo pode ser vazio.
    return edgeFunctionsProxy.invoke(`whitelabel-financeiro?${params.toString()}`, 'POST', {});
};

/**
 * Busca o extrato da carteira de um usuário.
 * Endpoint: GET /functions/v1/extrato/:userId
 */
export const getWalletStatement = async (userId: string, params?: { limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.offset) queryParams.append('offset', String(params.offset));
    
    const endpoint = `extrato/${userId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return edgeFunctionsProxy.invoke(endpoint, 'GET');
};

/**
 * Busca o histórico de saques (transferências).
 * Endpoint: GET /functions/v1/saques
 */
export const getWithdrawals = async () => {
  return edgeFunctionsProxy.invoke('saques', 'GET');
};

/**
 * Busca as antecipações.
 * Endpoint: GET /functions/v1/antecipacoes/anticipations
 */
export const getAnticipations = async () => {
    return edgeFunctionsProxy.invoke('antecipacoes/anticipations', 'GET');
};

/**
 * Busca as chaves PIX do usuário.
 * Endpoint: GET /functions/v1/pix-key
 */
export const getPixKeys = async () => {
    return edgeFunctionsProxy.invoke('pix-key', 'GET');
};

/**
 * Cria uma nova solicitação de saque (withdrawal).
 * API Endpoint: POST /functions/v1/withdrawals
 */
export const createWithdrawal = async (withdrawalData: {
  pixkeyid: string;
  requestedamount: number; // em centavos
  description: string;
  isPix: boolean;
}) => {
  return edgeFunctionsProxy.invoke('withdrawals', 'POST', withdrawalData);
}; 