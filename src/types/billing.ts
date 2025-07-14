/**
 * Interface representing a billing/invoice in the system
 */
export interface Billing {
  id: string;
  user_id: string;
  company_id: string;
  amount: number;
  description: string;
  due_date: string;
  paid_date?: string;
  status: BillingStatus;
  payment_method?: PaymentMethod;
  created_at: string;
  updated_at: string;
}

export type BillingStatus = 'pending' | 'paid' | 'overdue' | 'canceled';
export type PaymentMethod = 'pix' | 'credit_card' | 'boleto' | 'balance';

export interface PayBillingPayload {
  billingId: string;
  paymentMethod: PaymentMethod;
  cardToken?: string;
  installments?: number;
  financial_password?: string;
}

export interface CreateBillingPayload {
  company_id: string;
  amount: number;
  description: string;
  due_date: string;
}

/**
 * Response from the API when fetching billings
 */
export interface BillingListResponse {
  billings: Billing[];
}

/**
 * Response from the API when paying a billing
 */
export interface PayBillingResponse {
  success: boolean;
  message: string;
} 