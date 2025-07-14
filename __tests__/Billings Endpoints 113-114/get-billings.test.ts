import { billingService } from '../../src/services/billingService';
import { supabase } from '../../src/services/supabase';
import { createMockBillingList } from './helpers/billing-helper';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('getBillings', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of billings on success', async () => {
    const mockBillings = createMockBillingList(3);
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockBillings,
      error: null,
    });

    const result = await billingService.getBillings();

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockBillings);
    expect(result.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith('billings', {
      method: 'GET'
    });
  });

  it('should return an error message on failure', async () => {
    const errorMessage = 'Failed to fetch billings';
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const result = await billingService.getBillings();

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toContain(errorMessage);
  });
}); 