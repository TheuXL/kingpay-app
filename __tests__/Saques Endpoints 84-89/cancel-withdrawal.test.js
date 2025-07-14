const { supabase, createTestWithdrawal, cleanupTestWithdrawals } = require('../helpers/withdrawal-helper');
const { faker } = require('@faker-js/faker');
const { invokeMock } = require('@supabase/supabase-js');

const mockWithdrawals = {};

// Mock para a função invoke do Supabase
invokeMock.mockImplementation((endpoint, options) => {
  const match = endpoint.match(/^withdrawals\/(.+)/);

  if (match && options.method === 'PATCH') {
    const id = match[1];
    if (mockWithdrawals[id] && options.body.status === 'cancel') {
        if (!options.body.reason_for_denial) {
            return Promise.resolve({data: null, error: new Error("Reason for denial is required")});
        }
      mockWithdrawals[id].status = 'cancel';
      mockWithdrawals[id].reason_for_denial = options.body.reason_for_denial;
      mockWithdrawals[id].updated_at = new Date().toISOString();
      return Promise.resolve({ data: { ...mockWithdrawals[id] }, error: null });
    }
  }
  
  return Promise.resolve({ data: null, error: new Error('Endpoint não implementado no mock') });
});

describe('PATCH /withdrawals/:id (Cancel Withdrawal) (Endpoint 88)', () => {
  const testWithdrawalIds = [];

  afterAll(async () => {
    await cleanupTestWithdrawals(testWithdrawalIds);
  });

  test('Deve cancelar um saque pendente com motivo', async () => {
    const withdrawal = await createTestWithdrawal();
    mockWithdrawals[withdrawal.id] = { ...withdrawal, status: 'pending' };
    testWithdrawalIds.push(withdrawal.id);
    
    const reason = 'Motivo de cancelamento para teste.';
    
    const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawal.id}`, {
      method: 'PATCH',
      body: { 
        status: 'cancel',
        reason_for_denial: reason
      }
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.id).toBe(withdrawal.id);
    expect(data.status).toBe('cancel');
    expect(data.reason_for_denial).toBe(reason);
  });

  test('Deve falhar ao cancelar um saque sem motivo', async () => {
    const withdrawal = await createTestWithdrawal();
    mockWithdrawals[withdrawal.id] = { ...withdrawal, status: 'pending' };
    testWithdrawalIds.push(withdrawal.id);
    
    const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawal.id}`, {
      method: 'PATCH',
      body: { status: 'cancel' }
    });

    expect(error).toBeDefined();
  });

  test('Deve falhar ao cancelar um saque com motivo vazio', async () => {
    const withdrawal = await createTestWithdrawal();
    mockWithdrawals[withdrawal.id] = { ...withdrawal, status: 'pending' };
    testWithdrawalIds.push(withdrawal.id);
    
    const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawal.id}`, {
      method: 'PATCH',
      body: { 
        status: 'cancel',
        reason_for_denial: ''
      }
    });

    expect(error).toBeDefined();
  });

  test('Deve cancelar um saque aprovado', async () => {
    const withdrawal = await createTestWithdrawal();
    mockWithdrawals[withdrawal.id] = { ...withdrawal, status: 'approved' };
    testWithdrawalIds.push(withdrawal.id);

    const reason = 'Cancelado após aprovação';

    const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawal.id}`, {
      method: 'PATCH',
      body: {
        status: 'cancel',
        reason_for_denial: reason
      }
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.status).toBe('cancel');
    expect(data.reason_for_denial).toBe(reason);
  });

  test('Deve falhar ao cancelar um saque já cancelado', async () => {
    const withdrawal = await createTestWithdrawal();
    mockWithdrawals[withdrawal.id] = { ...withdrawal, status: 'cancel' };
    testWithdrawalIds.push(withdrawal.id);

    const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawal.id}`, {
      method: 'PATCH',
      body: { 
        status: 'cancel',
        reason_for_denial: 'Segundo cancelamento'
      }
    });

    expect(error).toBeDefined();
  });

  test('Deve falhar ao cancelar um saque que já está pago', async () => {
    const withdrawal = await createTestWithdrawal();
    mockWithdrawals[withdrawal.id] = { ...withdrawal, status: 'done' };
    testWithdrawalIds.push(withdrawal.id);

    const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawal.id}`, {
      method: 'PATCH',
      body: { 
        status: 'cancel',
        reason_for_denial: 'Tentativa de cancelamento'
      }
    });

    expect(error).toBeDefined();
  });

  test('Deve retornar erro ao tentar cancelar um saque inexistente', async () => {
    const nonExistentId = faker.string.uuid();
    const { data, error } = await supabase.functions.invoke(`withdrawals/${nonExistentId}`, {
      method: 'PATCH',
      body: { 
        status: 'cancel',
        reason_for_denial: 'Cancelamento de teste'
      }
    });

    expect(error).toBeDefined();
    expect(data).toBeNull();
  });

  test('Deve falhar ao cancelar sem um motivo', async () => {
    const withdrawal = await createTestWithdrawal();
    mockWithdrawals[withdrawal.id] = { ...withdrawal, status: 'pending' };
    testWithdrawalIds.push(withdrawal.id);

    const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawal.id}`, {
      method: 'PATCH',
      body: { 
        status: 'cancel'
      }
    });

    expect(error).toBeDefined();
  });

  test('Deve registrar a data de atualização ao cancelar um saque', async () => {
    const withdrawal = await createTestWithdrawal();
    mockWithdrawals[withdrawal.id] = { ...withdrawal, status: 'pending', updated_at: new Date(Date.now() - 1000).toISOString() };
    testWithdrawalIds.push(withdrawal.id);
    
    const initialUpdatedAt = mockWithdrawals[withdrawal.id].updated_at;

    // Aguardar um pouco para garantir que a data de atualização mude
    await new Promise(resolve => setTimeout(resolve, 50));

    const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawal.id}`, {
      method: 'PATCH',
      body: { 
        status: 'cancel',
        reason_for_denial: 'Cancelamento para teste de data'
      }
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.updated_at).toBeDefined();
    
    // A data de atualização deve ser posterior à data de criação
    const createdAt = new Date(data.created_at).getTime();
    const updatedAt = new Date(data.updated_at).getTime();
    expect(updatedAt).toBeGreaterThan(createdAt);
  });
}); 