import { TransactionSummary } from '../../src/types/transactions';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('Transaction Service - getTransactionsSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules(); // Reset modules to isolate tests
  });

  it('should return transaction summary on success', async () => {
    const mockSummary: TransactionSummary = {
      total_transactions: 50,
      total_volume: 10000,
      chargebacks: 1,
      refunds: 2,
      paid: 45,
      refused: 2,
    };

    // We need to re-import the service inside the test to get the mocked version
    const { transactionService } = await import('../../src/services/transactionService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockSummary,
      error: null,
    });

    const result = await transactionService.getTransactionsSummary();

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockSummary);
    expect(result.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith('get-transactions-summary', {
        method: 'POST',
        body: {},
    });
  });

  it('should return an error if the request fails', async () => {
    const errorMessage = 'Failed to fetch transaction summary';

    const { transactionService } = await import('../../src/services/transactionService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: errorMessage },
    });

    const result = await transactionService.getTransactionsSummary();

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toBe(errorMessage);
    expect(supabase.functions.invoke).toHaveBeenCalledWith('get-transactions-summary', {
        method: 'POST',
        body: {},
    });
  });

  it('should handle network errors or exceptions', async () => {
    const errorMessage = 'Network error';
    
    const { transactionService } = await import('../../src/services/transactionService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const result = await transactionService.getTransactionsSummary();

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toBe(`An unexpected error occurred: Error: ${errorMessage}`);
    expect(supabase.functions.invoke).toHaveBeenCalledWith('get-transactions-summary', {
        method: 'POST',
        body: {},
    });
  });
});