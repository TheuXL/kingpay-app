// __tests__/User Endpoints 93-98/get-users.test.js
const { getUsers } = require('../../src/services/userService');
const supabase = require('../../src/services/supabase').default;
const { createTestUser } = require('../helpers/user-helper');
const { cleanupTestUsers } = require('../helpers/user-cleanup-mock');

describe('GET /users (Endpoint 93)', () => {
  let testUserIds = [];
  let invokeSpy;

  beforeEach(() => {
    jest.resetModules();
    const mockUsers = Array.from({ length: 5 }, () => createTestUser());
    testUserIds = mockUsers.map(u => u.id);

    invokeSpy = jest.spyOn(supabase.functions, 'invoke').mockImplementation(async (endpoint, options) => {
      if (endpoint === 'users' && options.method === 'GET') {
        return Promise.resolve({ data: mockUsers, error: null });
      }
      return Promise.resolve({ data: null, error: new Error('Endpoint não implementado no mock') });
    });
  });

  afterEach(() => {
    invokeSpy.mockRestore();
  });

  afterAll(async () => {
    await cleanupTestUsers(testUserIds);
  });

  test('Deve retornar uma lista de todos os usuários', async () => {
    const response = await getUsers();

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data.length).toBe(5);
    expect(response.error).toBeUndefined();
  });

  test('Deve retornar a estrutura correta para cada usuário', async () => {
    const response = await getUsers();
    const user = response.data[0];

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('phone');
    expect(user).toHaveProperty('company_id');
    expect(user).toHaveProperty('created_at');
    expect(user).toHaveProperty('updated_at');
  });
}); 