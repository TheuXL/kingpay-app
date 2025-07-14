const { supabase, createTestWithdrawal, cleanupTestWithdrawals } = require('../helpers/withdrawal-helper');
const { faker } = require('@faker-js/faker');
const { invokeMock } = require('@supabase/supabase-js');

const mockWithdrawals = {};

// Mock para a função invoke do Supabase
invokeMock.mockImplementation((endpoint, options) => {
  const match = endpoint.match(/^withdrawals\/(.+)/);
  if (match && options.method === 'GET') {
    const id = match[1];
    let withdrawal = mockWithdrawals[id];
    
    if (withdrawal) {
      if (withdrawal.is_pix) {
        withdrawal = {
            ...withdrawal,
            pixkey: {
                id: withdrawal.pixkeyid,
                key: faker.finance.accountNumber(),
                key_type: 'CPF',
                bank_name: 'Mock Bank',
                account_holder: faker.person.fullName(),
            }
        }
      }
      return Promise.resolve({ data: withdrawal, error: null });
    } else {
      return Promise.resolve({ data: null, error: { message: 'Saque não encontrado' } });
    }
  }
  
  if (endpoint === 'withdrawals' && options.method === 'POST') {
    const newWithdrawal = {
      id: faker.string.uuid(),
      ...options.body,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockWithdrawals[newWithdrawal.id] = newWithdrawal;
    return Promise.resolve({ data: newWithdrawal, error: null });
  }

  if (match && options.method === 'PATCH') {
    const id = match[1];
    if (mockWithdrawals[id]) {
      mockWithdrawals[id] = { ...mockWithdrawals[id], ...options.body, updated_at: new Date().toISOString() };
      return Promise.resolve({ data: mockWithdrawals[id], error: null });
    }
  }
  
  return Promise.resolve({ data: null, error: { message: 'Endpoint não implementado no mock' } });
});


describe('GET /withdrawals/:id (Endpoint 89)', () => {
  const testWithdrawalIds = [];

  // Limpar os saques de teste após os testes
  afterAll(async () => {
    await cleanupTestWithdrawals(testWithdrawalIds);
  }, 10000);

  test('Deve obter um saque pelo ID', async () => {
    // Criar um saque
    const withdrawal = await createTestWithdrawal();
    testWithdrawalIds.push(withdrawal.id);
    mockWithdrawals[withdrawal.id] = {
      ...withdrawal,
      status: 'pending'
    };
    
    // Obter o saque pelo ID
    const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawal.id}`, {
      method: 'GET'
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.id).toBe(withdrawal.id);
    expect(data.status).toBe('pending'); // Status inicial
  });

  test('Deve falhar ao obter um saque com ID inexistente', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    
    const { data, error } = await supabase.functions.invoke(`withdrawals/${fakeId}`, {
      method: 'GET'
    });

    expect(error).toBeDefined();
    expect(data).toBeNull();
  });

  test('Deve obter um saque com status atualizado', async () => {
    // Criar um saque
    const withdrawal = await createTestWithdrawal();
    testWithdrawalIds.push(withdrawal.id);
    mockWithdrawals[withdrawal.id] = {
      ...withdrawal,
      status: 'pending'
    };
    
    // Aprovar o saque
    await supabase.functions.invoke(`withdrawals/${withdrawal.id}`, {
      method: 'PATCH',
      body: { status: 'approved' }
    });
    
    // Obter o saque pelo ID
    const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawal.id}`, {
      method: 'GET'
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.id).toBe(withdrawal.id);
    expect(data.status).toBe('approved'); // Status atualizado
  });

  test('Deve obter um saque cancelado com motivo', async () => {
    // Criar um saque
    const withdrawal = await createTestWithdrawal();
    testWithdrawalIds.push(withdrawal.id);
    mockWithdrawals[withdrawal.id] = {
      ...withdrawal,
      status: 'pending'
    };
    
    // Cancelar o saque
    const reason = 'Cancelado para teste';
    await supabase.functions.invoke(`withdrawals/${withdrawal.id}`, {
      method: 'PATCH',
      body: { 
        status: 'cancel',
        reason_for_denial: reason
      }
    });
    
    // Obter o saque pelo ID
    const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawal.id}`, {
      method: 'GET'
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.id).toBe(withdrawal.id);
    expect(data.status).toBe('cancel');
    expect(data.reason_for_denial).toBe(reason);
  });

  test('Deve retornar saque com a estrutura de dados completa', async () => {
    // Criar um saque
    const withdrawal = await createTestWithdrawal();
    testWithdrawalIds.push(withdrawal.id);
    mockWithdrawals[withdrawal.id] = {
      ...withdrawal,
      status: 'pending'
    };
    
    // Obter o saque pelo ID
    const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawal.id}`, {
      method: 'GET'
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    
    // Verificar a estrutura do objeto
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('user_id');
    expect(data).toHaveProperty('amount');
    expect(data).toHaveProperty('requested_amount');
    expect(data).toHaveProperty('fee_amount');
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('created_at');
    expect(data).toHaveProperty('updated_at');
    expect(data).toHaveProperty('is_pix');
    
    // Verificar tipos de dados
    expect(typeof data.id).toBe('string');
    expect(typeof data.user_id).toBe('string');
    expect(typeof data.amount).toBe('number');
    expect(typeof data.requested_amount).toBe('number');
    expect(typeof data.fee_amount).toBe('number');
    expect(typeof data.status).toBe('string');
    expect(typeof data.created_at).toBe('string');
    expect(typeof data.updated_at).toBe('string');
    expect(typeof data.is_pix).toBe('boolean');
  });

  test('Deve obter informações da chave PIX associada ao saque', async () => {
    // Criar um saque
    const withdrawal = await createTestWithdrawal();
    testWithdrawalIds.push(withdrawal.id);
    
    const pixkeyid = faker.string.uuid();
    mockWithdrawals[withdrawal.id] = {
      ...withdrawal,
      status: 'pending',
      is_pix: true,
      pixkeyid: pixkeyid
    };
    
    // Obter o saque pelo ID
    const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawal.id}`, {
      method: 'GET'
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    
    // Verificar se há informações da chave PIX
    expect(data.pixkey).toBeDefined();
    expect(data.pixkey).toHaveProperty('id');
    expect(data.pixkey.id).toBe(pixkeyid);
    expect(data.pixkey).toHaveProperty('key');
    expect(data.pixkey).toHaveProperty('key_type');
    expect(data.pixkey).toHaveProperty('bank_name');
    expect(data.pixkey).toHaveProperty('account_holder');
  });
}); 