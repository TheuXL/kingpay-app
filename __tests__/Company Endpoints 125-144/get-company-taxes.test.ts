import { getCompanyTaxes } from '../../src/services/companyService';
import { mockCompany, mockCompanyTaxes } from './helpers/company-helper';
import { supabase } from '../../src/services/supabase';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('getCompanyTaxes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return company taxes when valid ID is provided', async () => {
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockCompanyTaxes,
      error: null,
    });

    const response = await getCompanyTaxes(mockCompany.id);
    
    expect(response.success).toBe(true);
    expect(response.data).toEqual(mockCompanyTaxes);
    expect(response.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith(`companies/${mockCompany.id}/taxas`, {
      method: 'GET',
    });
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Taxes not found';
    
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const response = await getCompanyTaxes('invalid-id');
    
    expect(response.success).toBe(false);
    expect(response.data).toBeNull();
    expect(response.error).toBe(errorMessage);
  });

  it('should handle unexpected errors', async () => {
    const errorMessage = 'Unexpected Error';
    
    (supabase.functions.invoke as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const response = await getCompanyTaxes(mockCompany.id);
    
    expect(response.success).toBe(false);
    expect(response.data).toBeNull();
    expect(response.error).toBe(errorMessage);
  });
}); 