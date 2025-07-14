import { Transaction, TransactionFilters } from '../../src/types/transactions';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('Transaction Service - getAllTransactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  const mockTransactions: Transaction[] = [
    { id: '1', amount: 100, status: 'paid', created_at: new Date().toISOString(), company_id: 'company-1', payment_method: 'PIX', updated_at: new Date().toISOString() },
    { id: '2', amount: 200, status: 'pending', created_at: new Date().toISOString(), company_id: 'company-1', payment_method: 'CARD', updated_at: new Date().toISOString() },
  ];

  it('should return transactions with filters applied', async () => {
    const filters: TransactionFilters = { 
      status: ['paid'], 
      limit: 10,
      offset: 0
    };
    
    const { transactionService } = await import('../../src/services/transactionService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockTransactions,
      error: null,
    });

    const result = await transactionService.getAllTransactions(filters);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockTransactions);
    expect(result.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith('get-all-transactions', {
      method: 'POST',
      body: { filters },
    });
  });

  it('should return all transactions when no filters are provided', async () => {
    const { transactionService } = await import('../../src/services/transactionService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockTransactions,
      error: null,
    });

    const result = await transactionService.getAllTransactions();

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockTransactions);
    expect(result.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith('get-all-transactions', {
      method: 'POST',
      body: { filters: {} },
    });
  });

  it('should return an error if the request fails', async () => {
    const errorMessage = 'Failed to fetch transactions';
    const { transactionService } = await import('../../src/services/transactionService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const result = await transactionService.getAllTransactions();

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toBe(errorMessage);
  });

  it('should handle network errors or exceptions', async () => {
    const errorMessage = 'Network error';
    const { transactionService } = await import('../../src/services/transactionService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const result = await transactionService.getAllTransactions();

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toBe(`An unexpected error occurred: Error: ${errorMessage}`);
  });
});