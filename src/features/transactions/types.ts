/**
 * Interface principal de transação baseada na estrutura real da tabela vb_cdz_gus_transactions_tb
 */
export interface Transaction {
  // Campos principais
  id: string;
  createdat: string;
  updatedat: string;
  date: string;
  time?: string;
  
  // Valores monetários
  chargedamount: number; // Valor cobrado (em centavos no banco, convertido para reais)
  netamount: number; // Valor líquido
  
  // Informações de pagamento
  paymentmethod: string; // pix, card, boleto
  status: string; // pending, paid, failed, etc.
  success?: boolean;
  month?: number;
  installments?: number;
  
  // IDs relacionados
  companyid: string;
  clientid?: string;
  userId?: string;
  acquirerid?: string;
  
  // Dados específicos do método de pagamento
  // PIX
  pixcode?: string;
  end2EndId?: string;
  qr_code_url?: string;
  
  // Cartão
  cardHolderName?: string;
  cardLastDigits?: string;
  cardExpirationMonth?: number;
  cardExpirationYear?: number;
  cardflag?: string; // visa, mastercard, etc.
  
  // Boleto
  boletourl?: string;
  digitableLine?: string;
  barcode_boleto?: string;
  duedate?: string;
  
  // Metadados
  description?: string;
  metadata?: string;
  clientip?: string;
  
  // Dados de rastreamento
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbc?: string; // Facebook Click ID
  fbp?: string; // Facebook Browser ID
  operating_system?: string;
  browser_data?: string;
  cityTracker?: string;
  RegiaoTracker?: string;
  
  // Status de transação
  anticipated?: boolean;
  availableforanticipation?: boolean;
  anticipationunderreview?: boolean;
  refunded?: boolean;
  refund_date?: string;
  paidat?: string;
  
  // Dados de entrega
  delivery_status?: string;
  delivery_code?: string;
  
  // E-commerce
  store?: string;
  idShopify?: string;
  splits?: any[];
  itens?: any[];
  
  // Outros
  motivoDoErro?: string;
  provider?: string;
  idAdquirente?: string;
  postbackUrl?: string;
  fraud_detection?: any;
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
 * Interface para filtros de transações
 */
export interface TransactionFilters {
  status?: string[];
  payment_method?: string[];
  start_date?: string;
  end_date?: string;
  customer_id?: string;
  company_id?: string;
  limit?: number;
  offset?: number;
}

/**
 * Interface para detalhes completos de transação (com dados relacionados)
 */
export interface TransactionDetails extends Transaction {
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  company_name?: string;
  company_status?: string;
  user_fullname?: string;
  user_email?: string;
  user_phone?: string;
  fees?: number;
  gateway_response?: any;
  webhook_data?: any;
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