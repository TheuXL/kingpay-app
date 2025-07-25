import { supabase } from '@/lib/supabase';
import { SignUpData } from '../types';

/**
 * Módulo: Autenticação de Usuário
 * Serviço unificado para todas as operações de autenticação.
 */
class AuthService {
  /**
   * Obtém os dados do usuário da sessão ativa do Supabase.
   */
  async getUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('❌ Erro ao buscar usuário:', error);
        return { success: false, error: 'Não foi possível obter os dados do usuário.', data: null };
      }
      
      if (!user) {
        console.warn('⚠️ Nenhum usuário logado encontrado');
        return { success: false, error: 'Nenhum usuário logado encontrado.', data: null };
      }
      
      return { success: true, data: user, error: null };
      
    } catch (error: any) {
      console.error('❌ Erro inesperado ao buscar usuário:', error);
      return { success: false, error: error.message || 'Erro inesperado.', data: null };
    }
  }

  /**
   * Realiza o login do usuário no Supabase.
   */
  async signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
  }

  /**
   * Realiza o logout do usuário no Supabase.
   */
  async signOut() {
    return supabase.auth.signOut();
  }

  /**
   * Registra um novo usuário no Supabase.
   */
  async signUp(signUpData: SignUpData) {
    return supabase.auth.signUp({
      email: signUpData.email,
      password: signUpData.password,
      options: {
        data: {
          full_name: signUpData.fullName,
        },
      },
    });
  }

  /**
   * Envia um e-mail de redefinição de senha.
   */
  async resetPasswordForEmail(email: string) {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://app.kingpay.com.br/update-password',
    });
  }
}

export const authService = new AuthService(); 