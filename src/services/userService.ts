// src/services/userService.ts (atualizado)
import { supabase } from './supabase';
import { adminService } from './api/supabaseAdmin';

export interface UserFilters {
  role?: string;
  search?: string;
}

export interface UserData {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  created_at: string;
  last_sign_in_at?: string;
  is_active?: boolean;
}

export const userService = {
  /**
   * Obter lista de usuários
   */
  getUsers: async (filters: UserFilters = {}) => {
    try {
      // Obtém o token de autenticação atual
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Usuário não autenticado');
      }
      
      // Chama a função serverless para listar usuários
      const { data, error } = await supabase.functions.invoke('admin/list-users', {
        body: filters
      });
      
      if (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
      }
      
      return data.users;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  },
  
  /**
   * Obter detalhes de um usuário por ID
   */
  getUserById: async (userId: string) => {
    try {
      // Chama a função serverless para obter detalhes do usuário
      const { data, error } = await supabase.functions.invoke('admin/get-user', {
        body: { userId }
      });
      
      if (error) {
        console.error('Erro ao buscar detalhes do usuário:', error);
        throw error;
      }
      
      return data.user;
    } catch (error) {
      console.error('Erro ao buscar detalhes do usuário:', error);
      throw error;
    }
  },
  
  /**
   * Criar um novo usuário
   */
  createUser: async (userData: { email: string, password: string, fullName: string, role: string }) => {
    try {
      // Chama a função serverless para criar usuário
      const { data, error } = await supabase.functions.invoke('admin/create-user', {
        body: userData
      });
      
      if (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },
  
  /**
   * Atualizar dados de um usuário
   */
  updateUser: async (userId: string, userData: { fullName?: string, role?: string }) => {
    try {
      // Chama a função serverless para atualizar usuário
      const { data, error } = await supabase.functions.invoke('admin/update-user', {
        body: { userId, ...userData }
      });
      
      if (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },
  
  /**
   * Desativar um usuário
   */
  deactivateUser: async (userId: string) => {
    try {
      // Chama a função serverless para desativar usuário
      const { data, error } = await supabase.functions.invoke('admin/deactivate-user', {
        body: { userId }
      });
      
      if (error) {
        console.error('Erro ao desativar usuário:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao desativar usuário:', error);
      throw error;
    }
  },
  
  /**
   * Reativar um usuário
   */
  reactivateUser: async (userId: string) => {
    try {
      // Chama a função serverless para reativar usuário
      const { data, error } = await supabase.functions.invoke('admin/reactivate-user', {
        body: { userId }
      });
      
      if (error) {
        console.error('Erro ao reativar usuário:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao reativar usuário:', error);
      throw error;
    }
  }
};