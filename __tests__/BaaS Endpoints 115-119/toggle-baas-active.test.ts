import { baasService } from '../../src/services/baasService';
import { supabase } from '../../src/services/supabase';
import { createMockBaas } from './helpers/baas-helper';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('toggleBaasActive', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should toggle the active status of a BaaS provider on success', async () => {
    const baasId = 'baas_123';
    const mockBaas = createMockBaas({ id: baasId, active: false });
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockBaas,
      error: null,
    });

    const result = await baasService.toggleBaasActive(baasId);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockBaas);
    expect(result.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith(`baas/${baasId}/active`, {
      method: 'PATCH'
    });
  });

  it('should return an error message on failure', async () => {
    const baasId = 'baas_123';
    const errorMessage = 'Failed to toggle BaaS active status';
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const result = await baasService.toggleBaasActive(baasId);

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toContain(errorMessage);
  });
}); 