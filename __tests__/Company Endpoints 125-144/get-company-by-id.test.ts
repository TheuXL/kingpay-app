import { getCompanyById } from '../../src/services/companyService';
import { mockCompany } from './helpers/company-helper';
import { supabase } from '../../src/services/supabase';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('getCompanyById', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return company details when valid ID is provided', async () => {
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockCompany,
      error: null,
    });

    const response = await getCompanyById(mockCompany.id);
    
    expect(response.success).toBe(true);
    expect(response.data).toEqual(mockCompany);
    expect(response.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith(`companies/${mockCompany.id}`, {
      method: 'GET',
    });
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Company not found';
    
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const response = await getCompanyById('invalid-id');
    
    expect(response.success).toBe(false);
    expect(response.data).toBeNull();
    expect(response.error).toBe(errorMessage);
  });

  it('should handle unexpected errors', async () => {
    const errorMessage = 'Unexpected Error';
    
    (supabase.functions.invoke as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const response = await getCompanyById(mockCompany.id);
    
    expect(response.success).toBe(false);
    expect(response.data).toBeNull();
    expect(response.error).toBe(errorMessage);
  });
}); 