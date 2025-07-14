import { ManageBalancePayload } from '../../src/types/wallet';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('Wallet Service - manageBalance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should return success when adding balance', async () => {
    const payload: ManageBalancePayload = {
      userId: 'user-123',
      amount: 50,
      type: 'credit',
      reason: 'Promotional credit',
      operation: 'add',
    };

    const { walletService } = await import('../../src/services/walletService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({ error: null });

    const result = await walletService.manageBalance(payload);

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith('wallet/balance-management', {
      method: 'POST',
      body: payload,
    });
  });

  it('should return success when subtracting balance', async () => {
    const payload: ManageBalancePayload = {
      userId: 'user-123',
      amount: 20,
      type: 'debit',
      reason: 'Service fee',
      operation: 'subtract',
    };
    
    const { walletService } = await import('../../src/services/walletService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({ error: null });

    const result = await walletService.manageBalance(payload);

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should return an error for invalid operation that is still a valid type', async () => {
    const payload: ManageBalancePayload = {
      userId: 'user-123',
      amount: 100,
      type: 'adjustment',
      reason: 'Multiply operation',
      operation: 'multiply', // Now a valid operation in the type
    };
    const errorMessage = 'Invalid operation specified';
    
    const { walletService } = await import('../../src/services/walletService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const result = await walletService.manageBalance(payload);

    expect(result.success).toBe(false);
    expect(result.error).toContain(errorMessage);
  });
}); 