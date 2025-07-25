/**
 * Módulo: Carteira e Financeiro
 * Endpoints relacionados a wallet, saques e movimentações
 */
import { edgeFunctionsProxy } from "../../../services/api/EdgeFunctionsProxy";

/**
 * Busca os dados da carteira do usuário (saldos).
 * Endpoint: GET /wallet
 */
export const getWalletData = async (userId: string) => {
    return edgeFunctionsProxy.get(`wallet?userId=${userId}`);
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
    return edgeFunctionsProxy.post(`whitelabel-financeiro?${params.toString()}`, {});
};

/**
 * Busca o extrato da carteira de um usuário.
 * Endpoint: GET /extrato/:userId
 */
export const getWalletStatement = async (userId: string, params?: { limit?: number; offset?: number }) => {
    const queryParams: Record<string, string> = {};
    if (params?.limit) queryParams['limit'] = String(params.limit);
    if (params?.offset) queryParams['offset'] = String(params.offset);
    
    return edgeFunctionsProxy.get(`extrato/${userId}`, queryParams);
};

/**
 * Busca o histórico de saques (transferências).
 * Endpoint: GET /saques
 */
export const getWithdrawals = async () => {
  return edgeFunctionsProxy.get('saques');
};

/**
 * Busca as chaves PIX do usuário.
 * Endpoint: GET /pix-key
 */
export const getPixKeys = async () => {
    return edgeFunctionsProxy.get('pix-key');
};

/**
 * Cria uma nova solicitação de saque (withdrawal).
 * API Endpoint: POST /withdrawals
 */
export const createWithdrawal = async (withdrawalData: {
  pixkeyid: string;
  requestedamount: number; // em centavos
  description: string;
  isPix: boolean;
}) => {
  return edgeFunctionsProxy.post('withdrawals', withdrawalData);
}; 