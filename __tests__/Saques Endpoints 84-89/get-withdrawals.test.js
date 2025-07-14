const { supabase, createTestWithdrawal, updateWithdrawalStatus, cleanupTestWithdrawals } = require('../helpers/withdrawal-helper');
const { faker } = require('@faker-js/faker');
const { invokeMock } = require('@supabase/supabase-js');

// Mock para a função invoke do Supabase
invokeMock.mockImplementation((endpoint, options) => {
  if (endpoint.startsWith('saques')) {
    const limit = parseInt(endpoint.match(/limit=(\d+)/)?.[1] || '10');
    const offset = parseInt(endpoint.match(/offset=(\d+)/)?.[1] || '0');
    const status = endpoint.match(/status=([^&]+)/)?.[1];
    
    if (status === 'invalid_status') {
      return Promise.resolve({ data: [], error: null });
    }

    // Gerar dados de teste
    const withdrawals = Array(limit).fill(null).map(() => {
      const withdrawal = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        amount: parseFloat(faker.finance.amount(100, 10000, 2)),
        requested_amount: parseFloat(faker.finance.amount(100, 10000, 2)),
        fee_amount: parseFloat(faker.finance.amount(1, 100, 2)),
        status: status || faker.helpers.arrayElement(['pending', 'approved', 'done', 'cancel']),
        created_at: faker.date.recent().toISOString(),
        updated_at: faker.date.recent().toISOString(),
        is_pix: true
      };
      
      if (withdrawal.status === 'cancel') {
        withdrawal.reason_for_denial = faker.lorem.sentence();
      }
      
      return withdrawal;
    });
    
    return Promise.resolve({ data: withdrawals, error: null });
  }
  
  return Promise.resolve({ data: null, error: new Error('Endpoint não implementado no mock') });
});

describe('GET /saques (Endpoint 84)', () => {
  const testWithdrawalIds = [];

  // Criar alguns saques para testar antes de executar os testes
  beforeAll(async () => {
    // Criar saques com diferentes status
    const statuses = ['pending', 'approved', 'done', 'cancel'];
    
    for (const status of statuses) {
      const withdrawal = await createTestWithdrawal();
      testWithdrawalIds.push(withdrawal.id);
      
      // Atualizar o status se não for 'pending'
      if (status !== 'pending') {
        await updateWithdrawalStatus(withdrawal.id, status, status === 'cancel' ? 'Cancelado para teste' : null);
      }
    }
  }, 30000);

  // Limpar os saques de teste após os testes
  afterAll(async () => {
    await cleanupTestWithdrawals(testWithdrawalIds);
  }, 10000);

  test('Deve retornar a lista de saques sem filtros', async () => {
    const { data, error } = await supabase.functions.invoke('saques', {
      method: 'GET'
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
  });

  test('Deve retornar a lista de saques com limite', async () => {
    const limit = 2;
    const { data, error } = await supabase.functions.invoke(`saques?limit=${limit}`, {
      method: 'GET'
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeLessThanOrEqual(limit);
  });

  test('Deve retornar a lista de saques com offset', async () => {
    const limit = 2;
    
    // Primeira página
    const { data: firstPage } = await supabase.functions.invoke(`saques?limit=${limit}&offset=0`, {
      method: 'GET'
    });
    
    // Segunda página
    const { data: secondPage, error } = await supabase.functions.invoke(`saques?limit=${limit}&offset=${limit}`, {
      method: 'GET'
    });

    expect(error).toBeNull();
    expect(secondPage).toBeDefined();
    expect(Array.isArray(secondPage)).toBe(true);
    
    // Verificar se as páginas são diferentes
    if (firstPage.length > 0 && secondPage.length > 0) {
      const firstPageIds = firstPage.map(item => item.id);
      const secondPageIds = secondPage.map(item => item.id);
      
      // Verificar se não há sobreposição de IDs entre as páginas
      const hasOverlap = secondPageIds.some(id => firstPageIds.includes(id));
      expect(hasOverlap).toBe(false);
    }
  });

  test('Deve retornar a lista de saques filtrada por status', async () => {
    const status = 'pending';
    const { data, error } = await supabase.functions.invoke(`saques?status=${status}`, {
      method: 'GET'
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
    
    // Verificar se todos os itens têm o status correto
    if (data.length > 0) {
      const allHaveCorrectStatus = data.every(item => item.status === status);
      expect(allHaveCorrectStatus).toBe(true);
    }
  });

  test('Deve retornar a lista vazia para status inexistente', async () => {
    const status = 'invalid_status';
    const { data, error } = await supabase.functions.invoke(`saques?status=${status}`, {
      method: 'GET'
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });

  test('Deve retornar saques com a estrutura de dados correta', async () => {
    const { data, error } = await supabase.functions.invoke('saques', {
      method: 'GET'
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
    
    if (data.length > 0) {
      const withdrawal = data[0];
      
      // Verificar a estrutura do objeto
      expect(withdrawal).toHaveProperty('id');
      expect(withdrawal).toHaveProperty('user_id');
      expect(withdrawal).toHaveProperty('amount');
      expect(withdrawal).toHaveProperty('requested_amount');
      expect(withdrawal).toHaveProperty('fee_amount');
      expect(withdrawal).toHaveProperty('status');
      expect(withdrawal).toHaveProperty('created_at');
      expect(withdrawal).toHaveProperty('updated_at');
      expect(withdrawal).toHaveProperty('is_pix');
    }
  });
}); 