import { supabase } from '../../lib/supabase';

/**
 * Módulo: Análise de Risco
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