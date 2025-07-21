import { supabase } from '../../../lib/supabase';

/**
 * Módulo: BaaS (Banking as a Service) - Admin
 * Endpoints da lista, correspondendo a #46-50 do Endpoits.md
 */
export class BaasService {

  /**
   * Endpoint #46: Listar Provedores BaaS (GET /functions/v1/baas)
   */
  async getBaasProviders() {
    try {
      const { data, error } = await supabase.functions.invoke('baas', { method: 'GET' });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao listar provedores BaaS:', error);
      throw error;
    }
  }

  /**
   * Endpoint #47: Buscar Provedor BaaS por ID (GET /functions/v1/baas/:id)
   */
  async getBaasProviderById(id: string) {
    try {
      const { data, error } = await supabase.functions.invoke(`baas/${id}`, { method: 'GET' });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar provedor BaaS ${id}:`, error);
      throw error;
    }
  }

  /**
   * Endpoint #48: Consultar Taxas do BaaS (GET /functions/v1/baas/:id/taxas)
   */
  async getBaasProviderTaxes(id: string) {
    try {
      const { data, error } = await supabase.functions.invoke(`baas/${id}/taxas`, { method: 'GET' });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar taxas do BaaS ${id}:`, error);
      throw error;
    }
  }

  /**
   * Endpoint #49: Ativar/Desativar BaaS (PATCH /functions/v1/baas/:id/active)
   */
  async setBaasProviderStatus(id: string, isActive: boolean) {
    try {
      const { data, error } = await supabase.functions.invoke(`baas/${id}/active`, {
        method: 'PATCH',
        body: { active: isActive },
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao ativar/desativar BaaS ${id}:`, error);
      throw error;
    }
  }

  /**
   * Endpoint #50: Alterar Taxa do BaaS (PATCH /functions/v1/baas/:id/taxa)
   */
  async updateBaasProviderTax(id: string, taxData: any) {
    try {
      const { data, error } = await supabase.functions.invoke(`baas/${id}/taxa`, {
        method: 'PATCH',
        body: taxData,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao atualizar taxa do BaaS ${id}:`, error);
      throw error;
    }
  }
}

export const baasService = new BaasService(); 