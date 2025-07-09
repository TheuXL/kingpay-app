// src/services/authService.ts
import { supabase } from './supabase';

interface LoginParams {
  email: string;
  password: string;
}

interface SignupParams {
  email: string;
  password: string;
  name?: string;
}

interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  user?: any;
  error?: any;
}

/**
 * Service para gerenciar operações de autenticação
 */
export const authService = {
  /**
   * Realiza o login do usuário
   * @param {string|object} emailOrParams - Email do usuário ou objeto com email e password
   * @param {string} [password] - Senha do usuário (opcional se emailOrParams for um objeto)
   * @returns {Promise<object>} - Dados do usuário logado
   */
  login: async (emailOrParams: any, password?: string) => {
    try {
      let email = '';
      let pass = '';
      
      // Verificar se os parâmetros foram passados como objeto ou separadamente
      if (typeof emailOrParams === 'object') {
        email = emailOrParams.email;
        pass = emailOrParams.password;
      } else {
        email = emailOrParams;
        pass = password || '';
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        console.error("Erro de login:", error.message);
        return { error };
      }

      console.log("Login bem-sucedido para:", email);
      return data;
    } catch (error: any) {
      console.error("Erro no serviço de autenticação:", error.message);
      return { error };
    }
  },

  /**
   * Criar uma nova conta de usuário
   * Endpoint: POST https://{{base_url}}/auth/v1/signup
   */
  signup: async ({ email, password, name }: SignupParams): Promise<AuthResponse> => {
    try {
      // Se tiver um nome, adiciona aos metadados do usuário
      const options = name ? { data: { full_name: name } } : undefined;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: options ? { data: options.data } : undefined,
      });

      if (error) {
        console.error("Erro de cadastro:", error.message);
        return { error };
      }

      console.log("Cadastro bem-sucedido para:", email);
      return {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        user: data.user,
      };
    } catch (error: any) {
      console.error("Erro ao criar conta:", error.message || error);
      return { error };
    }
  },

  /**
   * Logout do usuário atual
   */
  logout: async (): Promise<{ error?: any }> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Erro ao fazer logout:", error.message);
        return { error };
      }
      console.log("Logout realizado com sucesso");
      return {};
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error.message || error);
      return { error };
    }
  },

  /**
   * Obter a sessão atual
   */
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Erro ao obter sessão:", error.message);
        return { error };
      }
      return {
        session: data.session,
        user: data.session?.user,
      };
    } catch (error: any) {
      console.error("Erro ao obter sessão:", error.message || error);
      return { error };
    }
  },
  
  /**
   * Verificar se o token ainda é válido
   */
  checkToken: async (): Promise<boolean> => {
    try {
      const { data } = await supabase.auth.getSession();
      return !!data.session;
    } catch (error) {
      console.error("Erro ao verificar token:", error);
      return false;
    }
  },
};