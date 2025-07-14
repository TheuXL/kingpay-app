export type WithdrawalStatus = 
  | 'pending' 
  | 'approved' 
  | 'done' 
  | 'done_manual' 
  | 'cancel' 
  | 'cancelled' 
  | 'failed';

export interface Withdrawal {
  id: string;
  user_id: string;
  company_id?: string;
  pix_key_id?: string;
  amount: number;
  requested_amount: number;
  fee_amount: number;
  status: WithdrawalStatus;
  description?: string;
  created_at: string;
  updated_at: string;
  is_pix: boolean;
  reason_for_denial?: string;
  pix_key?: {
    key: string;
    key_type: string;
  };
}

export interface WithdrawalFilters {
  limit?: number;
  offset?: number;
  status?: WithdrawalStatus;
  createdatstart?: string;
  createdatend?: string;
}

export interface CreateWithdrawalPayload {
  pixkeyid: string;
  requestedamount: number;
  description?: string;
  isPix: boolean;
}

export interface UpdateWithdrawalStatusPayload {
  status: WithdrawalStatus;
  reason_for_denial?: string;
}

export interface WithdrawalAggregates {
  total_pending: number;
  total_approved: number;
  total_done: number;
  total_cancelled: number;
  total_amount: number;
  count: number;
} 