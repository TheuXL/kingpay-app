/**
 * Interface principal de transação baseada na estrutura real da tabela vb_cdz_gus_transactions_tb
 */
export interface Transaction {
  id: string;
  customer_name: string;
  customer_email: string;
  value: number;
  status: 'paid' | 'pending' | 'refunded' | 'failed' | 'expired';
  payment_method: 'credit_card' | 'pix' | 'boleto';
  created_at: string;
  // Adicionar outros campos relevantes que a API retorna
}

export interface TransactionsResponse {
  data: Transaction[];
  total: number;
}

export interface TransactionFilters {
  limit: number;
  offset: number;
  status?: string;
  paymentMethod?: string;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Interface simplificada para listagem de transações
 */
export interface TransactionListItem {
  id: string;
  createdAt: string;
  chargedAmount: number;
  paymentMethod: string;
  status: string;
  success?: boolean;
  companyId: string;
}

/**
 * Interface para resumo de transações
 */
export interface TransactionSummary {
  total_transactions: number;
  total_volume: number;
  total_amount: number;
  paid_transactions: number;
  pending_transactions: number;
  failed_transactions: number;
  refunded_transactions: number;
  average_ticket: number;
  conversion_rate: number;
}

/**
 * Interface para detalhes completos de transação (com dados relacionados)
 */
export interface TransactionDetails extends Transaction {
  // A interface TransactionDetails herda todos os campos de Transaction.
  // Adicione aqui apenas os campos que são EXCLUSIVOS da visualização de detalhes.
  chargeback_reason?: string;
  card_brand?: string;
  card_last_four?: string;
  boleto_url?: string;
  boleto_barcode?: string;
  pix_qr_code?: string;
  timeline?: {
    status: string;
    timestamp: string;
  }[];
}

/**
 * Tipos para análise de transações
 */
export interface TransactionAnalysis {
  id: string;
  amount: number;
  date: string;
  status: string;
  paymentMethod: string;
} 