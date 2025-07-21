/**
 * 🔐 AUTHENTICATION SERVICE - KINGPAY
 * ===================================
 * 
 * Serviço de autenticação seguindo a documentação dos endpoints
 * - Login com email e senha
 * - Cadastro de novos usuários
 * - Gerenciamento de sessão
 */

import { supabase } from '../../lib/supabase';
import { ApiResponse } from '../../types/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  user_metadata?: any;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: AuthUser;
}

class AuthenticationService {
  /**
   * Fazer login de um usuário
   * Endpoint: POST /auth/v1/token
   */
  async signIn(credentials: LoginCredentials): Promise<ApiResponse<AuthSession>> {
    try {
      console.log('🔐 Fazendo login...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error('❌ Erro no login:', error.message);
        return {
          success: false,
          error: error.message,
          data: null
        };
      }

      console.log('✅ Login bem-sucedido!');
      return {
        success: true,
        data: data.session as AuthSession,
        error: null
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no login';
      console.error('❌ Erro inesperado no login:', errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }
  }

  /**
   * Criar nova conta de usuário
   * Endpoint: POST /auth/v1/signup
   */
  async signUp(data: SignUpData): Promise<ApiResponse<AuthSession | null>> {
    try {
      console.log('📝 Criando nova conta...');
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName || '',
          }
        }
      });

      if (error) {
        console.error('❌ Erro no cadastro:', error.message);
        return {
          success: false,
          error: error.message,
          data: null
        };
      }

      console.log('✅ Cadastro realizado!');
      return {
        success: true,
        data: authData.session as AuthSession | null,
        error: null
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no cadastro';
      console.error('❌ Erro inesperado no cadastro:', errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }
  }

  /**
   * Fazer logout do usuário
   */
  async signOut(): Promise<ApiResponse<void>> {
    try {
      console.log('🚪 Fazendo logout...');
      
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('❌ Erro no logout:', error.message);
        return {
          success: false,
          error: error.message,
          data: null
        };
      }

      console.log('✅ Logout realizado!');
      return {
        success: true,
        data: undefined,
        error: null
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no logout';
      console.error('❌ Erro inesperado no logout:', errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }
  }

  /**
   * Obter sessão atual
   */
  async getSession(): Promise<ApiResponse<AuthSession | null>> {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('❌ Erro ao obter sessão:', error.message);
        return {
          success: false,
          error: error.message,
          data: null
        };
      }

      return {
        success: true,
        data: data.session as AuthSession | null,
        error: null
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao obter sessão';
      console.error('❌ Erro inesperado ao obter sessão:', errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }
  }

  /**
   * Atualizar dados do usuário
   */
  async updateUser(updates: Partial<AuthUser>): Promise<ApiResponse<AuthUser>> {
    try {
      console.log('👤 Atualizando dados do usuário...');
      
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) {
        console.error('❌ Erro ao atualizar usuário:', error.message);
        return {
          success: false,
          error: error.message,
          data: null
        };
      }

      console.log('✅ Usuário atualizado!');
      return {
        success: true,
        data: data.user as AuthUser,
        error: null
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao atualizar usuário';
      console.error('❌ Erro inesperado ao atualizar usuário:', errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }
  }

  /**
   * Resetar senha por email
   */
  async resetPassword(email: string): Promise<ApiResponse<void>> {
    try {
      console.log('🔄 Enviando email de reset de senha...');
      
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        console.error('❌ Erro ao resetar senha:', error.message);
        return {
          success: false,
          error: error.message,
          data: null
        };
      }

      console.log('✅ Email de reset enviado!');
      return {
        success: true,
        data: undefined,
        error: null
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao resetar senha';
      console.error('❌ Erro inesperado ao resetar senha:', errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }
  }
}

// Instância singleton
export const authService = new AuthenticationService();
export default authService; 