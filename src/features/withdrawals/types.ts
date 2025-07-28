export interface Withdrawal {
  id: string;
  createdat: string;
  updatedat: string;
  status: 'done' | 'pending' | 'failed' | 'cancelled' | 'approved';
  type: string;
  amount: number;
  company_name?: string;
  company_taxid?: string;
  pix_key_id?: string;
  pix_key?: string;
  pix_key_type?: string;
  description?: string;
  reason_for_denial?: string;
}

export interface WithdrawalsAggregates {
  done: number;
  failed: number;
  cancelled: number;
  approved: number;
  pending: number;
  total: number;
}

export interface CreateWithdrawalPayload {
    amount: number;
    pix_key_id: string;
    description?: string;
}

export interface UpdateWithdrawalPayload {
    status: 'approved' | 'cancelled';
    reason_for_denial?: string;
} 