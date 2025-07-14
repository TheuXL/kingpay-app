// __tests__/helpers/user-helper.js
const { faker } = require('@faker-js/faker');

const createTestUser = (overrides = {}) => {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    company_id: faker.string.uuid(),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    ...overrides,
  };
};

const createTestApiKey = (userId) => {
  return {
    id: faker.string.uuid(),
    user_id: userId,
    api_key: `sk_test_${faker.string.alphanumeric(24)}`,
    created_at: faker.date.past().toISOString(),
  };
};

const createTestPermission = (userId) => {
  return {
    id: faker.string.uuid(),
    user_id: userId,
    permission: faker.helpers.arrayElement(['admin', 'editor', 'viewer']),
    created_at: faker.date.past().toISOString(),
  };
};

const createTestCompany = (overrides = {}) => {
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    tax_id: faker.string.numeric(14),
    website: faker.internet.url(),
    created_at: faker.date.past().toISOString(),
    ...overrides,
  };
};

module.exports = {
  createTestUser,
  createTestApiKey,
  createTestPermission,
  createTestCompany,
}; 