// __tests__/User Endpoints 93-98/register-user-company.test.js
const { registerUserAndCompany } = require('../../src/services/userService');
const supabase = require('../../src/services/supabase').default;
const { createTestUser, createTestCompany } = require('../helpers/user-helper');
const { cleanupTestUsers, cleanupTestCompanies } = require('../helpers/user-cleanup-mock');

describe('POST /users/register (Endpoint 98)', () => {
  let invokeSpy;
  const createdIds = { users: [], companies: [] };

  beforeEach(() => {
    jest.resetModules();
    invokeSpy = jest.spyOn(supabase.functions, 'invoke').mockImplementation(async (endpoint, options) => {
      if (endpoint === 'users/register' && options.method === 'POST') {
        const { user, company } = options.body;
        if (!user || !company || !user.name || !user.email || !company.name || !company.tax_id) {
          return Promise.resolve({ data: null, error: { message: 'Dados inválidos' } });
        }
        
        const newCompany = createTestCompany(company);
        const newUser = createTestUser({ ...user, company_id: newCompany.id, company: newCompany });
        
        createdIds.users.push(newUser.id);
        createdIds.companies.push(newCompany.id);

        return Promise.resolve({ data: newUser, error: null });
      }
      return Promise.resolve({ data: null, error: new Error('Endpoint não implementado no mock') });
    });
  });

  afterEach(() => {
    invokeSpy.mockRestore();
  });

  afterAll(async () => {
    await cleanupTestUsers(createdIds.users);
    await cleanupTestCompanies(createdIds.companies);
  });

  test('Deve registrar um novo usuário e empresa com sucesso', async () => {
    const payload = {
      user: {
        name: 'New Register User',
        email: 'register@example.com',
        phone: '1122334455',
      },
      company: {
        name: 'Registered Inc.',
        tax_id: '11222333000144',
        website: 'https://reginc.com',
      },
    };
    const response = await registerUserAndCompany(payload);

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data.name).toBe(payload.user.name);
    expect(response.data.company).toBeDefined();
    expect(response.data.company.name).toBe(payload.company.name);
    expect(response.error).toBeUndefined();
  });

  test('Deve retornar erro se dados do payload forem inválidos', async () => {
    const payload = {
      user: {
        name: 'Invalid User',
      },
      // company data is missing
    };
    const response = await registerUserAndCompany(payload);

    expect(response.success).toBe(false);
    expect(response.data).toBeUndefined();
    expect(response.error).toBeDefined();
    expect(response.error.message).toBe('Dados inválidos');
  });
}); 