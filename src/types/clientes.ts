export interface Endereco {
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  pais?: string;
}

export interface Cliente {
  id?: string;
  nome: string;
  taxId: string; // CPF/CNPJ
  email?: string;
  telefone?: string;
  endereco?: Endereco;
  tipo?: 'PF' | 'PJ'; // Pessoa Física ou Pessoa Jurídica
  status?: 'ativo' | 'inativo' | 'bloqueado';
  created_at?: string;
  updated_at?: string;
  observacoes?: string;
  limite_credito?: number;
  empresa_id?: string;
}

export interface ClienteListResponse {
  items: Cliente[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface ClienteResponse {
  success: boolean;
  data?: Cliente | ClienteListResponse;
  error?: {
    message: string;
    code?: string;
  };
}

export interface ClienteFilterParams {
  taxId?: string;
  nome?: string;
  email?: string;
  status?: 'ativo' | 'inativo' | 'bloqueado';
  limit?: number;
  offset?: number;
}

export interface CreateClienteRequest {
  nome: string;
  taxId: string;
  email?: string;
  telefone?: string;
  endereco?: Endereco;
  tipo?: 'PF' | 'PJ';
  status?: 'ativo' | 'inativo' | 'bloqueado';
  observacoes?: string;
  limite_credito?: number;
}

export interface UpdateClienteRequest {
  id: string;
  nome?: string;
  taxId?: string;
  email?: string;
  telefone?: string;
  endereco?: Endereco;
  tipo?: 'PF' | 'PJ';
  status?: 'ativo' | 'inativo' | 'bloqueado';
  observacoes?: string;
  limite_credito?: number;
} 