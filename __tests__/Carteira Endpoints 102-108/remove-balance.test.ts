import { RemoveBalancePayload } from '../../src/types/wallet';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('Wallet Service - removeBalance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should return success when balance is removed', async () => {
    const payload: RemoveBalancePayload = {
      userId: 'user-123',
      amount: 100,
      type: 'withdrawal',
      reason: 'User withdrawal',
    };

    const { walletService } = await import('../../src/services/walletService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null, // This endpoint might not return data on success
      error: null,
    });

    const result = await walletService.removeBalance(payload);

    expect(result.success).toBe(true);
    expect(result.data).toBeNull();
    expect(result.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith('wallet/remove-balance', {
      method: 'POST',
      body: payload,
    });
  });

  it('should return an error if removing balance fails', async () => {
    const payload: RemoveBalancePayload = {
      userId: 'user-123',
      amount: 10000,
      type: 'withdrawal',
      reason: 'User withdrawal',
    };
    const errorMessage = 'Insufficient balance';

    const { walletService } = await import('../../src/services/walletService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const result = await walletService.removeBalance(payload);

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toContain(errorMessage);
  });

  it('should handle permission errors', async () => {
    const payload: RemoveBalancePayload = {
        userId: 'user-123',
        amount: 100,
        type: 'withdrawal',
        reason: 'User withdrawal',
    };
    const errorMessage = 'User does not have permission';

    const { walletService } = await import('../../src/services/walletService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const result = await walletService.removeBalance(payload);

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toContain(errorMessage);
  });
}); 