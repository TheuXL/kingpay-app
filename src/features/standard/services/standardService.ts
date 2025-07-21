import { supabase } from '../../../lib/supabase';

/**
 * Módulo: Padrões de Configuração (Admin)
 */
export class StandardService {

  /**
   * GET /functions/v1/standard
   * Propósito: Listar os "templates" de configuração para novas empresas.
   */
  async getStandardConfigs() {
    try {
      const { data, error } = await supabase.functions.invoke('standard', { method: 'GET' });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar configurações padrão:', error);
      throw error;
    }
  }

  /**
   * PATCH /functions/v1/standard/last
   * Propósito: Editar o template de configuração padrão.
   */
  async updateStandardConfig(standardPayload: any) {
    try {
      const { data, error } = await supabase.functions.invoke('standard/last', {
        method: 'PATCH',
        body: standardPayload,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar configuração padrão:', error);
      throw error;
    }
  }
}

export const standardService = new StandardService(); 