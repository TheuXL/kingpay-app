import { supabase } from '@/config/supabaseClient';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
}

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
      
      if (error || !user) {
        return null;
      }
      
      return user;
      
    } catch (error: any) {
      console.error('❌ Erro inesperado ao buscar usuário:', error);
      return null;
    }
  }

  /**
   * Obtém a sessão atual do Supabase.
   */
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Erro ao buscar sessão:', error);
        return null;
      }
      
      return session;
      
    } catch (error: any) {
      console.error('❌ Erro inesperado ao buscar sessão:', error);
      return null;
    }
  }

  /**
   * Listener para mudanças no estado de autenticação.
   */
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
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