/**
 * 
 * Módulo: Transações
 * Endpoint: POST /functions/v1/transactions
 */
import { edgeFunctionsProxy } from "../../../services/api/EdgeFunctionsProxy";
import { TransactionFilters, TransactionsResponse } from "../types";

export interface TransactionItem {
  id: string;
  description: string;
  quantity: number;
  amount: number; // Em centavos
}

export interface CustomerData {
  name: string;
  email: string;
  tax_id: string; // CPF/CNPJ
  phone?: string;
}

export interface TransactionRequest {
  payment_method: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  items: TransactionItem[];
  customer: CustomerData;
  amount: number; // Valor total em centavos
  installments?: number; // Para cartão de crédito
  card_token?: string; // Token do cartão de crédito
}

export interface TransactionResponse {
  success: boolean;
  transaction_id: string;
  status: string;
  pix_qr_code?: string;
  pix_qr_code_text?: string;
  boleto_url?: string;
  boleto_barcode?: string;
  error?: string;
}

/**
 * Cria uma nova transação (PIX, Cartão de Crédito, Boleto)
 * @param transactionData - Os dados da transação a ser criada.
 * @returns O resultado da transação.
 */
export const createTransaction = async (
  transactionData: TransactionRequest
): Promise<TransactionResponse> => {
  const response = await edgeFunctionsProxy.invoke(
    'transactions',
    'POST',
    transactionData
  );

  if (response.success && response.data) {
    return response.data as TransactionResponse;
  }

  throw new Error(response.error || 'Erro ao criar transação.');
};

/**
 * Busca uma lista paginada e filtrada de transações.
 * Endpoint: GET /functions/v1/transacoes
 * @param filters - Objeto contendo filtros e paginação.
 * @returns Uma promessa que resolve para a resposta da API de transações.
 */
export const getTransactions = async (filters: TransactionFilters): Promise<TransactionsResponse> => {
    // Constrói os parâmetros de query a partir do objeto de filtros.
    const params = new URLSearchParams();

    // Adiciona parâmetros de paginação
    params.append('limit', String(filters.limit));
    params.append('offset', String(filters.offset));

    // Adiciona filtros opcionais
    if (filters.status) {
        params.append('status', filters.status);
    }
    if (filters.paymentMethod) {
        params.append('payment_method', filters.paymentMethod);
    }
    if (filters.startDate) {
        // Formata a data para YYYY-MM-DD
        params.append('start_date', filters.startDate.toISOString().split('T')[0]);
    }
    if (filters.endDate) {
        params.append('end_date', filters.endDate.toISOString().split('T')[0]);
    }

    // Faz a chamada à API usando o proxy
    const response = await edgeFunctionsProxy.invoke(`transacoes?${params.toString()}`, 'GET');
    
    // Retorna os dados com um fallback para garantir que a estrutura seja consistente
    return response.data || { data: [], total: 0 };
}; 