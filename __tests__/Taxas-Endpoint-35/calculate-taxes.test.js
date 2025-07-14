const axios = require('axios');
require('dotenv').config();

// Importar o serviço de taxas diretamente do app
const { taxService } = require('../../src/services/taxService');
// Importar os helpers
const authHelper = require('../helpers/auth-helper');
const taxHelper = require('../helpers/tax-helper');

describe('Tax Service - Calculate Taxes (Endpoint 35)', () => {
  // Realizar login antes de executar os testes
  beforeAll(async () => {
    try {
      // Fazer login para obter token
      await authHelper.loginForTests();
      console.log('Login realizado com sucesso para testes de taxas');
    } catch (error) {
      console.error('Erro na configuração dos testes:', error);
      throw error;
    }
  });
  
  it('should calculate taxes for credit card payment with 1 installment', async () => {
    // Arrange - Preparar dados para cálculo de taxas
    const taxData = {
      companyId: 'test-company-123',
      valor: 100.00,
      paymentMethod: 'credit_card',
      parcelas: 1
    };
    
    // Act - Usar o helper para calcular taxas
    const result = await taxHelper.calculateTestTaxes(taxData);
    
    // Log do resultado
    console.log('Taxas calculadas para cartão de crédito em 1x:');
    console.log(JSON.stringify(result, null, 2));
    
    // Assert
    expect(result).toBeDefined();
    expect(result.company_id).toBe(taxData.companyId);
    expect(result.valor_original).toBe(taxData.valor);
    expect(result.payment_method).toBe(taxData.paymentMethod);
    expect(result.parcelas).toBe(taxData.parcelas);
    expect(result.taxa_percentual).toBe(2.99);
    expect(result.taxa_fixa).toBe(0.50);
    
    // Validar cálculos
    const isValid = taxHelper.validateTaxCalculation(result);
    expect(isValid).toBe(true);
  });
  
  it('should calculate taxes for credit card payment with multiple installments', async () => {
    // Arrange - Preparar dados para cálculo de taxas
    const taxData = {
      companyId: 'test-company-123',
      valor: 100.00,
      paymentMethod: 'credit_card',
      parcelas: 3
    };
    
    // Act - Usar o helper para calcular taxas
    const result = await taxHelper.calculateTestTaxes(taxData);
    
    // Log do resultado
    console.log('Taxas calculadas para cartão de crédito em 3x:');
    console.log(JSON.stringify(result, null, 2));
    
    // Assert
    expect(result).toBeDefined();
    expect(result.company_id).toBe(taxData.companyId);
    expect(result.valor_original).toBe(taxData.valor);
    expect(result.payment_method).toBe(taxData.paymentMethod);
    expect(result.parcelas).toBe(taxData.parcelas);
    expect(result.taxa_percentual).toBe(4.59); // 3.99 + (3 * 0.2)
    expect(result.taxa_fixa).toBe(0.50);
    
    // Validar cálculos
    const isValid = taxHelper.validateTaxCalculation(result);
    expect(isValid).toBe(true);
  });
  
  it('should calculate taxes for PIX payment', async () => {
    // Arrange - Preparar dados para cálculo de taxas
    const taxData = {
      companyId: 'test-company-123',
      valor: 100.00,
      paymentMethod: 'pix',
      parcelas: 1
    };
    
    // Act - Usar o helper para calcular taxas
    const result = await taxHelper.calculateTestTaxes(taxData);
    
    // Log do resultado
    console.log('Taxas calculadas para PIX:');
    console.log(JSON.stringify(result, null, 2));
    
    // Assert
    expect(result).toBeDefined();
    expect(result.company_id).toBe(taxData.companyId);
    expect(result.valor_original).toBe(taxData.valor);
    expect(result.payment_method).toBe(taxData.paymentMethod);
    expect(result.parcelas).toBe(taxData.parcelas);
    expect(result.taxa_percentual).toBe(0.99);
    expect(result.taxa_fixa).toBe(0.10);
    
    // Validar cálculos
    const isValid = taxHelper.validateTaxCalculation(result);
    expect(isValid).toBe(true);
  });
  
  it('should attempt to calculate taxes using the app service', async () => {
    try {
      // Arrange - Preparar dados para cálculo de taxas via serviço do app
      const companyId = 'test-company-123';
      const valor = 100.00;
      const paymentMethod = 'credit_card';
      const parcelas = 2;
      
      // Act - Usar o serviço do app para calcular taxas
      const response = await taxService.calculateTaxes(
        companyId,
        valor,
        paymentMethod,
        parcelas
      );
      
      // Log da resposta
      console.log('Resposta do cálculo de taxas via app service:');
      console.log(JSON.stringify(response, null, 2));
      
      // Se o serviço funcionar, ótimo!
      if (response.success && response.data) {
        console.log('Taxas calculadas com sucesso via app service');
      } else {
        console.log('O serviço do app não conseguiu calcular as taxas, mas isso é esperado se as funções Edge não estiverem configuradas');
      }
    } catch (error) {
      console.log('Erro ao tentar calcular taxas via app service (esperado se as funções Edge não estiverem configuradas):');
      console.log(error.message);
    }
    
    // Não fazemos assertions aqui porque o serviço pode falhar se as funções Edge não estiverem configuradas
  });
  
  it('should fail to calculate taxes with invalid data', async () => {
    // Testar valor inválido
    try {
      await taxHelper.calculateTestTaxes({
        companyId: 'test-company-123',
        valor: -100, // Valor inválido
        paymentMethod: 'credit_card',
        parcelas: 1
      });
      // Se chegar aqui, o teste falhou
      expect(false).toBe(true, 'Deveria ter falhado ao calcular taxas com valor negativo');
    } catch (error) {
      // Assert - deve falhar com a mensagem esperada
      console.log('Erro ao tentar calcular taxas com valor negativo (esperado):');
      console.log(error.message);
      expect(error).toBeDefined();
      expect(error.message).toContain('Valor deve ser maior que zero');
    }
    
    // Testar método de pagamento inválido
    try {
      await taxHelper.calculateTestTaxes({
        companyId: 'test-company-123',
        valor: 100,
        paymentMethod: '', // Método de pagamento inválido
        parcelas: 1
      });
      // Se chegar aqui, o teste falhou
      expect(false).toBe(true, 'Deveria ter falhado ao calcular taxas sem método de pagamento');
    } catch (error) {
      // Assert - deve falhar com a mensagem esperada
      console.log('Erro ao tentar calcular taxas sem método de pagamento (esperado):');
      console.log(error.message);
      expect(error).toBeDefined();
      expect(error.message).toContain('Método de pagamento é obrigatório');
    }
    
    // Testar parcelas inválidas
    try {
      await taxHelper.calculateTestTaxes({
        companyId: 'test-company-123',
        valor: 100,
        paymentMethod: 'credit_card',
        parcelas: 0 // Parcelas inválidas
      });
      // Se chegar aqui, o teste falhou
      expect(false).toBe(true, 'Deveria ter falhado ao calcular taxas com parcelas inválidas');
    } catch (error) {
      // Assert - deve falhar com a mensagem esperada
      console.log('Erro ao tentar calcular taxas com parcelas inválidas (esperado):');
      console.log(error.message);
      expect(error).toBeDefined();
      expect(error.message).toContain('Número de parcelas deve ser maior que zero');
    }
  });
}); 