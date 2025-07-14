// __tests__/User Endpoints 93-98/create-user.test.js
const { createUser } = require('../../src/services/userService');
const supabase = require('../../src/services/supabase').default;
const { createTestUser } = require('../helpers/user-helper');
const { cleanupTestUsers } = require('../helpers/user-cleanup-mock');

describe('POST /users/create (Endpoint 96)', () => {
  let invokeSpy;
  const createdUserIds = [];

  beforeEach(() => {
    jest.resetModules();
    invokeSpy = jest.spyOn(supabase.functions, 'invoke').mockImplementation(async (endpoint, options) => {
      if (endpoint === 'users/create' && options.method === 'POST') {
        const { name, email, phone } = options.body;
        if (!name || !email || !phone) {
          return Promise.resolve({ data: null, error: { message: 'Dados inválidos' } });
        }
        const newUser = createTestUser({ ...options.body });
        createdUserIds.push(newUser.id);
        return Promise.resolve({ data: newUser, error: null });
      }
      return Promise.resolve({ data: null, error: new Error('Endpoint não implementado no mock') });
    });
  });

  afterEach(() => {
    invokeSpy.mockRestore();
  });

  afterAll(async () => {
    await cleanupTestUsers(createdUserIds);
  });

  test('Deve criar um novo usuário com sucesso', async () => {
    const payload = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '123456789',
    };
    const response = await createUser(payload);

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data.name).toBe(payload.name);
    expect(response.data.email).toBe(payload.email);
    expect(response.error).toBeUndefined();
  });

  test('Deve retornar erro se os dados do payload forem inválidos', async () => {
    const payload = {
      name: 'Test User',
      // email is missing
      phone: '123456789',
    };
    const response = await createUser(payload);

    expect(response.success).toBe(false);
    expect(response.data).toBeUndefined();
    expect(response.error).toBeDefined();
    expect(response.error.message).toBe('Dados inválidos');
  });
}); 