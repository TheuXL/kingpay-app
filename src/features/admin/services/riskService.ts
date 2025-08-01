import { supabase } from '@/config/supabaseClient';

/**
 * Módulo: Análise de Risco
 * Endpoint para avaliar o risco de uma transação ou saque.
 */
export class RiskService {

  /**
   * POST /functions/v1/risk
   * Propósito: Realizar uma análise de risco sobre uma operação.
   */
  async analyzeRisk(payload: any) {
    try {
      const { data, error } = await supabase.functions.invoke('risk', {
        method: 'POST',
        body: payload,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro na análise de risco:', error);
      throw error;
    }
  }
}

export const riskService = new RiskService(); 