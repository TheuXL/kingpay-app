export interface PaymentLink {
  id: string;
  title: string;
  description?: string;
  amount: number;
  company_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  expiration_date?: string;
  max_uses?: number;
  current_uses: number;
  metadata?: Record<string, any>;
  payment_methods: string[];
  url: string;
  short_url?: string;
}

export interface CreatePaymentLinkData {
  nome: string;
  valor: number;
  formas_de_pagamento: string[];
  description?: string;
  metadata?: Record<string, any>;
  max_uses?: number;
  expiration_date?: string;
  payment_methods?: string[];
}

export interface UpdatePaymentLinkData extends Partial<CreatePaymentLinkData> {
  is_active?: boolean;
}

export interface PaymentLinkFilters {
  status?: 'active' | 'inactive' | 'expired';
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}
