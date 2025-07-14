export interface FormaPagamento {
  tipo: 'pix' | 'cartao' | 'boleto';
  ativo: boolean;
  taxa?: number;
}

export interface LinkPagamento {
  id?: string;
  nome: string;
  descricao?: string;
  valor: number;
  formas_pagamento: FormaPagamento[];
  url?: string;
  company_id: string;
  status: 'ativo' | 'inativo' | 'expirado';
  data_expiracao?: string;
  created_at?: string;
  updated_at?: string;
  max_parcelas?: number;
  permite_desconto?: boolean;
  desconto_porcentagem?: number;
  tema?: {
    cor_primaria?: string;
    cor_secundaria?: string;
    logo_url?: string;
  };
}

export interface LinkPagamentoView {
  id: string;
  nome: string;
  descricao?: string;
  valor: number;
  formas_pagamento: FormaPagamento[];
  company: {
    id: string;
    nome: string;
    logo_url?: string;
  };
  tema?: {
    cor_primaria?: string;
    cor_secundaria?: string;
    logo_url?: string;
  };
}

export interface LinkPagamentoFilterParams {
  company?: string;
  id?: string;
  status?: 'ativo' | 'inativo' | 'expirado';
}

export interface LinkPagamentoListResponse {
  items: LinkPagamento[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface LinkPagamentoResponse {
  success: boolean;
  data?: LinkPagamento | LinkPagamentoListResponse | LinkPagamentoView;
  error?: {
    message: string;
    code?: string;
  };
}

export interface CreateLinkPagamentoRequest {
  nome: string;
  descricao?: string;
  valor: number;
  formas_pagamento: FormaPagamento[];
  company_id: string;
  data_expiracao?: string;
  max_parcelas?: number;
  permite_desconto?: boolean;
  desconto_porcentagem?: number;
  tema?: {
    cor_primaria?: string;
    cor_secundaria?: string;
    logo_url?: string;
  };
}

export interface UpdateLinkPagamentoRequest {
  id: string;
  nome?: string;
  descricao?: string;
  valor?: number;
  formas_pagamento?: FormaPagamento[];
  status?: 'ativo' | 'inativo';
  data_expiracao?: string;
  max_parcelas?: number;
  permite_desconto?: boolean;
  desconto_porcentagem?: number;
  tema?: {
    cor_primaria?: string;
    cor_secundaria?: string;
    logo_url?: string;
  };
} 