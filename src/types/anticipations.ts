// src/types/anticipations.ts

export type AnticipationStatus = 'pending' | 'approved' | 'refused';

export interface Anticipation {
  id: string;
  company_id: string;
  company_name?: string;
  amount: number;
  fee_amount: number;
  net_amount: number;
  status: AnticipationStatus;
  created_at: string;
  updated_at: string;
  paid_at?: string;
  refused_reason?: string;
}

export interface AnticipationItem {
  id: string;
  anticipation_id: string;
  transaction_id: string;
  original_amount: number;
  anticipation_amount: number;
  fee_amount: number;
  created_at: string;
}

export interface CreateAnticipationPayload {
  company_id: string;
  transaction_ids: string[];
}

export interface ApproveAnticipationPayload {
  anticipation_id: string;
  financial_password: string;
}

export interface RefuseAnticipationPayload {
  anticipation_id: string;
  reason: string;
} 