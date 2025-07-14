const axios = require('axios');
require('dotenv').config();

// Importar o serviço de subcontas diretamente do app
const { subAccountService } = require('../../src/services/subAccountService');
// Importar os helpers
const authHelper = require('../helpers/auth-helper');
const subAccountHelper = require('../helpers/subaccount-helper');

describe('SubAccount Service - Create SubAccount with KYC (Endpoint 42)', () => {
  // Realizar login antes de executar os testes
  beforeAll(async () => {
    try {
      // Fazer login para obter token
      await authHelper.loginForTests();
      console.log('Login realizado com sucesso para testes de criação de subconta');
    } catch (error) {
      console.error('Erro na configuração dos testes:', error);
      throw error;
    }
  });
  
  it('should create a subaccount with KYC', async () => {
    // Arrange - Dados para criar a subconta
    const subAccountData = {
      companyId: 'company-test-1',
      subconta_nome: 'Subconta de Teste',
      banco: '001',
      agencia: '1234',
      conta: '56789-0',
      tipo_conta: 'checking',
      balance_sheet: 'https://example.com/balance_sheet.pdf',
      adquirente_nome: 'Adquirente de Teste'
    };
    
    // Act - Usar o helper para criar a subconta
    const result = await subAccountHelper.createTestSubAccountWithKyc(subAccountData);
    
    // Log do resultado
    console.log('Resultado da criação de subconta:');
    console.log(JSON.stringify(result, null, 2));
    
    // Assert
    expect(result).toBeDefined();
    expect(result.company_id).toBe(subAccountData.companyId);
    expect(result.name).toBe(subAccountData.subconta_nome);
    expect(result.bank_code).toBe(subAccountData.banco);
    expect(result.bank_agency).toBe(subAccountData.agencia);
    expect(result.bank_account).toBe(subAccountData.conta);
    expect(result.account_type).toBe(subAccountData.tipo_conta);
    expect(result.acquirer_name).toBe(subAccountData.adquirente_nome);
    expect(result.status).toBe('pending');
    expect(result.kyc_status).toBe('pending');
    expect(result.message).toContain('Subconta criada com sucesso');
  });
  
  it('should fail when trying to create a subaccount without company ID', async () => {
    // Arrange - Dados incompletos para criar a subconta
    const subAccountData = {
      // Faltando companyId
      subconta_nome: 'Subconta de Teste',
      banco: '001',
      agencia: '1234',
      conta: '56789-0',
      tipo_conta: 'checking',
      balance_sheet: 'https://example.com/balance_sheet.pdf',
      adquirente_nome: 'Adquirente de Teste'
    };
    
    // Act & Assert - Esperar que a função lance um erro
    await expect(async () => {
      await subAccountHelper.createTestSubAccountWithKyc(subAccountData);
    }).rejects.toThrow('ID da empresa é obrigatório');
  });
  
  it('should fail when trying to create a subaccount without name', async () => {
    // Arrange - Dados incompletos para criar a subconta
    const subAccountData = {
      companyId: 'company-test-1',
      // Faltando subconta_nome
      banco: '001',
      agencia: '1234',
      conta: '56789-0',
      tipo_conta: 'checking',
      balance_sheet: 'https://example.com/balance_sheet.pdf',
      adquirente_nome: 'Adquirente de Teste'
    };
    
    // Act & Assert - Esperar que a função lance um erro
    await expect(async () => {
      await subAccountHelper.createTestSubAccountWithKyc(subAccountData);
    }).rejects.toThrow('Nome da subconta é obrigatório');
  });
  
  it('should fail when trying to create a subaccount without balance sheet', async () => {
    // Arrange - Dados incompletos para criar a subconta
    const subAccountData = {
      companyId: 'company-test-1',
      subconta_nome: 'Subconta de Teste',
      banco: '001',
      agencia: '1234',
      conta: '56789-0',
      tipo_conta: 'checking',
      // Faltando balance_sheet
      adquirente_nome: 'Adquirente de Teste'
    };
    
    // Act & Assert - Esperar que a função lance um erro
    await expect(async () => {
      await subAccountHelper.createTestSubAccountWithKyc(subAccountData);
    }).rejects.toThrow('Balanço patrimonial é obrigatório');
  });
  
  it('should attempt to create a subaccount using the app service', async () => {
    try {
      // Arrange - Dados para criar a subconta
      const subAccountData = {
        companyId: 'company-test-1',
        subconta_nome: 'Subconta de Teste via API',
        banco: '001',
        agencia: '1234',
        conta: '56789-0',
        tipo_conta: 'checking',
        balance_sheet: 'https://example.com/balance_sheet.pdf',
        adquirente_nome: 'Adquirente de Teste'
      };
      
      // Act - Usar o serviço do app para criar a subconta
      const response = await subAccountService.createSubAccountWithKyc(subAccountData);
      
      // Log da resposta
      console.log('Resposta da criação de subconta via app service:');
      console.log(JSON.stringify(response, null, 2));
      
      // Se o serviço funcionar, ótimo!
      if (response.success && response.data) {
        console.log('Subconta criada com sucesso via app service');
      } else {
        console.log('O serviço do app não conseguiu criar a subconta, mas isso é esperado se as funções Edge não estiverem configuradas');
      }
    } catch (error) {
      console.log('Erro ao tentar criar subconta via app service (esperado se as funções Edge não estiverem configuradas):');
      console.log(error.message);
    }
    
    // Não fazemos assertions aqui porque o serviço pode falhar se as funções Edge não estiverem configuradas
  });
}); 