import { supabase } from '@/lib/supabase';
import { SignUpData } from '../types';

/**
 * Módulo: Autenticação de Usuário
 */

// Omitindo login, signup, etc. por simplicidade

// Endpoint: /users/:id (Simulado, pois o Supabase gerencia isso)
export const getUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
        console.error('Erro ao buscar usuário:', error);
        throw new Error('Não foi possível obter os dados do usuário.');
    }
    if (!user) {
        throw new Error('Nenhum usuário logado encontrado.');
    }
    // A API do Supabase já retorna o usuário da sessão,
    // então não precisamos de uma chamada de função de borda separada para isso.
    return { user };
};

export class AuthService {

  /**
   * Endpoint: POST /auth/v1/signup
   * Propósito: Criar um novo usuário na plataforma.
   */
  async signUp(signUpData: SignUpData): Promise<any> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            full_name: signUpData.fullName,
            // Outros metadados podem ser adicionados aqui
          },
        },
      });

      if (error) {
        console.error('❌ Erro no cadastro:', error.message);
        throw error;
      }

      console.log('✅ Usuário registrado! Verifique o e-mail para confirmação.');
      return data;

    } catch (error) {
      console.error('❌ Erro inesperado no cadastro:', error);
      throw error;
    }
  }
}

export const authService = new AuthService(); 