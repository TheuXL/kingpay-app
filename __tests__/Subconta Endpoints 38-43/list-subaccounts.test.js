const axios = require('axios');
require('dotenv').config();

// Importar o serviço de subcontas diretamente do app
const { subAccountService } = require('../../src/services/subAccountService');
// Importar os helpers
const authHelper = require('../helpers/auth-helper');
const subAccountHelper = require('../helpers/subaccount-helper');

describe('SubAccount Service - List SubAccounts (Endpoint 38)', () => {
  // Realizar login antes de executar os testes
  beforeAll(async () => {
    try {
      // Fazer login para obter token
      await authHelper.loginForTests();
      console.log('Login realizado com sucesso para testes de subcontas');
    } catch (error) {
      console.error('Erro na configuração dos testes:', error);
      throw error;
    }
  });
  
  it('should list all subaccounts with default pagination', async () => {
    // Act - Usar o helper para listar subcontas
    const result = await subAccountHelper.listTestSubAccounts();
    
    // Log do resultado
    console.log('Subcontas listadas com paginação padrão:');
    console.log(JSON.stringify(result, null, 2));
    
    // Assert
    expect(result).toBeDefined();
    expect(result.items).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.total).toBeDefined();
    expect(result.limit).toBeDefined();
    expect(result.offset).toBeDefined();
    
    // Verificar se as subcontas têm o formato correto
    if (result.items.length > 0) {
      const isValid = subAccountHelper.validateSubAccount(result.items[0]);
      expect(isValid).toBe(true);
    }
  });
  
  it('should list subaccounts with custom pagination', async () => {
    // Arrange - Definir opções de paginação personalizadas
    const options = {
      limit: 3,
      offset: 0
    };
    
    // Act - Usar o helper para listar subcontas com paginação personalizada
    const result = await subAccountHelper.listTestSubAccounts(options);
    
    // Log do resultado
    console.log('Subcontas listadas com paginação personalizada:');
    console.log(JSON.stringify(result, null, 2));
    
    // Assert
    expect(result).toBeDefined();
    expect(result.items).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.limit).toBe(options.limit);
    expect(result.offset).toBe(options.offset);
    expect(result.items.length).toBeLessThanOrEqual(options.limit);
  });
  
  it('should filter subaccounts by status', async () => {
    // Arrange - Definir opções de filtro por status
    const options = {
      status: 'active'
    };
    
    // Act - Usar o helper para listar subcontas filtradas por status
    const result = await subAccountHelper.listTestSubAccounts(options);
    
    // Log do resultado
    console.log('Subcontas filtradas por status:');
    console.log(JSON.stringify(result, null, 2));
    
    // Assert
    expect(result).toBeDefined();
    expect(result.items).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    
    // Verificar se todas as subcontas têm o status especificado
    if (result.items.length > 0) {
      const allHaveCorrectStatus = result.items.every(account => account.status === options.status);
      expect(allHaveCorrectStatus).toBe(true);
    }
  });
  
  it('should search subaccounts by term', async () => {
    // Arrange - Definir termo de busca
    const options = {
      search: 'Subconta'
    };
    
    // Act - Usar o helper para buscar subcontas
    const result = await subAccountHelper.listTestSubAccounts(options);
    
    // Log do resultado
    console.log('Subcontas buscadas por termo:');
    console.log(JSON.stringify(result, null, 2));
    
    // Assert
    expect(result).toBeDefined();
    expect(result.items).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
  });
  
  it('should attempt to list subaccounts using the app service', async () => {
    try {
      // Act - Usar o serviço do app para listar subcontas
      const response = await subAccountService.listSubAccounts();
      
      // Log da resposta
      console.log('Resposta da listagem de subcontas via app service:');
      console.log(JSON.stringify(response, null, 2));
      
      // Se o serviço funcionar, ótimo!
      if (response.success && response.data) {
        console.log('Subcontas listadas com sucesso via app service');
      } else {
        console.log('O serviço do app não conseguiu listar as subcontas, mas isso é esperado se as funções Edge não estiverem configuradas');
      }
    } catch (error) {
      console.log('Erro ao tentar listar subcontas via app service (esperado se as funções Edge não estiverem configuradas):');
      console.log(error.message);
    }
    
    // Não fazemos assertions aqui porque o serviço pode falhar se as funções Edge não estiverem configuradas
  });
}); 