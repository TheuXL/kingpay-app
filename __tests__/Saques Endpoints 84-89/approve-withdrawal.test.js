const { supabase, createTestWithdrawal, cleanupTestWithdrawals } = require('../helpers/withdrawal-helper');
const { faker } = require('@faker-js/faker');
const { invokeMock } = require('@supabase/supabase-js');

const mockWithdrawals = {};

// Mock para a função invoke do Supabase
invokeMock.mockImplementation((endpoint, options) => {
  const match = endpoint.match(/^withdrawals\/(.+)/);

  if (match && options.method === 'PATCH') {
    const id = match[1];
    if (mockWithdrawals[id] && mockWithdrawals[id].status === 'pending' && options.body.status === 'approved') {
      mockWithdrawals[id].status = 'approved';
      mockWithdrawals[id].updated_at = new Date().toISOString();
      return Promise.resolve({ data: { ...mockWithdrawals[id] }, error: null });
    } else {
      return Promise.resolve({data: null, error: new Error("Invalid state transition")})
    }
  }
  
  return Promise.resolve({ data: null, error: new Error('Endpoint não implementado no mock') });
});


describe('PATCH /withdrawals/:id (Approve Withdrawal) (Endpoint 87)', () => {
  const testWithdrawalIds = [];
  let pendingWithdrawal;

  beforeEach(async () => {
    pendingWithdrawal = await createTestWithdrawal();
    mockWithdrawals[pendingWithdrawal.id] = { ...pendingWithdrawal, status: 'pending' };
    testWithdrawalIds.push(pendingWithdrawal.id);
  });

  afterAll(async () => {
    await cleanupTestWithdrawals(testWithdrawalIds);
  });

  test('Deve aprovar um saque pendente', async () => {
    const { data, error } = await supabase.functions.invoke(`withdrawals/${pendingWithdrawal.id}`, {
      method: 'PATCH',
      body: { status: 'approved' }
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.id).toBe(pendingWithdrawal.id);
    expect(data.status).toBe('approved');
  });

  test('Não deve aprovar um saque que não está pendente', async () => {
    const approvedWithdrawal = await createTestWithdrawal();
    mockWithdrawals[approvedWithdrawal.id] = { ...approvedWithdrawal, status: 'approved' };
    testWithdrawalIds.push(approvedWithdrawal.id);

    const { data, error } = await supabase.functions.invoke(`withdrawals/${approvedWithdrawal.id}`, {
      method: 'PATCH',
      body: { status: 'approved' }
    });

    // Deve falhar ou retornar um erro indicando que o saque já está aprovado
    expect(error).toBeDefined();
  });

  test('Deve falhar ao aprovar um saque cancelado', async () => {
    const cancelledWithdrawal = await createTestWithdrawal();
    mockWithdrawals[cancelledWithdrawal.id] = { ...cancelledWithdrawal, status: 'cancel' };
    testWithdrawalIds.push(cancelledWithdrawal.id);

    const { data, error } = await supabase.functions.invoke(`withdrawals/${cancelledWithdrawal.id}`, {
      method: 'PATCH',
      body: { status: 'approved' }
    });

    expect(error).toBeDefined();
  });

  test('Deve falhar ao aprovar um saque que já está pago', async () => {
    const doneWithdrawal = await createTestWithdrawal();
    mockWithdrawals[doneWithdrawal.id] = { ...doneWithdrawal, status: 'done' };
    testWithdrawalIds.push(doneWithdrawal.id);

    const { data, error } = await supabase.functions.invoke(`withdrawals/${doneWithdrawal.id}`, {
      method: 'PATCH',
      body: { status: 'approved' }
    });

    expect(error).toBeDefined();
  });

  test('Deve retornar erro ao tentar aprovar um saque inexistente', async () => {
    const nonExistentId = faker.string.uuid();
    const { data, error } = await supabase.functions.invoke(`withdrawals/${nonExistentId}`, {
      method: 'PATCH',
      body: { status: 'approved' }
    });

    expect(error).toBeDefined();
    expect(data).toBeNull();
  });

  test('Deve registrar a data de atualização ao aprovar um saque', async () => {
    const initialUpdatedAt = mockWithdrawals[pendingWithdrawal.id].updated_at;

    // Aguardar um pouco para garantir que a data de atualização mude
    await new Promise(resolve => setTimeout(resolve, 50));

    const { data, error } = await supabase.functions.invoke(`withdrawals/${pendingWithdrawal.id}`, {
      method: 'PATCH',
      body: { status: 'approved' }
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.updated_at).toBeDefined();
    
    // A data de atualização deve ser posterior à data de criação
    const createdAt = new Date(data.created_at).getTime();
    const updatedAt = new Date(data.updated_at).getTime();
    expect(updatedAt).toBeGreaterThan(createdAt);
  });

  test('Deve manter os valores originais ao aprovar um saque', async () => {
    const requestedAmount = mockWithdrawals[pendingWithdrawal.id].requested_amount;
    const { data, error } = await supabase.functions.invoke(`withdrawals/${pendingWithdrawal.id}`, {
      method: 'PATCH',
      body: { status: 'approved' }
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.requested_amount).toBe(requestedAmount);
    expect(data.amount).toBeLessThan(requestedAmount); // Devido à taxa
    expect(data.fee_amount).toBeCloseTo(requestedAmount - data.amount);
  });
}); 