import { User as SupabaseUser } from '@supabase/supabase-js';

// Tipo genérico para respostas da API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

// Extensão da interface User do Supabase para incluir campos adicionais
export interface User extends SupabaseUser {
  is_admin: boolean; // Agora é obrigatório
  name: string; // Agora é obrigatório
  phone?: string;
  avatar_url?: string;
  company_id: string; // Adicionado como obrigatório
}

// Tipos para transações
export interface Transaction {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
  description?: string;
  payment_method?: string;
  user_id: string;
}

// Tipos para chaves PIX
export interface PixKey {
  id: string;
  key: string;
  key_type: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  status: 'pending' | 'active' | 'rejected' | 'suspended';
  created_at: string;
  updated_at: string;
  user_id: string;
  bank_account_id?: string;
}

// Tipos para permissões
export interface Permission {
  code: string;
  name: string;
  description?: string;
}

// Tipos para notificações
export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  user_id: string;
  type?: 'info' | 'warning' | 'error' | 'success';
}

export * from './configuracoes';
export * from './dashboard';
export * from './emailTemplates';
export * from './linkPagamentos';
export * from './padroes';
export * from './withdrawals';

