import { getAllCompanies } from '../../src/services/companyService';
import { mockCompaniesList } from './helpers/company-helper';
import { supabase } from '../../src/services/supabase';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('getAllCompanies', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all companies when no status is provided', async () => {
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockCompaniesList,
      error: null,
    });

    const response = await getAllCompanies();
    
    expect(response.success).toBe(true);
    expect(response.data).toEqual(mockCompaniesList);
    expect(response.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith('companies', {
      method: 'GET',
      query: undefined,
    });
  });

  it('should return filtered companies when status is provided', async () => {
    const filteredCompanies = mockCompaniesList.filter(company => company.status === 'approved');
    
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: filteredCompanies,
      error: null,
    });

    const response = await getAllCompanies('approved');
    
    expect(response.success).toBe(true);
    expect(response.data).toEqual(filteredCompanies);
    expect(response.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith('companies', {
      method: 'GET',
      query: { status: 'approved' },
    });
  });

  it('should handle API errors', async () => {
    const errorMessage = 'API Error';
    
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const response = await getAllCompanies();
    
    expect(response.success).toBe(false);
    expect(response.data).toBeNull();
    expect(response.error).toBe(errorMessage);
  });

  it('should handle unexpected errors', async () => {
    const errorMessage = 'Unexpected Error';
    
    (supabase.functions.invoke as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const response = await getAllCompanies();
    
    expect(response.success).toBe(false);
    expect(response.data).toBeNull();
    expect(response.error).toBe(errorMessage);
  });
}); 