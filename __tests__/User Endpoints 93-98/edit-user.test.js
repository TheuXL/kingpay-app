// __tests__/User Endpoints 93-98/edit-user.test.js
const { editUser } = require('../../src/services/userService');
const supabase = require('../../src/services/supabase').default;
const { createTestUser } = require('../helpers/user-helper');
const { cleanupTestUsers } = require('../helpers/user-cleanup-mock');

describe('PATCH /users/{id}/edit (Endpoint 97)', () => {
  let testUser;
  let invokeSpy;

  beforeEach(() => {
    jest.resetModules();
    testUser = createTestUser();

    invokeSpy = jest.spyOn(supabase.functions, 'invoke').mockImplementation(async (endpoint, options) => {
      const userIdFromUrl = endpoint.split('/')[1];
      if (endpoint === `users/${userIdFromUrl}/edit` && options.method === 'PATCH') {
        if (userIdFromUrl === testUser.id) {
          const updatedUser = { ...testUser, ...options.body, updated_at: new Date().toISOString() };
          return Promise.resolve({ data: updatedUser, error: null });
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
    await cleanupTestUsers([testUser.id]);
  });

  test('Deve editar um usuário existente com sucesso', async () => {
    const payload = {
      name: 'Updated Name',
      phone: '987654321',
    };
    const response = await editUser(testUser.id, payload);

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data.id).toBe(testUser.id);
    expect(response.data.name).toBe(payload.name);
    expect(response.data.phone).toBe(payload.phone);
    expect(response.data.email).toBe(testUser.email); // Should not change
    expect(response.error).toBeUndefined();
  });

  test('Deve retornar erro ao tentar editar um usuário inexistente', async () => {
    const nonExistentId = 'non-existent-id';
    const payload = { name: 'New Name' };
    const response = await editUser(nonExistentId, payload);

    expect(response.success).toBe(false);
    expect(response.data).toBeUndefined();
    expect(response.error).toBeDefined();
    expect(response.error.message).toBe('Usuário não encontrado');
  });
}); 