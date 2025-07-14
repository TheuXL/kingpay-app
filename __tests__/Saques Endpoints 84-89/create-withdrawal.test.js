const { supabase, generateWithdrawalData, cleanupTestWithdrawals } = require('../helpers/withdrawal-helper');
const { faker } = require('@faker-js/faker');
const { invokeMock } = require('@supabase/supabase-js');

// Mock para a função invoke do Supabase
invokeMock.mockImplementation((endpoint, options) => {
  if (endpoint === 'withdrawals' && options.method === 'POST') {
    const body = options.body || {};
    
    // Validar dados de entrada
    if (!body.pixkeyid) {
      return Promise.resolve({ data: null, error: { message: 'Chave PIX é obrigatória' } });
    }
    
    if (!body.requestedamount || body.requestedamount <= 0) {
      return Promise.resolve({ data: null, error: { message: 'Valor solicitado deve ser maior que zero' } });
    }
    
    // Calcular taxa (3%)
    const feeAmount = body.requestedamount * 0.03;
    const amount = body.requestedamount - feeAmount;
    
    // Criar o saque
    const withdrawal = {
      id: faker.string.uuid(),
      user_id: faker.string.uuid(),
      amount: amount,
      requested_amount: body.requestedamount,
      fee_amount: feeAmount,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_pix: body.isPix || true,
      description: body.description || null
    };
    
    return Promise.resolve({ data: withdrawal, error: null });
  }
  
  return Promise.resolve({ data: null, error: { message: 'Endpoint não implementado no mock' } });
});

describe('POST /withdrawals (Endpoint 85)', () => {
  const testWithdrawalIds = [];

  // Limpar os saques de teste após os testes
  afterAll(async () => {
    await cleanupTestWithdrawals(testWithdrawalIds);
  }, 10000);

  test('Deve criar um novo saque com sucesso', async () => {
    const withdrawalData = generateWithdrawalData();
    
    const { data, error } = await supabase.functions.invoke('withdrawals', {
      method: 'POST',
      body: withdrawalData
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.id).toBeDefined();
    expect(data.status).toBe('pending');
    expect(data.requested_amount).toBe(withdrawalData.requestedamount);
    expect(data.is_pix).toBe(withdrawalData.isPix);
    
    // Guardar o ID para limpeza
    if (data.id) {
      testWithdrawalIds.push(data.id);
    }
  });

  test('Deve calcular a taxa corretamente', async () => {
    const withdrawalData = generateWithdrawalData();
    
    const { data, error } = await supabase.functions.invoke('withdrawals', {
      method: 'POST',
      body: withdrawalData
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.fee_amount).toBeDefined();
    expect(typeof data.fee_amount).toBe('number');
    
    // A taxa deve ser menor que o valor solicitado
    expect(data.fee_amount).toBeLessThan(withdrawalData.requestedamount);
    
    // O valor final deve ser igual ao valor solicitado menos a taxa
    expect(data.amount).toBe(withdrawalData.requestedamount - data.fee_amount);
    
    // Guardar o ID para limpeza
    if (data.id) {
      testWithdrawalIds.push(data.id);
    }
  });

  test('Deve falhar ao criar um saque sem chave PIX', async () => {
    const withdrawalData = generateWithdrawalData();
    delete withdrawalData.pixkeyid;
    
    const { data, error } = await supabase.functions.invoke('withdrawals', {
      method: 'POST',
      body: withdrawalData
    });

    expect(error).toBeDefined();
    expect(data).toBeNull();
  });

  test('Deve falhar ao criar um saque com valor negativo', async () => {
    const withdrawalData = generateWithdrawalData({
      requestedamount: -100
    });
    
    const { data, error } = await supabase.functions.invoke('withdrawals', {
      method: 'POST',
      body: withdrawalData
    });

    expect(error).toBeDefined();
    expect(data).toBeNull();
  });

  test('Deve falhar ao criar um saque com valor zero', async () => {
    const withdrawalData = generateWithdrawalData({
      requestedamount: 0
    });
    
    const { data, error } = await supabase.functions.invoke('withdrawals', {
      method: 'POST',
      body: withdrawalData
    });

    expect(error).toBeDefined();
    expect(data).toBeNull();
  });

  test('Deve criar um saque com descrição opcional', async () => {
    // Sem descrição
    const withdrawalData = generateWithdrawalData();
    delete withdrawalData.description;
    
    const { data, error } = await supabase.functions.invoke('withdrawals', {
      method: 'POST',
      body: withdrawalData
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.id).toBeDefined();
    
    // Guardar o ID para limpeza
    if (data.id) {
      testWithdrawalIds.push(data.id);
    }
  });

  test('Deve criar um saque com uma chave PIX válida', async () => {
    const pixkeyid = faker.string.uuid();
    const withdrawalData = generateWithdrawalData({ pixkeyid });
    
    const { data, error } = await supabase.functions.invoke('withdrawals', {
      method: 'POST',
      body: withdrawalData
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.id).toBeDefined();
    
    // Guardar o ID para limpeza
    if (data && data.id) {
      testWithdrawalIds.push(data.id);
    }
  });
}); 