import { supabase } from '../../../lib/supabase';

/**
 * Módulo: Usuário Logado
 * Endpoints relacionados a ações do próprio usuário
 */
export class UserService {

  /**
   * Editar Perfil do Próprio Usuário (PATCH /functions/v1/users/:id/edit)
   * Propósito: Atualizar dados do perfil do usuário logado
   */
  async editCurrentUser(userId: string, userData: any) {
    try {
      const { data, error } = await supabase.functions.invoke(`users/${userId}/edit`, {
        method: 'PATCH',
        body: userData,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao editar usuário:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Buscar dados do usuário logado (Wrapper para auth.getUser)
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
