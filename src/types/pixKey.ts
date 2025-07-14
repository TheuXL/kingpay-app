/**
 * Interface for a PIX key
 */
export interface PixKey {
  id: string;
  user_id: string;
  key_type: 'cpf' | 'email' | 'phone' | 'random';
  key_value: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  company_id?: string;
  bank_account_id?: string;
  user?: {
    id: string;
    email: string;
    full_name?: string;
  };
  company?: {
    id: string;
    name: string;
  };
} 