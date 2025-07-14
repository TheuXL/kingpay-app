const {
  getAuthToken,
  getInfosAdicionais,
} = require('../helpers/dashboard-helper');

describe('Infos Adicionais Endpoint', () => {
  let authToken;
  
  beforeAll(async () => {
    authToken = await getAuthToken();
  });

  test('Deve retornar informações adicionais com período válido', async () => {
    const startDate = '2023-01-01';
    const endDate = '2024-12-31';

    const data = await getInfosAdicionais(authToken, startDate, endDate);
    
    // Verificar a estrutura da resposta
    expect(data).toBeDefined();
    expect(data).toHaveProperty('fatura_atual');
    expect(data.fatura_atual).toHaveProperty('valor');
    expect(data.fatura_atual).toHaveProperty('data_vencimento');
    expect(data.fatura_atual).toHaveProperty('status');
    expect(data).toHaveProperty('total_clientes');
    expect(data).toHaveProperty('novos_clientes');
    expect(data).toHaveProperty('taxa_retencao');
    
    expect(typeof data.total_clientes).toBe('number');
    expect(typeof data.novos_clientes).toBe('number');
    expect(typeof data.taxa_retencao).toBe('number');
  });

  test('Deve falhar com período inválido', async () => {
    const startDate = 'data-invalida';
    const endDate = '2024-12-31';

    await expect(getInfosAdicionais(authToken, startDate, endDate)).rejects.toThrow();
  });

  test('Deve falhar com token inválido', async () => {
    const startDate = '2023-01-01';
    const endDate = '2024-12-31';
    const invalidToken = 'token-invalido';

    await expect(getInfosAdicionais(invalidToken, startDate, endDate)).rejects.toThrow();
  });
}); 