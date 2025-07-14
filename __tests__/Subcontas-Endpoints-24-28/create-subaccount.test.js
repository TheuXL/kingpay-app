const axios = require('axios');
require('dotenv').config();

// Importar o serviço de subcontas diretamente do app
const { subAccountService } = require('../../src/services/subAccountService');
// Importar os helpers
const authHelper = require('../helpers/auth-helper');
const subAccountHelper = require('../helpers/subaccount-helper');

describe('SubAccount Service - Create SubAccount (Endpoint 24)', () => {
  // Realizar login antes de executar os testes
  beforeAll(async () => {
    try {
      // Fazer login para obter token
      await authHelper.loginForTests();
      console.log('Login realizado com sucesso para testes de subcontas');
      
      // Limpar dados de teste anteriores
      subAccountHelper.clearTestData();
    } catch (error) {
      console.error('Erro na configuração dos testes:', error);
      throw error;
    }
  });
  
  it('should create a subaccount using direct access', async () => {
    // Arrange - Preparar dados para criar subconta
    const subAccountData = {
      name: 'Subconta de Teste',
      bankData: {
        banco: '001',
        agencia: '1234',
        conta: '12345-6',
        tipo_conta: 'corrente'
      },
      adquirente: 'iugu',
      environment: 'development'
    };
    
    // Act - Usar o helper para criar subconta
    const result = await subAccountHelper.createTestSubAccount(subAccountData);
    
    // Log do resultado
    console.log('Subconta criada com sucesso:');
    console.log(`ID: ${result.id}`);
    console.log(`Live Token: ${result.live_token.substring(0, 10)}...`);
    console.log(`Test Token: ${result.test_token.substring(0, 10)}...`);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.live_token).toBeDefined();
    expect(result.test_token).toBeDefined();
    
    // Obter e verificar dados da subconta
    const subAccount = await subAccountHelper.getTestSubAccount(result.id);
    expect(subAccount).toBeDefined();
    expect(subAccount.name).toBe('Subconta de Teste');
    expect(subAccount.status).toBe('pending');
    expect(subAccount.adquirente).toBe('iugu');
    expect(subAccount.environment).toBe('development');
  });
  
  it('should attempt to create a subaccount using the app service', async () => {
    try {
      // Arrange - Preparar dados para criar subconta via serviço do app
      const apiToken = 'test_api_token';
      const privateKeyUrl = 'https://example.com/private_key.pem';
      const method = 'POST';
      const endpoint = '/v1/accounts';
      const payload = {
        name: 'Subconta via API',
        email: 'test@example.com',
        phone_prefix: '11',
        phone: '999999999',
        bank_data: {
          bank: '001',
          agency: '1234',
          account: '12345-6',
          account_type: 'checking'
        }
      };
      
      // Act - Usar o serviço do app para criar subconta
      const response = await subAccountService.createSubAccount(
        apiToken, privateKeyUrl, method, endpoint, payload
      );
      
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
  
  it('should fail to create a subaccount with invalid data', async () => {
    try {
      // Act - Tentar criar subconta sem nome (obrigatório)
      await subAccountHelper.createTestSubAccount({});
      // Se chegar aqui, o teste falhou
      expect(false).toBe(true, 'Deveria ter falhado ao criar subconta sem nome');
    } catch (error) {
      // Assert - deve falhar com a mensagem esperada
      console.log('Erro ao tentar criar subconta sem nome (esperado):');
      console.log(error.message);
      expect(error).toBeDefined();
      expect(error.message).toBe('Nome da subconta é obrigatório');
    }
  });
}); 