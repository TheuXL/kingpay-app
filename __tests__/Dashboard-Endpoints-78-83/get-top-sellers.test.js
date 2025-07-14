const {
  getAuthToken,
  getTopSellers,
  getTopSellersReport,
} = require('../helpers/dashboard-helper');

describe('Top Sellers Endpoints', () => {
  let authToken;
  
  beforeAll(async () => {
    authToken = await getAuthToken();
  });

  describe('POST /dados-dashboard/top-sellers', () => {
    test('Deve retornar lista de top sellers com período válido', async () => {
      const startDate = '2023-01-01';
      const endDate = '2024-12-31';

      const data = await getTopSellers(authToken, startDate, endDate);
      
      // Verificar a estrutura da resposta
      expect(Array.isArray(data)).toBe(true);
      
      if (data.length > 0) {
        const seller = data[0];
        expect(seller).toHaveProperty('id');
        expect(seller).toHaveProperty('nome');
        expect(seller).toHaveProperty('email');
        expect(seller).toHaveProperty('total_vendas');
        expect(seller).toHaveProperty('quantidade_vendas');
      }
    });

    test('Deve falhar com período inválido', async () => {
      const startDate = 'data-invalida';
      const endDate = '2024-12-31';

      await expect(getTopSellers(authToken, startDate, endDate)).rejects.toThrow();
    });
  });

  describe('GET /analytics-reports/top-sellers/{startDate}/{endDate}', () => {
    test('Deve retornar lista de top sellers com período válido', async () => {
      const startDate = '2023-01-01';
      const endDate = '2024-12-31';

      const data = await getTopSellersReport(authToken, startDate, endDate);
      
      // Verificar a estrutura da resposta
      expect(Array.isArray(data)).toBe(true);
      
      if (data.length > 0) {
        const seller = data[0];
        expect(seller).toHaveProperty('id');
        expect(seller).toHaveProperty('nome');
        expect(seller).toHaveProperty('email');
        expect(seller).toHaveProperty('total_vendas');
        expect(seller).toHaveProperty('quantidade_vendas');
      }
    });

    test('Deve falhar com período inválido', async () => {
      const startDate = 'data-invalida';
      const endDate = '2024-12-31';

      await expect(getTopSellersReport(authToken, startDate, endDate)).rejects.toThrow();
    });
  });
}); 