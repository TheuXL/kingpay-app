// src/services/api/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js';

// URL e chave de serviço do Supabase (deve ser armazenada com segurança)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Esta chave deve ser usada apenas em um servidor seguro

// Cliente Supabase com privilégios administrativos
// ATENÇÃO: Este cliente NÃO deve ser usado diretamente no app móvel
// Deve ser usado apenas em um servidor backend seguro
export const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

// Funções seguras que chamam APIs administrativas através de funções serverless
export const adminService = {
  // Listar usuários (deve ser chamado através de uma função serverless segura)
  listUsers: async (authToken: string) => {
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/admin/list-users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error listing users:', error);
      throw error;
    }
  },
  
  // Criar usuário com privilégios específicos
  createUser: async (authToken: string, userData: { email: string, password: string, fullName: string, role: string }) => {
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/admin/create-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  
  // Atualizar permissões de usuário
  updateUserPermissions: async (authToken: string, userId: string, permissions: string[]) => {
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/admin/update-user-permissions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, permissions })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error updating user permissions:', error);
      throw error;
    }
  },
  
  // Desativar usuário
  deactivateUser: async (authToken: string, userId: string) => {
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/admin/deactivate-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }
};