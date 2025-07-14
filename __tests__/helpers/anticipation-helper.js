const { faker } = require('@faker-js/faker');
const { cleanupTestAnticipations: mockCleanupTestAnticipations } = require('./anticipation-cleanup-mock');

/**
 * Gera dados de teste para uma antecipação
 */
const generateAnticipationData = (overrides = {}) => {
  const requested_amount = parseFloat(faker.finance.amount(100, 10000, 2));
  const fee_amount = requested_amount * 0.1; // 10% fee
  const amount = requested_amount - fee_amount;

  return {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    requested_amount,
    fee_amount,
    amount,
    status: 'pending',
    created_at: faker.date.recent().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    ...overrides,
  };
};

/**
 * Cria um objeto de antecipação para testes
 */
const createTestAnticipation = (data = {}) => {
  return generateAnticipationData(data);
};

/**
 * Limpa as antecipações de teste criadas
 */
const cleanupTestAnticipations = async (anticipationIds = []) => {
  if (anticipationIds.length === 0) return;
  return mockCleanupTestAnticipations(anticipationIds);
};

module.exports = {
  generateAnticipationData,
  createTestAnticipation,
  cleanupTestAnticipations,
}; 