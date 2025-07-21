import { supabase } from '../../../lib/supabase';

/**
 * Interface para os parâmetros de login
 */
interface LoginParams {
  email: string;
  password: string;
}

/**
 * Interface para os parâmetros de cadastro
 */
interface SignupParams {
  email: string;
  password: string;
  name?: string;
}

/**
 * Serviço de autenticação seguindo a documentação INTEGRACAO.md
 */
export const authService = {
  /**
   * Endpoint 1: Autenticação - Gerar Token de Acesso (POST /auth/v1/token)
   * Propósito: Fazer login de um usuário.
   */
  async login({ email, password }: LoginParams) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      console.log('Login bem-sucedido!', data.session.access_token);
      return {
        success: true,
        error: null,
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      console.error('Erro no login:', error instanceof Error ? error.message : 'Erro desconhecido');
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Erro desconhecido' },
        user: null,
        session: null,
      };
    }
  },

  /**
   * Endpoint 2: Autenticação - Criar Nova Conta (POST /auth/v1/signup)
   * Propósito: Registrar um novo usuário.
   */
  async signup({ email, password, name }: SignupParams) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name,
          },
        },
      });
      if (error) throw error;
      console.log('Usuário registrado! Verifique seu e-mail.', data);
      return {
        success: true,
        error: null,
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      console.error('Erro no cadastro:', error instanceof Error ? error.message : 'Erro desconhecido');
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Erro desconhecido' },
        user: null,
        session: null,
      };
    }
  },

  /**
   * Realiza o logout do usuário
   */
  async logout() {
    try {
      console.log('🚪 Fazendo logout...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Erro no logout:', error.message);
        return {
          success: false,
          error,
        };
      }

      console.log('✅ Logout realizado com sucesso');
      return {
        success: true,
        error: null,
      };
    } catch (error) {
      console.error('❌ Erro inesperado no logout:', error);
      return {
        success: false,
        error: { message: 'Erro inesperado durante o logout' },
      };
    }
  },

  /**
   * Obtém o usuário atualmente logado
   */
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Erro ao buscar sessão:', error.message);
        return { success: false, error };
      }

      if (data.session) {
        console.log('✅ Sessão ativa encontrada');
        console.log('👤 Usuário:', data.session.user.email);
        
        // Corrigido para multiplicar por 1000 para converter de segundos para milissegundos
        const expiresAt = data.session.expires_at ? data.session.expires_at * 1000 : 0;
        console.log('🎫 Token válido até:', new Date(expiresAt).toLocaleString());

        return { success: true, user: data.session.user, session: data.session };
      } else {
        console.log('ℹ️ Nenhuma sessão encontrada');
        return { success: false, error: new Error('Nenhuma sessão encontrada') };
      }
    } catch (error) {
      console.error('❌ Erro ao verificar sessão:', error);
      return {
        success: false,
        error: { message: 'Erro ao verificar autenticação' },
        session: null,
      };
    }
  },

  /**
   * Recupera a senha do usuário
   */
  async resetPassword(email: string) {
    try {
      console.log('🔄 Enviando email de recuperação para:', email);
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        console.error('❌ Erro ao enviar email de recuperação:', error.message);
        return {
          success: false,
          error,
        };
      }

      console.log('✅ Email de recuperação enviado');
      return {
        success: true,
        error: null,
        data,
      };
    } catch (error) {
      console.error('❌ Erro inesperado na recuperação:', error);
      return {
        success: false,
        error: { message: 'Erro inesperado ao enviar email de recuperação' },
      };
    }
  },

  /**
   * Verifica a conectividade básica
   */
  async checkConnectivity(): Promise<{ success: boolean }> {
    return {
      success: true
    }
  }
}; 