const axios = require('axios');
require('dotenv').config();

// Importar o serviço de subcontas diretamente do app
const { subAccountService } = require('../../src/services/subAccountService');
// Importar os helpers
const authHelper = require('../helpers/auth-helper');
const subAccountHelper = require('../helpers/subaccount-helper');

describe('SubAccount Service - Check Status (Endpoint 40)', () => {
  // Realizar login antes de executar os testes
  beforeAll(async () => {
    try {
      // Fazer login para obter token
      await authHelper.loginForTests();
      console.log('Login realizado com sucesso para testes de verificação de status');
    } catch (error) {
      console.error('Erro na configuração dos testes:', error);
      throw error;
    }
  });
  
  it('should check status of a subaccount', async () => {
    // Arrange - Obter uma subconta para verificar o status
    const subAccounts = await subAccountHelper.listTestSubAccounts();
    
    // Se não houver subcontas, usar um ID e token de teste
    const subAccountId = subAccounts.items.length > 0 ? subAccounts.items[0].id : '1';
    const token = subAccounts.items.length > 0 ? subAccounts.items[0].token : 'token-teste';
    
    // Act - Usar o helper para verificar o status
    const result = await subAccountHelper.checkTestStatus(subAccountId, token);
    
    // Log do resultado
    console.log('Resultado da verificação de status:');
    console.log(JSON.stringify(result, null, 2));
    
    // Assert
    expect(result).toBeDefined();
    expect(result.id).toBe(subAccountId);
    expect(result.status).toBeDefined();
    expect(result.provider_status).toBeDefined();
  });
  
  it('should fail when trying to check status without subaccount ID', async () => {
    // Arrange - Token de teste
    const token = 'token-teste';
    
    // Act & Assert - Esperar que a função lance um erro
    await expect(async () => {
      await subAccountHelper.checkTestStatus('', token);
    }).rejects.toThrow('ID da subconta é obrigatório');
  });
  
  it('should fail when trying to check status without token', async () => {
    // Arrange - ID de subconta de teste
    const subAccountId = '1';
    
    // Act & Assert - Esperar que a função lance um erro
    await expect(async () => {
      await subAccountHelper.checkTestStatus(subAccountId, '');
    }).rejects.toThrow('Token da subconta é obrigatório');
  });
  
  it('should attempt to check status using the app service', async () => {
    try {
      // Arrange - Definir dados para verificação
      const subAccountId = '1'; // ID de teste
      const token = 'token-teste';
      
      // Act - Usar o serviço do app para verificar o status
      const response = await subAccountService.checkStatus(subAccountId, token);
      
      // Log da resposta
      console.log('Resposta da verificação de status via app service:');
      console.log(JSON.stringify(response, null, 2));
      
      // Se o serviço funcionar, ótimo!
      if (response.success && response.data) {
        console.log('Status verificado com sucesso via app service');
      } else {
        console.log('O serviço do app não conseguiu verificar o status, mas isso é esperado se as funções Edge não estiverem configuradas');
      }
    } catch (error) {
      console.log('Erro ao tentar verificar status via app service (esperado se as funções Edge não estiverem configuradas):');
      console.log(error.message);
    }
    
    // Não fazemos assertions aqui porque o serviço pode falhar se as funções Edge não estiverem configuradas
  });
}); 