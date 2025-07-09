const axios = require('axios');
require('dotenv').config();

// Importar o serviço de códigos de segurança do app
const { securityCodeService } = require('../../src/services/securityCodeService');
// Importar o helper de autenticação
const authHelper = require('../helpers/auth-helper');

describe('Security Code Generation Endpoint', () => {
  // Realizar login antes de executar os testes
  beforeAll(async () => {
    try {
      // Fazer login para obter token
      await authHelper.loginForTests();
      console.log('Login realizado com sucesso para testes de geração de código de segurança');
    } catch (error) {
      console.error('Erro na configuração dos testes:', error);
      throw error;
    }
  });

  it('should generate a security validation code', async () => {
    // Act - Usar o serviço do app em vez de axios
    const response = await securityCodeService.generateCode();
    
    // Log da resposta completa
    console.log('Resposta da geração de código de segurança:');
    console.log(JSON.stringify(response, null, 2));
    
    // Assert
    expect(response.success).toBe(true);
    expect(response.code).toBeDefined();
    expect(response.expires_at).toBeDefined();
    
    console.log(`Código de segurança gerado: ${response.code}`);
  });
}); 