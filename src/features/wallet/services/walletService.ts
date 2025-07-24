/**
 * Módulo: Carteira e Financeiro
 * Endpoints relacionados a wallet, saques e movimentações
 */

import { supabase } from '../../../lib/supabase';

// Helper para chamadas POST com datas
const invokePostWithDates = async (functionName: string, startDate?: string, endDate?: string) => {
    const body = {
        // O backend espera um corpo, mesmo que vazio, para requisições POST
        // e as datas são passadas como query params na URL.
    };
    
    // Constrói a URL com query params se as datas forem fornecidas
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const queryString = params.toString();
    const url = queryString ? `${functionName}?${queryString}` : functionName;

    const { data, error } = await supabase.functions.invoke(url, {
        method: 'POST',
        body: body, // Corpo da requisição
    });

    if (error) {
        console.error(`Erro ao chamar a função ${functionName}:`, error);
        throw error;
    }
    return data;
};


/**
 * Busca os dados financeiros consolidados.
 * Endpoint: POST /whitelabel-financeiro
 */
export const getFinancialData = async (startDate?: string, endDate?: string) => {
    return invokePostWithDates('whitelabel-financeiro', startDate, endDate);
};

/**
 * Busca o extrato da carteira de um usuário.
 * Endpoint: GET /extrato/:userId
 * Este endpoint é GET e não precisa de datas no corpo.
 */
export const getWalletStatement = async (userId: string, params?: { limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.offset) queryParams.append('offset', String(params.offset));
  
    const url = `extrato/${userId}?${queryParams.toString()}`;
    
    const { data, error } = await supabase.functions.invoke(url, {
        method: 'GET',
    });

    if (error) {
        console.error('Erro ao buscar extrato da carteira:', error);
        throw error;
    }
    return data;
};


/**
 * Busca o histórico de saques (transferências).
 * Endpoint: GET /saques
 * O teste indica ser GET, mas o padrão do dashboard é POST. Vamos seguir o teste.
 */
export const getWithdrawals = async () => {
  const { data, error } = await supabase.functions.invoke('saques', {
    method: 'GET'
  });
  if (error) {
    console.error('Erro ao buscar saques:', error)
    throw error;
  };
  return data;
};

/**
 * Busca o histórico de antecipações.
 * Endpoint: GET /antecipacoes/anticipations
 */
export const getAnticipations = async () => {
    const { data, error } = await supabase.functions.invoke('antecipacoes/anticipations', {
        method: 'GET'
    });
    if (error) {
        console.error('Erro ao buscar antecipações:', error);
        throw error;
    }
    return data;
};

/**
 * Busca as chaves PIX do usuário.
 * Endpoint: GET /pix-key
 */
export const getPixKeys = async () => {
    const { data, error } = await supabase.functions.invoke('pix-key', {
        method: 'GET'
    });
    if (error) {
        console.error('Erro ao buscar chaves PIX:', error);
        throw error;
    }
    return data;
};

// --- Funções legadas ou de admin que manteremos por enquanto ---

/**
 * Request a withdrawal (saque)
 * API Endpoint: POST /withdrawals
 */
export const createWithdrawal = async (withdrawalData: {
  pixkeyid: string;
  requestedamount: number; // em centavos
  description: string;
  isPix: boolean;
}) => {
  const { data, error } = await supabase.functions.invoke('withdrawals', {
    method: 'POST',
    body: withdrawalData
  });
  if (error) throw error;
  return data;
};

/**
 * Create a new anticipation request
 * API Endpoint: POST /antecipacoes/create
 */
export const createAnticipation = async () => {
  const { data, error } = await supabase.functions.invoke('antecipacoes/create', {
    method: 'POST',
    body: {}
  });
  if (error) throw error;
  return data;
};

/**
 * Cria uma solicitação de antecipação de recebíveis.
 * Endpoint: POST /antecipacoes/create
 */
export const requestAnticipation = async (amount: number) => {
    return supabase.functions.invoke('antecipacoes/create', { 
        method: 'POST',
        body: { amount } 
    });
};

// Outras funções de admin podem ser mantidas aqui... 