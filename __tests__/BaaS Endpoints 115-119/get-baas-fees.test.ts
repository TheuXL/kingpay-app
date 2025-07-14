import { baasService } from '../../src/services/baasService';
import { supabase } from '../../src/services/supabase';
import { createMockBaasFeeList } from './helpers/baas-helper';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('getBaasFees', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return fees for a specific BaaS provider on success', async () => {
    const baasId = 'baas_123';
    const mockFees = createMockBaasFeeList(3, baasId);
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockFees,
      error: null,
    });

    const result = await baasService.getBaasFees(baasId);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockFees);
    expect(result.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith(`baas/${baasId}/taxas`, {
      method: 'GET'
    });
  });

  it('should return an error message on failure', async () => {
    const baasId = 'baas_123';
    const errorMessage = 'Failed to fetch BaaS fees';
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const result = await baasService.getBaasFees(baasId);

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toContain(errorMessage);
  });
}); 