import { billingService } from '../../src/services/billingService';
import { supabase } from '../../src/services/supabase';
import { PayBillingPayload } from '../../src/types/billing';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('payBilling', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully pay a billing', async () => {
    const mockResponse = {
      success: true,
      message: 'Billing paid successfully',
    };
    
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockResponse,
      error: null,
    });

    const payload: PayBillingPayload = { billingId: 'bill_123' };
    const result = await billingService.payBilling(payload);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockResponse);
    expect(result.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith('billings/pay', {
      method: 'PATCH',
      body: payload,
    });
  });

  it('should return an error message on failure', async () => {
    const errorMessage = 'Failed to pay billing';
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const payload: PayBillingPayload = { billingId: 'bill_123' };
    const result = await billingService.payBilling(payload);

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toContain(errorMessage);
  });
}); 