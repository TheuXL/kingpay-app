const { createClient } = require('@supabase/supabase-js');
const { faker } = require('@faker-js/faker');
const { cleanupTestWithdrawals: mockCleanupTestWithdrawals } = require('./test-cleanup-mock');

// Configurar cliente Supabase para testes
const supabaseUrl = process.env.SUPABASE_URL || 'https://ntswqzoftcvzsxwbmsef.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50c3dxem9mdGN2enN4d2Jtc2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MzkyODUsImV4cCI6MjA2NDExNTI4NX0.-UUHbgSHmEd86qgdcwgZ5p6sjBkBOPKNWls9dMaDsgs';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Gera dados de teste para um saque
 * @param {Object} overrides - Campos para sobrescrever os valores padrão
 * @returns {Object} Dados de teste para um saque
 */
const generateWithdrawalData = (overrides = {}) => {
  return {
    pixkeyid: faker.string.uuid(),
    requestedamount: parseFloat(faker.finance.amount(100, 10000, 2)),
    description: faker.lorem.sentence(),
    isPix: true,
    ...overrides
  };
};

/**
 * Cria um saque para testes
 * @param {Object} data - Dados do saque
 * @returns {Promise<Object>} Saque criado
 */
const createTestWithdrawal = async (data = {}) => {
  const withdrawalData = generateWithdrawalData(data);
  
  // Simular a criação de um saque
  // Em um ambiente de teste real, isso chamaria a API
  const withdrawal = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    amount: withdrawalData.requestedamount * 0.97, // Simulando taxa de 3%
    requested_amount: withdrawalData.requestedamount,
    fee_amount: withdrawalData.requestedamount * 0.03,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_pix: withdrawalData.isPix,
    pixkeyid: withdrawalData.pixkeyid,
    description: withdrawalData.description
  };
  
  return withdrawal;
};

/**
 * Atualiza o status de um saque
 * @param {string} withdrawalId - ID do saque
 * @param {string} status - Novo status ('approved', 'done_manual', 'cancel')
 * @param {string} reasonForDenial - Motivo para cancelamento (opcional)
 * @returns {Promise<Object>} Saque atualizado
 */
const updateWithdrawalStatus = async (withdrawalId, status, reasonForDenial = null) => {
  // Simular a atualização de um saque
  // Em um ambiente de teste real, isso chamaria a API
  const withdrawal = {
    id: withdrawalId,
    user_id: faker.string.uuid(),
    amount: parseFloat(faker.finance.amount(100, 10000, 2)) * 0.97,
    requested_amount: parseFloat(faker.finance.amount(100, 10000, 2)),
    fee_amount: parseFloat(faker.finance.amount(100, 10000, 2)) * 0.03,
    status: status,
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
    updated_at: new Date().toISOString(),
    is_pix: true
  };
  
  if (reasonForDenial && status === 'cancel') {
    withdrawal.reason_for_denial = reasonForDenial;
  }
  
  return withdrawal;
};

/**
 * Limpa os saques de teste criados
 * @param {Array<string>} withdrawalIds - IDs dos saques a serem removidos
 */
const cleanupTestWithdrawals = async (withdrawalIds = []) => {
  if (withdrawalIds.length === 0) return;

  // Usar o mock para simular a limpeza
  return mockCleanupTestWithdrawals(withdrawalIds);
};

module.exports = {
  supabase,
  generateWithdrawalData,
  createTestWithdrawal,
  updateWithdrawalStatus,
  cleanupTestWithdrawals
}; 