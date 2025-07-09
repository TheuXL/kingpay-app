const axios = require('axios');
require('dotenv').config();

// Importar o serviço de autenticação do app
const { authService } = require('../../src/services/authService');

describe('Auth Token Copy Endpoint', () => {
  it('should generate a valid token with correct credentials (copy endpoint)', async () => {
    // Arrange - Use credenciais reais válidas
    const loginParams = {
      email: 'matheuss.devv@gmail.com',
      password: '88338391Mt@'
    };
    
    // Act - Usar o serviço do app em vez de axios
    const response = await authService.login(loginParams);
    
    // Log da resposta completa
    console.log('Resposta completa da API de autenticação (copy endpoint):');
    console.log(JSON.stringify(response, null, 2));
    
    // Assert
    expect(response.access_token).toBeDefined();
    expect(response.refresh_token).toBeDefined();
    expect(response.user).toBeDefined();
    expect(response.error).toBeUndefined();
  });

  it('should fail with incorrect credentials (copy endpoint)', async () => {
    // Arrange - Use credenciais inválidas
    const loginParams = {
      email: 'matheuss.devv@gmail.com',
      password: 'senha_incorreta_real'
    };
    
    // Act - Usar o serviço do app em vez de axios
    const response = await authService.login(loginParams);
    
    // Log da resposta
    console.log('Resposta com credenciais incorretas:');
    console.log(JSON.stringify(response, null, 2));
    
    // Assert - deve conter um erro
    expect(response.error).toBeDefined();
    expect(response.access_token).toBeUndefined();
  });
}); 