const {
  getAuthToken,
  getTopProdutos,
} = require('../helpers/dashboard-helper');

describe('Top Produtos Endpoint', () => {
  let authToken;
  
  beforeAll(async () => {
    authToken = await getAuthToken();
  });

  test('Deve retornar lista de top produtos com período válido', async () => {
    const startDate = '2023-01-01';
    const endDate = '2024-12-31';

    const data = await getTopProdutos(authToken, startDate, endDate);
    
    // Verificar a estrutura da resposta
    expect(Array.isArray(data)).toBe(true);
    
    if (data.length > 0) {
      const produto = data[0];
      expect(produto).toHaveProperty('id');
      expect(produto).toHaveProperty('nome');
      expect(produto).toHaveProperty('preco');
      expect(produto).toHaveProperty('quantidade_vendida');
      expect(produto).toHaveProperty('total_vendido');
    }
  });

  test('Deve falhar com período inválido', async () => {
    const startDate = 'data-invalida';
    const endDate = '2024-12-31';

    await expect(getTopProdutos(authToken, startDate, endDate)).rejects.toThrow();
  });

  test('Deve falhar com token inválido', async () => {
    const startDate = '2023-01-01';
    const endDate = '2024-12-31';
    const invalidToken = 'token-invalido';

    await expect(getTopProdutos(invalidToken, startDate, endDate)).rejects.toThrow();
  });
}); 