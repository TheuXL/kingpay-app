import { supabase } from '../../../lib/supabase';

/**
 * Módulo: Adquirentes (Gateways de Pagamento) - Admin
 * Endpoints da documentação INTEGRACAO.md
 */
export class AcquirerService {

  /**
   * Listar Adquirentes (GET /functions/v1/acquirers)
   * Propósito: Obter a lista de todos os gateways de pagamento integrados
   */
  async getAcquirers() {
    try {
      const { data, error } = await supabase.functions.invoke('acquirers');
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao listar adquirentes:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Buscar Adquirente por ID (GET /functions/v1/acquirers/:id)
   * Propósito: Obter os detalhes completos de um adquirente específico
   */
  async getAcquirerById(acquirerId: string) {
    try {
      const { data, error } = await supabase.functions.invoke(`acquirers/${acquirerId}`);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar adquirente:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Consultar Taxas do Adquirente (GET /functions/v1/acquirers/:id/taxas)
   * Propósito: Recuperar todas as taxas configuradas para um adquirente
   */
  async getAcquirerTaxes(acquirerId: string) {
    try {
      const { data, error } = await supabase.functions.invoke(`acquirers/${acquirerId}/taxas`);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar taxas:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Ativar/Desativar Métodos de Pagamento (PATCH /functions/v1/acquirers/:id/active)
   * Propósito: Habilitar ou desabilitar PIX, Boleto e/ou Cartão para um adquirente
   */
  async updateAcquirerActiveStatus(acquirerId: string, activeStatus: {
    pix?: boolean;
    boleto?: boolean;
    card?: boolean;
  }) {
    try {
      const { data, error } = await supabase.functions.invoke(`acquirers/${acquirerId}/active`, {
        method: 'PATCH',
        body: activeStatus,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar status:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Alterar Taxas do Adquirente (PATCH /functions/v1/acquirers/:id/taxas)
   * Propósito: Atualizar a tabela de taxas (MDRs, taxas fixas, etc.) de um adquirente
   */
  async updateAcquirerTaxes(acquirerId: string, taxesData: any) {
    try {
      const { data, error } = await supabase.functions.invoke(`acquirers/${acquirerId}/taxas`, {
        method: 'PATCH',
        body: taxesData,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar taxas:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Criar Novo Adquirente
   */
  async createAcquirer(acquirerData: any) {
    try {
      const { data, error } = await supabase.functions.invoke('acquirers', {
        body: acquirerData,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar adquirente:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Atualizar Configurações do Adquirente
   */
  async updateAcquirer(acquirerId: string, acquirerData: any) {
    try {
      const { data, error } = await supabase.functions.invoke(`acquirers/${acquirerId}`, {
        method: 'PATCH',
        body: acquirerData,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar adquirente:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Deletar Adquirente
   */
  async deleteAcquirer(acquirerId: string) {
    try {
      const { data, error } = await supabase.functions.invoke(`acquirers/${acquirerId}`, {
        method: 'DELETE',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao deletar adquirente:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Testar Conectividade com Adquirente
   */
  async testAcquirerConnection(acquirerId: string) {
    try {
      const { data, error } = await supabase.functions.invoke(`acquirers/${acquirerId}/test-connection`, {
        method: 'POST',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao testar conexão:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Obter Estatísticas do Adquirente
   */
  async getAcquirerStats(acquirerId: string, period?: string) {
    try {
      const params = period ? `?period=${period}` : '';
      const { data, error } = await supabase.functions.invoke(`acquirers/${acquirerId}/stats${params}`);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Configurar Webhook do Adquirente
   */
  async configureWebhook(acquirerId: string, webhookConfig: any) {
    try {
      const { data, error } = await supabase.functions.invoke(`acquirers/${acquirerId}/webhook`, {
        method: 'PATCH',
        body: webhookConfig,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao configurar webhook:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }
}

export const acquirerService = new AcquirerService(); 