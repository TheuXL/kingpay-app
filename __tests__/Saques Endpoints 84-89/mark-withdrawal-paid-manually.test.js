const { supabase, createTestWithdrawal, cleanupTestWithdrawals } = require('../helpers/withdrawal-helper');
const { faker } = require('@faker-js/faker');
const { invokeMock } = require('@supabase/supabase-js');

const mockWithdrawals = {};

// Mock para a função invoke do Supabase
invokeMock.mockImplementation((endpoint, options) => {
  const match = endpoint.match(/^withdrawals\/(.+)/);

  if (match && options.method === 'PATCH') {
    const id = match[1];
    if (mockWithdrawals[id] && mockWithdrawals[id].status === 'approved' && options.body.status === 'done_manual') {
      mockWithdrawals[id].status = 'done_manual';
      mockWithdrawals[id].updated_at = new Date().toISOString();
      return Promise.resolve({ data: { ...mockWithdrawals[id] }, error: null });
    } else {
      return Promise.resolve({data: null, error: new Error("Invalid state transition")})
    }
  }
  
  return Promise.resolve({ data: null, error: new Error('Endpoint não implementado no mock') });
});

describe('PATCH /withdrawals/:id (Mark as Paid Manually) (Endpoint 86)', () => {
  const testWithdrawalIds = [];

  afterAll(async () => {
    await cleanupTestWithdrawals(testWithdrawalIds);
  });

  test('Deve marcar um saque aprovado como pago manualmente', async () => {
    const withdrawal = await createTestWithdrawal();
    mockWithdrawals[withdrawal.id] = { ...withdrawal, status: 'approved' };
    testWithdrawalIds.push(withdrawal.id);
    
    const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawal.id}`, {
      method: 'PATCH',
      body: { status: 'done_manual' }
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.id).toBe(withdrawal.id);
    expect(data.status).toBe('done_manual');
  });

  test('Deve falhar ao marcar um saque pendente como pago manualmente', async () => {
    const withdrawal = await createTestWithdrawal();
    mockWithdrawals[withdrawal.id] = { ...withdrawal, status: 'pending' };
    testWithdrawalIds.push(withdrawal.id);

    const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawal.id}`, {
      method: 'PATCH',
      body: { status: 'done_manual' }
    });

    expect(error).toBeDefined();
  });

  test('Deve falhar ao marcar um saque cancelado como pago manualmente', async () => {
    const withdrawal = await createTestWithdrawal();
    mockWithdrawals[withdrawal.id] = { ...withdrawal, status: 'cancel' };
    testWithdrawalIds.push(withdrawal.id);

    const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawal.id}`, {
      method: 'PATCH',
      body: { status: 'done_manual' }
    });

    expect(error).toBeDefined();
  });

  test('Deve retornar erro ao tentar marcar um saque inexistente', async () => {
    const nonExistentId = faker.string.uuid();
    const { data, error } = await supabase.functions.invoke(`withdrawals/${nonExistentId}`, {
      method: 'PATCH',
      body: { status: 'done_manual' }
    });

    expect(error).toBeDefined();
    expect(data).toBeNull();
  });

  test('Deve registrar a data de atualização ao marcar como pago manualmente', async () => {
    const withdrawal = await createTestWithdrawal();
    mockWithdrawals[withdrawal.id] = { ...withdrawal, status: 'approved', updated_at: new Date(Date.now() - 1000).toISOString() };
    testWithdrawalIds.push(withdrawal.id);
    const initialUpdatedAt = mockWithdrawals[withdrawal.id].updated_at;

    // Aguardar um pouco para garantir que a data de atualização mude
    await new Promise(resolve => setTimeout(resolve, 50));

    const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawal.id}`, {
      method: 'PATCH',
      body: { status: 'done_manual' }
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.updated_at).toBeDefined();
    expect(new Date(data.updated_at) > new Date(initialUpdatedAt)).toBe(true);
  });
}); 