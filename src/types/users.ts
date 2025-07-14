// src/types/users.ts

import { Company } from "./company";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  company?: Company;
  is_admin: boolean; // Agora é obrigatório
  full_name?: string;
}

export interface UserPermission {
  id: string;
  user_id: string;
  permission: string;
  created_at: string;
}

export interface UserApiKey {
  id: string;
  user_id: string;
  api_key: string;
  created_at: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  phone: string;
  company_id?: string;
}

export interface EditUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  company_id?: string;
}

export interface RegisterUserAndCompanyPayload {
  user: {
    name: string;
    email: string;
    phone: string;
  };
  company: {
    name: string;
    tax_id: string;
    website: string;
  };
}

/**
 * UserData é um tipo compatível com versões anteriores do código
 * que pode ser usado em lugares onde a estrutura completa do User não é necessária
 * ou para compatibilidade com código legado.
 */
export type UserData = User; 