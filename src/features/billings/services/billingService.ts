import { supabase } from '../../../lib/supabase';

/**
 * Módulo: Faturas
 * Endpoints da lista, correspondendo a #44 e #45 do Endpoits.md
 */
export class BillingService {

  /**
   * Endpoint #44: Listar Faturas (GET /functions/v1/billings)
   * Propósito: Obter o histórico de faturas de um usuário.
   */
  async getBillings(filters?: { 
    limit?: number; 
    offset?: number; 
    status?: 'paid' | 'pending';
  }) {
    try {
      const params = new URLSearchParams();
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());
      if (filters?.status) params.append('status', filters.status);

      const { data, error } = await supabase.functions.invoke(`billings?${params.toString()}`, {
        method: 'GET',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao listar faturas:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Endpoint #45: Marcar Fatura como Paga (PATCH /functions/v1/billings/pay)
   * Propósito: Atualizar o status de uma fatura para "paga" (Admin).
   */
  async markBillingAsPaid(billingId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('billings/pay', {
        method: 'PATCH',
        body: { billingId },
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao marcar fatura como paga:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }
}

export const billingService = new BillingService(); 