const { denyAnticipation } = require('../../src/services/anticipationService');
const supabase = require('../../src/services/supabase').default;
const { createTestAnticipation, cleanupTestAnticipations } = require('../helpers/anticipation-helper');

describe('PATCH /antecipacoes/deny (Endpoint 91)', () => {
  const testAnticipationIds = [];
  const mockAnticipations = {};
  let invokeSpy;

  beforeEach(() => {
    jest.resetModules();
    Object.keys(mockAnticipations).forEach(key => delete mockAnticipations[key]);

    invokeSpy = jest.spyOn(supabase.functions, 'invoke').mockImplementation(async (endpoint, options) => {
      if (endpoint === 'antecipacoes/deny' && options.method === 'PATCH') {
        const { anticipation_id, reason } = options.body;
        const anticipation = mockAnticipations[anticipation_id];
    
        if (!anticipation) {
          return Promise.resolve({ data: null, error: { message: 'Antecipação não encontrada' } });
        }
        if (!reason) {
          return Promise.resolve({ data: null, error: { message: 'O motivo da recusa é obrigatório' } });
        }
    
        anticipation.status = 'refused';
        anticipation.reason_for_denial = reason;
        return Promise.resolve({ data: anticipation, error: null });
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

  test('Deve negar uma antecipação com sucesso', async () => {
    const anticipation = createTestAnticipation({ status: 'pending' });
    mockAnticipations[anticipation.id] = anticipation;
    testAnticipationIds.push(anticipation.id);
    
    const reason = 'Documentação inválida';
    const response = await denyAnticipation({ anticipation_id: anticipation.id, reason });

    expect(response.error).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data.status).toBe('refused');
    expect(response.data.reason_for_denial).toBe(reason);
  });

  test('Deve retornar erro ao negar sem um motivo', async () => {
    const anticipation = createTestAnticipation({ status: 'pending' });
    mockAnticipations[anticipation.id] = anticipation;
    testAnticipationIds.push(anticipation.id);

    const response = await denyAnticipation({ anticipation_id: anticipation.id, reason: '' });
    
    expect(response.error).toBeDefined();
    expect(response.data).toBeUndefined();
  });

  test('Deve retornar erro para uma antecipação inexistente', async () => {
    const nonExistentId = 'non-existent-id';
    const response = await denyAnticipation({ anticipation_id: nonExistentId, reason: 'Motivo qualquer' });

    expect(response.error).toBeDefined();
    expect(response.data).toBeUndefined();
  });
}); 