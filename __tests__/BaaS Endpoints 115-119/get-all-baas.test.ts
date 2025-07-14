import { baasService } from '../../src/services/baasService';
import { supabase } from '../../src/services/supabase';
import { createMockBaasList } from './helpers/baas-helper';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('getAllBaas', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of BaaS providers on success', async () => {
    const mockBaasList = createMockBaasList(3);
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockBaasList,
      error: null,
    });

    const result = await baasService.getAllBaas();

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockBaasList);
    expect(result.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith('baas', {
      method: 'GET'
    });
  });

  it('should return an error message on failure', async () => {
    const errorMessage = 'Failed to fetch BaaS providers';
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const result = await baasService.getAllBaas();

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toContain(errorMessage);
  });
}); 