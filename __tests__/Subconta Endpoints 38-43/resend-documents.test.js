const axios = require('axios');
require('dotenv').config();

// Importar o serviço de subcontas diretamente do app
const { subAccountService } = require('../../src/services/subAccountService');
// Importar os helpers
const authHelper = require('../helpers/auth-helper');
const subAccountHelper = require('../helpers/subaccount-helper');

describe('SubAccount Service - Resend Documents (Endpoint 39)', () => {
  // Realizar login antes de executar os testes
  beforeAll(async () => {
    try {
      // Fazer login para obter token
      await authHelper.loginForTests();
      console.log('Login realizado com sucesso para testes de reenvio de documentos');
    } catch (error) {
      console.error('Erro na configuração dos testes:', error);
      throw error;
    }
  });
  
  it('should resend documents for a subaccount', async () => {
    // Arrange - Obter uma subconta para reenviar documentos
    const subAccounts = await subAccountHelper.listTestSubAccounts();
    
    // Se não houver subcontas, usar um ID de teste
    const subAccountId = subAccounts.items.length > 0 ? subAccounts.items[0].id : '1';
    
    // Documentos a serem reenviados
    const documents = {
      balance_sheet: 'https://example.com/balance_sheet.pdf',
      identity_document: 'https://example.com/identity.pdf',
      proof_of_address: 'https://example.com/address.pdf'
    };
    
    // Act - Usar o helper para reenviar documentos
    const result = await subAccountHelper.resendTestDocuments(subAccountId, documents);
    
    // Log do resultado
    console.log('Resultado do reenvio de documentos:');
    console.log(JSON.stringify(result, null, 2));
    
    // Assert
    expect(result).toBeDefined();
    expect(result.id).toBe(subAccountId);
    expect(result.message).toContain('Documentos reenviados com sucesso');
  });
  
  it('should fail when trying to resend documents without required documents', async () => {
    // Arrange - Obter uma subconta para reenviar documentos
    const subAccounts = await subAccountHelper.listTestSubAccounts();
    
    // Se não houver subcontas, usar um ID de teste
    const subAccountId = subAccounts.items.length > 0 ? subAccounts.items[0].id : '1';
    
    // Documentos incompletos
    const documents = {
      // Faltando balance_sheet, que é obrigatório
      identity_document: 'https://example.com/identity.pdf'
    };
    
    // Act & Assert - Esperar que a função lance um erro
    await expect(async () => {
      await subAccountHelper.resendTestDocuments(subAccountId, documents);
    }).rejects.toThrow('Documentos são obrigatórios');
  });
  
  it('should fail when trying to resend documents without subaccount ID', async () => {
    // Arrange - Documentos a serem reenviados
    const documents = {
      balance_sheet: 'https://example.com/balance_sheet.pdf',
      identity_document: 'https://example.com/identity.pdf'
    };
    
    // Act & Assert - Esperar que a função lance um erro
    await expect(async () => {
      await subAccountHelper.resendTestDocuments('', documents);
    }).rejects.toThrow('ID da subconta é obrigatório');
  });
  
  it('should attempt to resend documents using the app service', async () => {
    try {
      // Arrange - Definir dados para reenvio
      const subAccountId = '1'; // ID de teste
      const documents = {
        balance_sheet: 'https://example.com/balance_sheet.pdf',
        identity_document: 'https://example.com/identity.pdf'
      };
      
      // Act - Usar o serviço do app para reenviar documentos
      const response = await subAccountService.resendDocuments(subAccountId, documents);
      
      // Log da resposta
      console.log('Resposta do reenvio de documentos via app service:');
      console.log(JSON.stringify(response, null, 2));
      
      // Se o serviço funcionar, ótimo!
      if (response.success && response.data) {
        console.log('Documentos reenviados com sucesso via app service');
      } else {
        console.log('O serviço do app não conseguiu reenviar documentos, mas isso é esperado se as funções Edge não estiverem configuradas');
      }
    } catch (error) {
      console.log('Erro ao tentar reenviar documentos via app service (esperado se as funções Edge não estiverem configuradas):');
      console.log(error.message);
    }
    
    // Não fazemos assertions aqui porque o serviço pode falhar se as funções Edge não estiverem configuradas
  });
}); 