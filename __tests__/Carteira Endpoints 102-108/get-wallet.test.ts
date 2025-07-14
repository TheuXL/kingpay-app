import { Wallet } from '../../src/types/wallet';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('Wallet Service - getWallet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should return wallet information on success', async () => {
    const userId = 'user-123';
    const mockWallet: Wallet = {
      user_id: userId,
      balance: 1500.75,
      currency: 'BRL',
      last_updated: new Date().toISOString(),
      receivables: [
        { amount: 500, due_date: new Date().toISOString(), origin: 'venda_1' },
      ],
    };

    const { walletService } = await import('../../src/services/walletService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockWallet,
      error: null,
    });

    const result = await walletService.getWallet(userId);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockWallet);
    expect(result.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith(`wallet?userId=${userId}`, {
      method: 'GET',
    });
  });

  it('should return an error if the user is not found', async () => {
    const userId = 'not-a-user';
    const errorMessage = 'User not found';

    const { walletService } = await import('../../src/services/walletService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const result = await walletService.getWallet(userId);

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toContain(errorMessage);
  });
}); 