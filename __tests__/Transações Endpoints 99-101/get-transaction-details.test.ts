import { TransactionDetails } from '../../src/types/transactions';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('Transaction Service - getTransactionDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  const mockTransactionDetails: TransactionDetails = {
    id: '1',
    amount: 100,
    status: 'paid',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    company_id: 'company-1',
    payment_method: 'CARD',
    customer_name: 'Test Client 1',
    card_brand: 'visa',
    installments: 1,
    acquirer_name: 'Test Acquirer',
    acquirer_id: 'acquirer-1'
  };

  it('should return transaction details on success', async () => {
    const transactionId = '1';
    const { transactionService } = await import('../../src/services/transactionService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockTransactionDetails,
      error: null,
    });

    const result = await transactionService.getTransactionDetails(transactionId);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockTransactionDetails);
    expect(result.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith('get-transaction-details', {
      method: 'POST',
      body: { id: transactionId },
    });
  });

  it('should return an error if the transaction is not found', async () => {
    const transactionId = 'not-found';
    const errorMessage = 'Transaction not found';
    const { transactionService } = await import('../../src/services/transactionService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const result = await transactionService.getTransactionDetails(transactionId);

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toBe(errorMessage);
  });

  it('should handle network errors or exceptions', async () => {
    const transactionId = '1';
    const errorMessage = 'Network error';
    const { transactionService } = await import('../../src/services/transactionService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const result = await transactionService.getTransactionDetails(transactionId);

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toBe(`An unexpected error occurred: Error: ${errorMessage}`);
  });
});