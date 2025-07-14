// __tests__/User Endpoints 93-98/get-user-permissions.test.js
const { getUserPermissions } = require('../../src/services/userService');
const supabase = require('../../src/services/supabase').default;
const { createTestUser, createTestPermission } = require('../helpers/user-helper');
const { cleanupTestUsers } = require('../helpers/user-cleanup-mock');

describe('GET /users/{id}/permissions (Endpoint 95)', () => {
  let testUserId;
  let invokeSpy;

  beforeEach(() => {
    jest.resetModules();
    const user = createTestUser();
    testUserId = user.id;
    const permissions = Array.from({ length: 3 }, () => createTestPermission(testUserId));

    invokeSpy = jest.spyOn(supabase.functions, 'invoke').mockImplementation(async (endpoint, options) => {
      const userIdFromUrl = endpoint.split('/')[1];
      if (endpoint === `users/${userIdFromUrl}/permissions` && options.method === 'GET') {
        if (userIdFromUrl === testUserId) {
          return Promise.resolve({ data: permissions, error: null });
        } else {
          return Promise.resolve({ data: null, error: { message: 'Usuário não encontrado' } });
        }
      }
      return Promise.resolve({ data: null, error: new Error('Endpoint não implementado no mock') });
    });
  });

  afterEach(() => {
    invokeSpy.mockRestore();
  });

  afterAll(async () => {
    await cleanupTestUsers([testUserId]);
  });

  test('Deve retornar as permissões para um usuário existente', async () => {
    const response = await getUserPermissions(testUserId);

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data.length).toBe(3);
    expect(response.data[0].user_id).toBe(testUserId);
    expect(response.error).toBeUndefined();
  });

  test('Deve retornar erro para um usuário inexistente', async () => {
    const nonExistentId = 'non-existent-id';
    const response = await getUserPermissions(nonExistentId);

    expect(response.success).toBe(false);
    expect(response.data).toBeUndefined();
    expect(response.error).toBeDefined();
    expect(response.error.message).toBe('Usuário não encontrado');
  });
}); 