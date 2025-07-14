const {
  getAuthToken,
  getGraficoData,
} = require('../helpers/dashboard-helper');

describe('Gráfico Data Endpoint', () => {
  let authToken;
  
  beforeAll(async () => {
    authToken = await getAuthToken();
  });

  test('Deve retornar dados do gráfico com período válido', async () => {
    const startDate = '2023-01-01';
    const endDate = '2024-12-31';

    const data = await getGraficoData(authToken, startDate, endDate);
    
    // Verificar a estrutura da resposta
    expect(data).toBeDefined();
    expect(data).toHaveProperty('labels');
    expect(data).toHaveProperty('datasets');
    expect(Array.isArray(data.labels)).toBe(true);
    expect(Array.isArray(data.datasets)).toBe(true);
    
    if (data.datasets.length > 0) {
      const dataset = data.datasets[0];
      expect(dataset).toHaveProperty('data');
      expect(Array.isArray(dataset.data)).toBe(true);
    }
  });

  test('Deve falhar com período inválido', async () => {
    const startDate = 'data-invalida';
    const endDate = '2024-12-31';

    await expect(getGraficoData(authToken, startDate, endDate)).rejects.toThrow();
  });

  test('Deve falhar com token inválido', async () => {
    const startDate = '2023-01-01';
    const endDate = '2024-12-31';
    const invalidToken = 'token-invalido';

    await expect(getGraficoData(invalidToken, startDate, endDate)).rejects.toThrow();
  });
}); 