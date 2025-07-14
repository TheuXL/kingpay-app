import { supabase } from './supabase';

/**
 * Interface para o payload de cálculo de taxas
 */
interface TaxCalculationPayload {
  company_id: string;
  valor: number;
  payment_method: string;
  parcelas: number;
}

/**
 * Serviço para cálculo de taxas
 */
export const taxService = {
  /**
   * Calcular taxas de uma transação (Endpoint 35)
   * @param companyId ID da companhia que receberá a transação
   * @param valor Valor da transação
   * @param paymentMethod Método de pagamento
   * @param parcelas Número de parcelas
   * @returns {Promise<Object>} Taxas calculadas
   */
  calculateTaxes: async (
    companyId: string,
    valor: number,
    paymentMethod: string,
    parcelas: number
  ) => {
    try {
      // Validar os dados
      if (!companyId) {
        return { success: false, error: { message: 'ID da companhia é obrigatório' } };
      }

      if (!valor || valor <= 0) {
        return { success: false, error: { message: 'Valor deve ser maior que zero' } };
      }

      if (!paymentMethod) {
        return { success: false, error: { message: 'Método de pagamento é obrigatório' } };
      }

      if (parcelas <= 0) {
        return { success: false, error: { message: 'Número de parcelas deve ser maior que zero' } };
      }

      // Chamar a função Edge para calcular as taxas
      const { data, error } = await supabase.functions.invoke('taxas', {
        body: {
          company_id: companyId,
          valor,
          payment_method: paymentMethod,
          parcelas
        } as TaxCalculationPayload
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  },

  /**
   * Simular o cálculo de taxas (para testes ou quando a função Edge não está disponível)
   * @param companyId ID da companhia que receberá a transação
   * @param valor Valor da transação
   * @param paymentMethod Método de pagamento
   * @param parcelas Número de parcelas
   * @returns {Object} Taxas simuladas
   */
  simulateTaxCalculation: (
    companyId: string,
    valor: number,
    paymentMethod: string,
    parcelas: number
  ) => {
    // Validar os dados
    if (!companyId) {
      throw new Error('ID da companhia é obrigatório');
    }

    if (!valor || valor <= 0) {
      throw new Error('Valor deve ser maior que zero');
    }

    if (!paymentMethod) {
      throw new Error('Método de pagamento é obrigatório');
    }

    if (parcelas <= 0) {
      throw new Error('Número de parcelas deve ser maior que zero');
    }

    // Taxas padrão para simulação
    let taxaPercentual = 0;
    let taxaFixa = 0;

    // Simular taxas baseadas no método de pagamento
    switch (paymentMethod.toLowerCase()) {
      case 'credit_card':
        taxaPercentual = parcelas === 1 ? 2.99 : 3.99 + (parcelas * 0.2);
        taxaFixa = 0.50;
        break;
      case 'debit_card':
        taxaPercentual = 1.99;
        taxaFixa = 0.30;
        break;
      case 'pix':
        taxaPercentual = 0.99;
        taxaFixa = 0.10;
        break;
      case 'boleto':
        taxaPercentual = 1.5;
        taxaFixa = 2.00;
        break;
      default:
        taxaPercentual = 2.5;
        taxaFixa = 1.00;
    }

    // Calcular valores
    const valorTaxaPercentual = (valor * taxaPercentual) / 100;
    const valorTotal = valor + valorTaxaPercentual + taxaFixa;
    const valorLiquido = valor - valorTaxaPercentual - taxaFixa;

    // Retornar resultado simulado
    return {
      company_id: companyId,
      valor_original: valor,
      payment_method: paymentMethod,
      parcelas,
      taxa_percentual: taxaPercentual,
      taxa_fixa: taxaFixa,
      valor_taxa_percentual: valorTaxaPercentual,
      valor_taxa_fixa: taxaFixa,
      valor_total: valorTotal,
      valor_liquido: valorLiquido > 0 ? valorLiquido : 0
    };
  }
}; 