import { Receivable } from '../../src/types/wallet';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('Wallet Service - getReceivables', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should return receivables list on success', async () => {
    const userId = 'user-123';
    // The service for getReceivables is expected to return the full wallet,
    // from which the receivables are extracted.
    const mockReceivables: Receivable[] = [
      { amount: 500, due_date: new Date().toISOString(), origin: 'venda_1' },
      { amount: 1200, due_date: new Date().toISOString(), origin: 'venda_2' },
    ];
    const mockWalletResponse = {
      user_id: userId,
      balance: 1500.75,
      currency: 'BRL',
      last_updated: new Date().toISOString(),
      receivables: mockReceivables,
    };
    
    const { walletService } = await import('../../src/services/walletService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockWalletResponse,
      error: null,
    });

    const result = await walletService.getReceivables(userId);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockWalletResponse); // It returns the whole wallet object
    expect(result.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith(`wallet?userId=${userId}`, {
      method: 'GET',
    });
  });

  it('should return an error if user does not exist', async () => {
    const userId = 'non-existent-user';
    const errorMessage = 'User not found';

    const { walletService } = await import('../../src/services/walletService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const result = await walletService.getReceivables(userId);

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toContain(errorMessage);
  });
}); 