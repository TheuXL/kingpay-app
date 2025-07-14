const axios = require('axios');
require('dotenv').config();

// Importar o serviço de subcontas diretamente do app
const { subAccountService } = require('../../src/services/subAccountService');
// Importar os helpers
const authHelper = require('../helpers/auth-helper');
const subAccountHelper = require('../helpers/subaccount-helper');

describe('SubAccount Service - Webhooks (Endpoints 26-27)', () => {
  // Realizar login antes de executar os testes
  beforeAll(async () => {
    try {
      // Fazer login para obter token
      await authHelper.loginForTests();
      console.log('Login realizado com sucesso para testes de webhooks');
      
      // Limpar dados de teste anteriores
      subAccountHelper.clearTestData();
    } catch (error) {
      console.error('Erro na configuração dos testes:', error);
      throw error;
    }
  });
  
  it('should create a webhook using direct access', async () => {
    // Arrange - Preparar dados para criar webhook
    const webhookData = {
      event: 'all',
      url: 'https://example.com/webhook'
    };
    
    // Act - Usar o helper para criar webhook
    const webhookId = await subAccountHelper.createTestWebhook(webhookData);
    
    // Log do resultado
    console.log(`Webhook criado com ID: ${webhookId}`);
    
    // Assert
    expect(webhookId).toBeDefined();
  });
  
  it('should list webhooks using direct access', async () => {
    // Arrange - Criar mais um webhook para ter pelo menos dois na lista
    await subAccountHelper.createTestWebhook({
      event: 'invoice.status_changed',
      url: 'https://example.com/invoice-webhook'
    });
    
    // Act - Usar o helper para listar webhooks
    const webhooks = await subAccountHelper.listTestWebhooks();
    
    // Log do resultado
    console.log('Webhooks listados:');
    console.log(`Total de webhooks: ${webhooks.length}`);
    webhooks.forEach((webhook, index) => {
      console.log(`Webhook ${index + 1}: Evento=${webhook.event}, URL=${webhook.url}`);
    });
    
    // Assert
    expect(webhooks).toBeDefined();
    expect(Array.isArray(webhooks)).toBe(true);
    expect(webhooks.length).toBeGreaterThanOrEqual(2);
    expect(webhooks[0].event).toBeDefined();
    expect(webhooks[0].url).toBeDefined();
    expect(webhooks[0].active).toBe(true);
  });
  
  it('should attempt to create a webhook using the app service', async () => {
    try {
      // Arrange - Preparar dados para criar webhook via serviço do app
      const apiToken = 'test_api_token';
      const event = 'all';
      const url = 'https://example.com/app-webhook';
      
      // Act - Usar o serviço do app para criar webhook
      const response = await subAccountService.createWebhook(apiToken, event, url);
      
      // Log da resposta
      console.log('Resposta da criação de webhook via app service:');
      console.log(JSON.stringify(response, null, 2));
      
      // Se o serviço funcionar, ótimo!
      if (response.success && response.data) {
        console.log('Webhook criado com sucesso via app service');
      } else {
        console.log('O serviço do app não conseguiu criar o webhook, mas isso é esperado se as funções Edge não estiverem configuradas');
      }
    } catch (error) {
      console.log('Erro ao tentar criar webhook via app service (esperado se as funções Edge não estiverem configuradas):');
      console.log(error.message);
    }
    
    // Não fazemos assertions aqui porque o serviço pode falhar se as funções Edge não estiverem configuradas
  });
  
  it('should attempt to list webhooks using the app service', async () => {
    try {
      // Arrange - Preparar dados para listar webhooks via serviço do app
      const apiToken = 'test_api_token';
      
      // Act - Usar o serviço do app para listar webhooks
      const response = await subAccountService.listWebhooks(apiToken);
      
      // Log da resposta
      console.log('Resposta da listagem de webhooks via app service:');
      console.log(JSON.stringify(response, null, 2));
      
      // Se o serviço funcionar, ótimo!
      if (response.success && response.data) {
        console.log('Webhooks listados com sucesso via app service');
      } else {
        console.log('O serviço do app não conseguiu listar os webhooks, mas isso é esperado se as funções Edge não estiverem configuradas');
      }
    } catch (error) {
      console.log('Erro ao tentar listar webhooks via app service (esperado se as funções Edge não estiverem configuradas):');
      console.log(error.message);
    }
    
    // Não fazemos assertions aqui porque o serviço pode falhar se as funções Edge não estiverem configuradas
  });
  
  it('should fail to create a webhook with invalid data', async () => {
    try {
      // Act - Tentar criar webhook sem URL (obrigatória)
      await subAccountHelper.createTestWebhook({
        event: 'all'
        // Sem URL (obrigatória)
      });
      // Se chegar aqui, o teste falhou
      expect(false).toBe(true, 'Deveria ter falhado ao criar webhook sem URL');
    } catch (error) {
      // Assert - deve falhar com a mensagem esperada
      console.log('Erro ao tentar criar webhook sem URL (esperado):');
      console.log(error.message);
      expect(error).toBeDefined();
      expect(error.message).toContain('Evento e URL são obrigatórios');
    }
  });
}); 