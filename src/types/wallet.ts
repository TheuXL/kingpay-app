export interface Wallet {
  id: string;
  user_id: string;
  available_balance: number;
  blocked_balance: number;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  amount: number;
  description: string;
  type: 'credit' | 'debit';
  created_at: string;
  reference_id?: string;
  reference_type?: string;
}

export interface SimulateAnticipationPayload {
  transaction_ids: string[];
  company_id: string;
}

export interface RemoveBalancePayload {
  amount: number;
  user_id: string;
  description: string;
  reference_id?: string;
  reference_type?: string;
  financial_password: string;
}

export interface ManageBalancePayload {
  amount: number;
  user_id: string;
  operation: 'credit' | 'debit';
  description: string;
  reference_id?: string;
  reference_type?: string;
  financial_password?: string;
} 