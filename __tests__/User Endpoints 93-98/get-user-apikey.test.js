// __tests__/User Endpoints 93-98/get-user-apikey.test.js
const { getUserApiKey } = require('../../src/services/userService');
const supabase = require('../../src/services/supabase').default;
const { createTestUser, createTestApiKey } = require('../helpers/user-helper');
const { cleanupTestUsers } = require('../helpers/user-cleanup-mock');

describe('GET /users/{id}/apikey (Endpoint 94)', () => {
  let testUserId;
  let invokeSpy;

  beforeEach(() => {
    jest.resetModules();
    const user = createTestUser();
    testUserId = user.id;
    const apiKey = createTestApiKey(testUserId);

    invokeSpy = jest.spyOn(supabase.functions, 'invoke').mockImplementation(async (endpoint, options) => {
      const userIdFromUrl = endpoint.split('/')[1];
      if (endpoint === `users/${userIdFromUrl}/apikey` && options.method === 'GET') {
        if (userIdFromUrl === testUserId) {
          return Promise.resolve({ data: apiKey, error: null });
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

  test('Deve retornar a chave de API para um usuário existente', async () => {
    const response = await getUserApiKey(testUserId);

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data.user_id).toBe(testUserId);
    expect(response.data.api_key).toMatch(/^sk_test_/);
    expect(response.error).toBeUndefined();
  });

  test('Deve retornar erro para um usuário inexistente', async () => {
    const nonExistentId = 'non-existent-id';
    const response = await getUserApiKey(nonExistentId);

    expect(response.success).toBe(false);
    expect(response.data).toBeUndefined();
    expect(response.error).toBeDefined();
    expect(response.error.message).toBe('Usuário não encontrado');
  });
}); 