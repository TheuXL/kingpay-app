import { updateCompanyTaxes } from '../../src/services/companyService';
import { mockCompany, mockCompanyTaxes } from './helpers/company-helper';
import { UpdateCompanyTaxesPayload } from '../../src/types/company';
import { supabase } from '../../src/services/supabase';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('updateCompanyTaxes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update company taxes successfully', async () => {
    const payload: UpdateCompanyTaxesPayload = {
      pix_fee_percentage: 1.5,
      pix_fee_fixed: 0.75,
      mdr_1x: 2.5,
    };

    const updatedTaxes = {
      ...mockCompanyTaxes,
      ...payload,
    };

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: updatedTaxes,
      error: null,
    });

    const response = await updateCompanyTaxes(mockCompany.id, payload);
    
    expect(response.success).toBe(true);
    expect(response.data).toEqual(updatedTaxes);
    expect(response.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith(`companies/${mockCompany.id}/taxas`, {
      method: 'PATCH',
      body: payload,
    });
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Failed to update taxes';
    
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const payload: UpdateCompanyTaxesPayload = {
      pix_fee_percentage: 1.5,
    };

    const response = await updateCompanyTaxes(mockCompany.id, payload);
    
    expect(response.success).toBe(false);
    expect(response.data).toBeNull();
    expect(response.error).toBe(errorMessage);
  });

  it('should handle unexpected errors', async () => {
    const errorMessage = 'Unexpected Error';
    
    (supabase.functions.invoke as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const payload: UpdateCompanyTaxesPayload = {
      pix_fee_percentage: 1.5,
    };

    const response = await updateCompanyTaxes(mockCompany.id, payload);
    
    expect(response.success).toBe(false);
    expect(response.data).toBeNull();
    expect(response.error).toBe(errorMessage);
  });
}); 