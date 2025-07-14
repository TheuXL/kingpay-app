const { faker } = require('@faker-js/faker');
const { getAnticipations } = require('../../src/services/anticipationService');
const supabase = require('../../src/services/supabase').default;
const { createTestAnticipation, cleanupTestAnticipations } = require('../helpers/anticipation-helper');

describe('GET /antecipacoes/anticipations (Endpoint 90)', () => {
  const testAnticipationIds = [];
  let invokeSpy;

  beforeEach(() => {
    jest.resetModules();
    invokeSpy = jest.spyOn(supabase.functions, 'invoke').mockImplementation(async (endpoint, options) => {
      if (endpoint.startsWith('antecipacoes/anticipations')) {
        const url = new URL(`http://localhost?${endpoint.split('?')[1] || ''}`);
        const limit = parseInt(url.searchParams.get('limit') || '10');
        const status = url.searchParams.get('status');
        
        if (status === 'non_existent_status') {
          return Promise.resolve({ data: [], error: null });
        }
    
        const anticipations = Array(limit).fill(null).map(() => createTestAnticipation({ status: status || 'pending' }));
        return Promise.resolve({ data: anticipations, error: null });
      }
      return Promise.resolve({ data: null, error: new Error('Endpoint não implementado no mock') });
    });
  });

  afterEach(() => {
    invokeSpy.mockRestore();
  });

  afterAll(async () => {
    await cleanupTestAnticipations(testAnticipationIds);
  });

  test('Deve retornar a lista de antecipações sem filtros', async () => {
    const response = await getAnticipations();
    expect(response.error).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
    if (response.data) testAnticipationIds.push(...response.data.map(a => a.id));
  });

  test('Deve retornar a lista de antecipações com limite', async () => {
    const limit = 5;
    const response = await getAnticipations({ limit });
    expect(response.error).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data.length).toBe(limit);
    if (response.data) testAnticipationIds.push(...response.data.map(a => a.id));
  });

  test('Deve retornar a lista filtrada por status', async () => {
    const status = 'approved';
    const response = await getAnticipations({ status });
    expect(response.error).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data.every(item => item.status === status)).toBe(true);
    if (response.data) testAnticipationIds.push(...response.data.map(a => a.id));
  });

  test('Deve retornar uma lista vazia para um status que não existe', async () => {
    const response = await getAnticipations({ status: 'non_existent_status' });
    expect(response.error).toBeUndefined();
    expect(response.data).toEqual([]);
  });

  test('Deve retornar antecipações com a estrutura correta', async () => {
    const response = await getAnticipations();
    expect(response.error).toBeUndefined();
    expect(response.data).toBeDefined();

    if (response.data && response.data.length > 0) {
      const anticipation = response.data[0];
      expect(anticipation).toHaveProperty('id');
      expect(anticipation).toHaveProperty('user_id');
      expect(anticipation).toHaveProperty('amount');
      expect(anticipation).toHaveProperty('requested_amount');
      expect(anticipation).toHaveProperty('fee_amount');
      expect(anticipation).toHaveProperty('status');
      expect(anticipation).toHaveProperty('created_at');
      expect(anticipation).toHaveProperty('updated_at');
    }
    if (response.data) testAnticipationIds.push(...response.data.map(a => a.id));
  });
}); 