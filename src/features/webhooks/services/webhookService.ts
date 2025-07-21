import { supabase } from '../../lib/supabase';

/**
 * Módulo: Webhooks (Configuração)
 */
export class WebhookService {

  /**
   * GET /functions/v1/webhook
   */
  async getWebhooks(params: any) {
    try {
      const query = new URLSearchParams(params).toString();
      const { data, error } = await supabase.functions.invoke(`webhook?${query}`, {
        method: 'GET',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar webhooks:', error);
      throw error;
    }
  }

  /**
   * PUT /functions/v1/webhook/:webhookId
   */
  async updateWebhook(webhookId: string, payload: any) {
    try {
      const { data, error } = await supabase.functions.invoke(`webhook/${webhookId}`, {
        method: 'PUT',
        body: payload,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar webhook:', error);
      throw error;
    }
  }

  /**
   * DELETE /functions/v1/webhook/:webhookId
   */
  async deleteWebhook(webhookId: string) {
    try {
      const { data, error } = await supabase.functions.invoke(`webhook/${webhookId}`, {
        method: 'DELETE',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao deletar webhook:', error);
      throw error;
    }
  }
}

export const webhookService = new WebhookService(); 