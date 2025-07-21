import { supabase } from '../../../lib/supabase';

/**
 * Módulo: Credenciais de API
 * Endpoint 15 da documentação INTEGRACAO.md
 */
export const credentialsService = {
  /**
   * Endpoint 15: Obter Credenciais de API (GET /functions/v1/credentials)
   * Propósito: Buscar as chaves de API do usuário logado.
   */
  async getApiCredentials() {
    try {
      const { data, error } = await supabase.functions.invoke('credentials');
      if (error) throw error;
      return data; // Contém as chaves
    } catch (error) {
      console.error('Erro ao buscar credenciais:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }
}; 