/**
 * 💸 WITHDRAWAL SERVICE - KINGPAY
 * ===============================
 * 
 * Serviço para saques e transferências
 * - Requisições reais à API do Supabase
 * - Sem fallbacks ou dados mockados
 */

import { supabase } from '../../../lib/supabase';

/**
 * Módulo: Saques
 */
export class WithdrawalService {

  /**
   * GET /functions/v1/saques
   * Propósito: Listar solicitações de saque (Admin).
   */
  async getWithdrawals(filters?: { limit?: number; offset?: number; status?: string; }) {
    try {
      const params = new URLSearchParams();
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());
      if (filters?.status) params.append('status', filters.status);

      const { data, error } = await supabase.functions.invoke(`saques?${params.toString()}`, {
        method: 'GET',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao listar saques:', error);
      throw error;
    }
  }

  /**
   * POST /functions/v1/withdrawals
   * Propósito: Criar uma nova solicitação de saque.
   */
  async createWithdrawal(payload: { requestedamount: number; description: string; isPix: boolean; pixkeyid?: string; }) {
    try {
      const { data, error } = await supabase.functions.invoke('withdrawals', {
        method: 'POST',
        body: payload,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar solicitação de saque:', error);
      throw error;
    }
  }

  /**
   * PATCH /functions/v1/withdrawals/:id
   * Propósito: Atualizar o status de uma solicitação de saque (aprovar, negar, etc.).
   */
  async updateWithdrawalStatus(withdrawalId: string, payload: { status: string; reason_for_denial?: string; }) {
    try {
      const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawalId}`, {
        method: 'PATCH',
        body: payload,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar status do saque:', error);
      throw error;
    }
  }

  /**
   * GET /functions/v1/saques/aggregates
   * Propósito: Obter dados agregados sobre saques (Admin).
   */
  async getWithdrawalAggregates() {
    try {
      const { data, error } = await supabase.functions.invoke('saques/aggregates', {
        method: 'GET',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar agregados de saques:', error);
      throw error;
    }
  }
}

export const withdrawalService = new WithdrawalService(); 