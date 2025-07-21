export interface PixKey {
  id: string;
  key: string;
  type: 'email' | 'phone' | 'cpf' | 'cnpj' | 'random';
  description: string;
  creator: string;
  v: boolean; // approved status
  createdat: string;
  updatedat: string;
}

export interface CreatePixKeyData {
  key: string;
  type: 'email' | 'phone' | 'cpf' | 'cnpj' | 'random';
  description: string;
}

export interface UpdatePixKeyData {
  key?: string;
  type?: 'email' | 'phone' | 'cpf' | 'cnpj' | 'random';
  description?: string;
}

export interface PixKeyValidation {
  isValid: boolean;
  type?: string;
  message?: string;
}
