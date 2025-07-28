/**
 * 
 * Módulo: Transações
 * Endpoint: POST /functions/v1/transactions
 */
import { edgeFunctionsProxy } from "../../../services/api/EdgeFunctionsProxy";

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