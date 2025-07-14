const { approveAnticipation } = require('../../src/services/anticipationService');
const supabase = require('../../src/services/supabase').default;
const { createTestAnticipation, cleanupTestAnticipations } = require('../helpers/anticipation-helper');

describe('POST /antecipacoes/approve (Endpoint 92)', () => {
  const testAnticipationIds = [];
  const mockAnticipations = {};
  let invokeSpy;

  beforeEach(() => {
    jest.resetModules();
    Object.keys(mockAnticipations).forEach(key => delete mockAnticipations[key]);

    invokeSpy = jest.spyOn(supabase.functions, 'invoke').mockImplementation(async (endpoint, options) => {
      if (endpoint === 'antecipacoes/approve' && options.method === 'POST') {
        const { anticipation_id } = options.body;
        const anticipation = mockAnticipations[anticipation_id];
    
        if (!anticipation) {
          return Promise.resolve({ data: null, error: { message: 'Antecipação não encontrada' } });
        }
        if (anticipation.status !== 'pending') {
          return Promise.resolve({ data: null, error: { message: 'Apenas antecipações pendentes podem ser aprovadas' } });
        }
    
        anticipation.status = 'approved';
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

  test('Deve aprovar uma antecipação pendente com sucesso', async () => {
    const anticipation = createTestAnticipation({ status: 'pending' });
    mockAnticipations[anticipation.id] = anticipation;
    testAnticipationIds.push(anticipation.id);
    
    const response = await approveAnticipation({ anticipation_id: anticipation.id });

    expect(response.error).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data.status).toBe('approved');
  });

  test('Deve retornar erro ao aprovar uma antecipação já aprovada', async () => {
    const anticipation = createTestAnticipation({ status: 'approved' });
    mockAnticipations[anticipation.id] = anticipation;
    testAnticipationIds.push(anticipation.id);

    const response = await approveAnticipation({ anticipation_id: anticipation.id });
    
    expect(response.error).toBeDefined();
    expect(response.data).toBeUndefined();
  });

  test('Deve retornar erro ao aprovar uma antecipação recusada', async () => {
    const anticipation = createTestAnticipation({ status: 'refused' });
    mockAnticipations[anticipation.id] = anticipation;
    testAnticipationIds.push(anticipation.id);

    const response = await approveAnticipation({ anticipation_id: anticipation.id });
    
    expect(response.error).toBeDefined();
    expect(response.data).toBeUndefined();
  });

  test('Deve retornar erro para uma antecipação inexistente', async () => {
    const nonExistentId = 'non-existent-id';
    const response = await approveAnticipation({ anticipation_id: nonExistentId });

    expect(response.error).toBeDefined();
    expect(response.data).toBeUndefined();
  });
}); 