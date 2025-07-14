import { createCompany } from '../../src/services/companyService';
import { mockCompany } from './helpers/company-helper';
import { CreateCompanyPayload } from '../../src/types/company';
import { supabase } from '../../src/services/supabase';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('createCompany', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a company successfully', async () => {
    const payload: CreateCompanyPayload = {
      name: 'New Test Company',
      tax_id: '12345678901234',
      email: 'contact@newtestcompany.com',
      phone: '+5511999999999',
      website: 'https://newtestcompany.com',
      logo_url: 'https://newtestcompany.com/logo.png',
      address: {
        street: 'New Test Street',
        number: '123',
        complement: 'Suite 456',
        neighborhood: 'New Test Neighborhood',
        city: 'New Test City',
        state: 'TS',
        postal_code: '12345-678',
        country: 'Brazil',
      },
      legal_representative: {
        name: 'Jane Doe',
        email: 'jane@newtestcompany.com',
        phone: '+5511888888888',
        tax_id: '12345678901',
        birth_date: '1980-01-01',
      },
    };

    const newCompany = {
      ...payload,
      id: 'new-company-id',
      status: 'pending',
      created_at: expect.any(String),
      updated_at: expect.any(String),
    };

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: newCompany,
      error: null,
    });

    const response = await createCompany(payload);
    
    expect(response.success).toBe(true);
    expect(response.data).toEqual(expect.objectContaining({
      ...payload,
      id: expect.any(String),
    }));
    expect(response.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith('companies', {
      method: 'POST',
      body: payload,
    });
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Tax ID already exists';
    
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const payload: CreateCompanyPayload = {
      name: 'New Test Company',
      tax_id: '12345678901234',
      email: 'contact@newtestcompany.com',
    };

    const response = await createCompany(payload);
    
    expect(response.success).toBe(false);
    expect(response.data).toBeNull();
    expect(response.error).toBe(errorMessage);
  });

  it('should handle unexpected errors', async () => {
    const errorMessage = 'Unexpected Error';
    
    (supabase.functions.invoke as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const payload: CreateCompanyPayload = {
      name: 'New Test Company',
      tax_id: '12345678901234',
      email: 'contact@newtestcompany.com',
    };

    const response = await createCompany(payload);
    
    expect(response.success).toBe(false);
    expect(response.data).toBeNull();
    expect(response.error).toBe(errorMessage);
  });
}); 