/**
 * 👤 USER SERVICE
 * =================================
 * Serviço para gerenciamento de usuários.
 * Faz chamadas diretas aos endpoints da API Supabase.
 */
import { supabase } from '../../../lib/supabase';

export interface User {
  id: string;
  fullname?: string;
  email?: string;
  phone?: string;
  document_number?: string;
  // Adicione outros campos conforme necessário
}

export interface UserPermissions {
  isAdmin: boolean;
  usertype: string | null;
  permissions: string[];
}

export class UserService {
  /**
   * Lista todos os usuários (Admin)
   * GET /users
   */
  async listUsers() {
    const { data, error } = await supabase.functions.invoke('users', {
      method: 'GET',
    });
    if (error) throw error;
    return data;
  }

  /**
   * Busca um usuário específico pelo ID.
   * GET /users/:id
   */
  async getUserById(userId: string) {
    const { data, error } = await supabase.functions.invoke(`users/${userId}`, {
      method: 'GET',
    });
    if (error) throw error;
    return data;
  }

  /**
   * Busca as permissões de um usuário específico.
   * GET /users/:id/permissions
   */
  async getUserPermissions(userId: string) {
    const { data, error } = await supabase.functions.invoke(`users/${userId}/permissions`, {
      method: 'GET',
    });
    if (error) throw error;
    return data;
  }
  
  /**
   * Cria um novo usuário (Admin)
   * POST /users/register
   */
  async registerUser(userData: Partial<User>) {
      const { data, error } = await supabase.functions.invoke('users/register', {
          method: 'POST',
          body: userData
      });
      if (error) throw error;
      return data;
  }
}

export const userService = new UserService();
