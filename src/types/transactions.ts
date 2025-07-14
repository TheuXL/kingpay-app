// src/types/transactions.ts

export type TransactionStatus = 
  | 'waiting_payment'
  | 'paid'
  | 'chargedback'
  | 'refunded'
  | 'refused'
  | 'canceled'
  | 'expired'
  | 'pending';  // Added pending status

export type PaymentMethod = 'BOLETO' | 'PIX' | 'CARD';

export interface Transaction {
  id: string;
  company_id: string;
  amount: number;
  status: TransactionStatus;
  payment_method: PaymentMethod;
  created_at: string;
  updated_at: string;
  // Outros campos relevantes da transação
}

export interface TransactionDetails extends Transaction {
  customer_name?: string;
  customer_email?: string;
  customer_document?: string;
  customer_phone?: string;
  acquirer_id?: string;
  acquirer_name?: string;
  acquirer_response_code?: string;
  acquirer_payment_id?: string;
  installments?: number;
  payment_link_id?: string;
  card_brand?: string;
  card_last_digits?: string;
}

export interface TransactionFilters {
  limit?: number;
  offset?: number;
  status?: TransactionStatus[];
  startDate?: string;
  endDate?: string;
  paymentMethod?: PaymentMethod[];
}

export interface TransactionSummary {
  total_transactions: number;
  total_volume: number;
  chargebacks: number;
  refunds: number;
  paid: number;
  refused: number;
} 