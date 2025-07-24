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

export interface PaymentLinkPayload {
  nome: string;
  valor: number;
  formas_de_pagamento: ('pix' | 'cartao' | 'boleto')[];
  description?: string;
  metadata?: Record<string, any>;
  max_uses?: number;
  expiration_date?: string;
  max_parcelamento?: number;
  solicitar_endereco?: boolean;
  ativo?: boolean;
}

export interface UpdatePaymentLinkData extends Partial<PaymentLinkPayload> {
  is_active?: boolean;
}

export interface PaymentLinkFilters {
  status?: 'active' | 'inactive' | 'expired';
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}
