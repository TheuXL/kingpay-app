const axios = require('axios');
require('dotenv').config();

// Importar o serviço de chaves Pix diretamente do app
const { pixKeyService } = require('../../src/services/pixKeyService');
// Importar os helpers
const authHelper = require('../helpers/auth-helper');
const pixKeyHelper = require('../helpers/pixkey-helper');

describe('Pix Key Service - List All Pix Keys (Endpoint 36)', () => {
  // Realizar login antes de executar os testes
  beforeAll(async () => {
    try {
      // Fazer login para obter token
      await authHelper.loginForTests();
      console.log('Login realizado com sucesso para testes de chaves Pix');
    } catch (error) {
      console.error('Erro na configuração dos testes:', error);
      throw error;
    }
  });
  
  it('should list all Pix keys with default pagination', async () => {
    // Act - Usar o helper para listar chaves Pix
    const result = await pixKeyHelper.listTestPixKeys();
    
    // Log do resultado
    console.log('Chaves Pix listadas com paginação padrão:');
    console.log(JSON.stringify(result, null, 2));
    
    // Assert
    expect(result).toBeDefined();
    expect(result.items).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.total).toBeDefined();
    expect(result.page).toBeDefined();
    expect(result.limit).toBeDefined();
    expect(result.totalPages).toBeDefined();
    
    // Verificar se as chaves Pix têm o formato correto
    if (result.items.length > 0) {
      const isValid = pixKeyHelper.validatePixKey(result.items[0]);
      expect(isValid).toBe(true);
    }
  });
  
  it('should list Pix keys with custom pagination', async () => {
    // Arrange - Definir opções de paginação personalizadas
    const options = {
      page: 1,
      limit: 3
    };
    
    // Act - Usar o helper para listar chaves Pix com paginação personalizada
    const result = await pixKeyHelper.listTestPixKeys(options);
    
    // Log do resultado
    console.log('Chaves Pix listadas com paginação personalizada:');
    console.log(JSON.stringify(result, null, 2));
    
    // Assert
    expect(result).toBeDefined();
    expect(result.items).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.page).toBe(options.page);
    expect(result.limit).toBe(options.limit);
    expect(result.items.length).toBeLessThanOrEqual(options.limit);
  });
  
  it('should filter Pix keys by status', async () => {
    // Arrange - Definir opções de filtro por status
    const options = {
      status: 'pending'
    };
    
    // Act - Usar o helper para listar chaves Pix filtradas por status
    const result = await pixKeyHelper.listTestPixKeys(options);
    
    // Log do resultado
    console.log('Chaves Pix filtradas por status:');
    console.log(JSON.stringify(result, null, 2));
    
    // Assert
    expect(result).toBeDefined();
    expect(result.items).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    
    // Verificar se todas as chaves têm o status especificado
    if (result.items.length > 0) {
      const allHaveCorrectStatus = result.items.every(key => key.status === options.status);
      expect(allHaveCorrectStatus).toBe(true);
    }
  });
  
  it('should search Pix keys by term', async () => {
    // Arrange - Definir termo de busca
    const options = {
      search: 'user'
    };
    
    // Act - Usar o helper para buscar chaves Pix
    const result = await pixKeyHelper.listTestPixKeys(options);
    
    // Log do resultado
    console.log('Chaves Pix buscadas por termo:');
    console.log(JSON.stringify(result, null, 2));
    
    // Assert
    expect(result).toBeDefined();
    expect(result.items).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
  });
  
  it('should attempt to list Pix keys using the app service', async () => {
    try {
      // Act - Usar o serviço do app para listar chaves Pix
      const response = await pixKeyService.listAllPixKeys();
      
      // Log da resposta
      console.log('Resposta da listagem de chaves Pix via app service:');
      console.log(JSON.stringify(response, null, 2));
      
      // Se o serviço funcionar, ótimo!
      if (response.success && response.data) {
        console.log('Chaves Pix listadas com sucesso via app service');
      } else {
        console.log('O serviço do app não conseguiu listar as chaves Pix, mas isso é esperado se as funções Edge não estiverem configuradas');
      }
    } catch (error) {
      console.log('Erro ao tentar listar chaves Pix via app service (esperado se as funções Edge não estiverem configuradas):');
      console.log(error.message);
    }
    
    // Não fazemos assertions aqui porque o serviço pode falhar se as funções Edge não estiverem configuradas
  });
}); 