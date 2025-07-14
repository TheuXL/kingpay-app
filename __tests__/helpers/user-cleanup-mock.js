// __tests__/helpers/user-cleanup-mock.js
const { invoke } = require('@supabase/supabase-js');

// This is a mock cleanup function. In a real scenario, this would
// interact with a test database to remove created entities.
const cleanupTestUsers = async (userIds) => {
  if (userIds && userIds.length > 0) {
    console.log(`[MOCK] Limpando usuários de teste: ${userIds.join(', ')}`);
    // Mocked call to a cleanup endpoint or direct db interaction
    // await invoke('cleanup-test-users', { body: { userIds } });
  }
  return Promise.resolve();
};

const cleanupTestCompanies = async (companyIds) => {
    if (companyIds && companyIds.length > 0) {
      console.log(`[MOCK] Limpando empresas de teste: ${companyIds.join(', ')}`);
      // Mocked call to a cleanup endpoint or direct db interaction
      // await invoke('cleanup-test-companies', { body: { companyIds } });
    }
    return Promise.resolve();
  };

module.exports = {
  cleanupTestUsers,
  cleanupTestCompanies,
}; 