const {
  getAuthToken,
  getDashboardData,
} = require('../helpers/dashboard-helper');

describe('Dashboard Data Endpoint', () => {
  let authToken;
  
  beforeAll(async () => {
    authToken = await getAuthToken();
  });

  test('Deve retornar dados do dashboard com período válido', async () => {
    const startDate = '2023-01-01';
    const endDate = '2024-12-31';

    const data = await getDashboardData(authToken, startDate, endDate);
    
    // Verificar a estrutura da resposta
    expect(data).toBeDefined();
    expect(typeof data.total_vendas).toBe('number');
    expect(typeof data.taxa_aprovacao).toBe('number');
    expect(typeof data.ticket_medio).toBe('number');
    expect(typeof data.total_transacoes).toBe('number');
    expect(data.projecoes_financeiras).toBeDefined();
    expect(typeof data.projecoes_financeiras.mes_atual).toBe('number');
    expect(typeof data.projecoes_financeiras.proximo_mes).toBe('number');
  });

  test('Deve falhar com período inválido', async () => {
    const startDate = 'data-invalida';
    const endDate = '2024-12-31';

    await expect(getDashboardData(authToken, startDate, endDate)).rejects.toThrow();
  });

  test('Deve falhar com token inválido', async () => {
    const startDate = '2023-01-01';
    const endDate = '2024-12-31';
    const invalidToken = 'token-invalido';

    await expect(getDashboardData(invalidToken, startDate, endDate)).rejects.toThrow();
  });
}); 