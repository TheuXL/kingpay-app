const { taxService } = require('../../src/services/taxService');
const { supabase } = require('../../src/services/supabase');
const authHelper = require('./auth-helper');

/**
 * Helper para testes de taxas
 */
module.exports = {
  /**
   * Calcular taxas de teste
   * @param {Object} taxData Dados para cálculo de taxas
   * @returns {Promise<Object>} Taxas calculadas
   */
  calculateTestTaxes: async (taxData) => {
    try {
      // Validar dados obrigatórios
      if (!taxData.companyId) {
        throw new Error('ID da companhia é obrigatório');
      }
      
      if (!taxData.valor || taxData.valor <= 0) {
        throw new Error('Valor deve ser maior que zero');
      }
      
      if (!taxData.paymentMethod) {
        throw new Error('Método de pagamento é obrigatório');
      }
      
      if (!taxData.parcelas || taxData.parcelas <= 0) {
        throw new Error('Número de parcelas deve ser maior que zero');
      }
      
      // Garantir que estamos autenticados
      await authHelper.getCurrentSession();
      
      // Usar o simulador do serviço de taxas para calcular
      return taxService.simulateTaxCalculation(
        taxData.companyId,
        taxData.valor,
        taxData.paymentMethod,
        taxData.parcelas
      );
    } catch (error) {
      console.error('Falha ao calcular taxas de teste:', error.message);
      throw error;
    }
  },
  
  /**
   * Validar os resultados do cálculo de taxas
   * @param {Object} taxResult Resultado do cálculo de taxas
   * @returns {boolean} Se o resultado é válido
   */
  validateTaxCalculation: (taxResult) => {
    try {
      // Verificar se todos os campos necessários estão presentes
      const requiredFields = [
        'company_id',
        'valor_original',
        'payment_method',
        'parcelas',
        'taxa_percentual',
        'taxa_fixa',
        'valor_taxa_percentual',
        'valor_taxa_fixa',
        'valor_total',
        'valor_liquido'
      ];
      
      for (const field of requiredFields) {
        if (taxResult[field] === undefined) {
          console.error(`Campo obrigatório ausente no resultado: ${field}`);
          return false;
        }
      }
      
      // Verificar se os cálculos estão corretos
      const valorTaxaPercentual = (taxResult.valor_original * taxResult.taxa_percentual) / 100;
      const valorTotal = taxResult.valor_original + valorTaxaPercentual + taxResult.taxa_fixa;
      const valorLiquido = taxResult.valor_original - valorTaxaPercentual - taxResult.taxa_fixa;
      
      // Permitir uma pequena margem de erro devido a arredondamentos
      const isClose = (a, b, margin = 0.01) => Math.abs(a - b) < margin;
      
      if (!isClose(valorTaxaPercentual, taxResult.valor_taxa_percentual)) {
        console.error(`Valor da taxa percentual incorreto: esperado ${valorTaxaPercentual}, obtido ${taxResult.valor_taxa_percentual}`);
        return false;
      }
      
      if (!isClose(valorTotal, taxResult.valor_total)) {
        console.error(`Valor total incorreto: esperado ${valorTotal}, obtido ${taxResult.valor_total}`);
        return false;
      }
      
      if (!isClose(valorLiquido, taxResult.valor_liquido) && valorLiquido > 0) {
        console.error(`Valor líquido incorreto: esperado ${valorLiquido}, obtido ${taxResult.valor_liquido}`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Falha ao validar cálculo de taxas:', error.message);
      return false;
    }
  }
}; 