import { calculateTaxes } from '../../src/services/companyService';
import { mockCalculatedTaxes, mockCompany } from './helpers/company-helper';
import { CalculateTaxesPayload } from '../../src/types/company';
import { supabase } from '../../src/services/supabase';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('calculateTaxes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate taxes successfully', async () => {
    const payload: CalculateTaxesPayload = {
      company_id: mockCompany.id,
      valor: 100,
      payment_method: 'credit_card',
      parcelas: 1,
    };

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockCalculatedTaxes,
      error: null,
    });

    const response = await calculateTaxes(payload);
    
    expect(response.success).toBe(true);
    expect(response.data).toEqual(mockCalculatedTaxes);
    expect(response.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith('taxas', {
      method: 'POST',
      body: payload,
    });
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Invalid payment method';
    
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const payload: CalculateTaxesPayload = {
      company_id: mockCompany.id,
      valor: 100,
      payment_method: 'credit_card',
      parcelas: 13, // Invalid number of installments
    };

    const response = await calculateTaxes(payload);
    
    expect(response.success).toBe(false);
    expect(response.data).toBeNull();
    expect(response.error).toBe(errorMessage);
  });

  it('should handle unexpected errors', async () => {
    const errorMessage = 'Unexpected Error';
    
    (supabase.functions.invoke as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const payload: CalculateTaxesPayload = {
      company_id: mockCompany.id,
      valor: 100,
      payment_method: 'credit_card',
    };

    const response = await calculateTaxes(payload);
    
    expect(response.success).toBe(false);
    expect(response.data).toBeNull();
    expect(response.error).toBe(errorMessage);
  });
}); 