import { supabase } from '../../../lib/supabase';

/**
 * Módulo: Cálculo de Taxas
 * Endpoint 24 da documentação INTEGRACAO.md
 */
export class TaxCalculatorService {

  /**
   * Endpoint 24: Calcular Taxas de Transação (POST /functions/v1/taxas)
   * Propósito: Simular o cálculo de taxas para uma venda.
   */
  async calculateFees(companyId: string, amount: number, paymentMethod: string, installments: number) {
    try {
      console.log('🧮 Calculando taxas com payload:', { companyId, amount, paymentMethod, installments });
      const { data, error } = await supabase.functions.invoke('taxas', {
        method: 'POST', // Garantir que seja POST
        body: {
          company_id: companyId,
          valor: amount,
          payment_method: paymentMethod, // 'PIX', 'CARD'
          parcelas: installments,
        },
      });
      if (error) throw error;
      console.log('✅ Taxas calculadas:', data);
      return data; // Contém o valor das taxas e o valor líquido
    } catch (error) {
      console.error('Erro ao calcular taxas:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  // Método de compatibilidade com a interface existente
  async calculateTax(data: {
    amount: number;
    paymentMethod: 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_SLIP';
    installments: number;
    companyId?: string;
  }) {
    try {
      if (!data.companyId) {
        throw new Error('Company ID é obrigatório para calcular taxas');
      }

      return await this.calculateFees(
        data.companyId,
        data.amount,
        data.paymentMethod,
        data.installments
      );
    } catch (error) {
      console.error('Erro no cálculo de taxas:', error);
      throw error;
    }
  }
}

export const taxCalculatorService = new TaxCalculatorService();
