import { Statement } from '../../src/types/wallet';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('Wallet Service - getStatement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should return statement with default pagination', async () => {
    const userId = 'user-123';
    const mockStatement: Statement = {
      user_id: userId,
      entries: [
        { id: 't1', date: new Date().toISOString(), description: 'Credit card sale', amount: 250, type: 'credit', balance_after: 1750.75 },
        { id: 't2', date: new Date().toISOString(), description: 'Withdrawal fee', amount: 5, type: 'debit', balance_after: 1745.75 },
      ],
      pagination: { limit: 10, offset: 0, total_count: 2 },
    };

    const { walletService } = await import('../../src/services/walletService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockStatement,
      error: null,
    });

    const result = await walletService.getStatement(userId);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockStatement);
    expect(supabase.functions.invoke).toHaveBeenCalledWith(`extrato/${userId}?limit=10&offset=0`, {
      method: 'GET',
    });
  });

  it('should return statement with custom pagination', async () => {
    const userId = 'user-123';
    const limit = 5;
    const offset = 5;

    const { walletService } = await import('../../src/services/walletService');
    const { supabase } = await import('../../src/services/supabase');

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: { entries: [], pagination: { limit, offset, total_count: 10 } },
      error: null,
    });

    await walletService.getStatement(userId, limit, offset);

    expect(supabase.functions.invoke).toHaveBeenCalledWith(`extrato/${userId}?limit=5&offset=5`, {
      method: 'GET',
    });
  });
}); 