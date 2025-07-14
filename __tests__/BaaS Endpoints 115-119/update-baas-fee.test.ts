import { baasService } from '../../src/services/baasService';
import { supabase } from '../../src/services/supabase';
import { createMockBaasFee } from './helpers/baas-helper';
import { UpdateBaasFeePayload } from '../../src/types/baas';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('updateBaasFee', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update the fee of a BaaS provider on success', async () => {
    const baasId = 'baas_123';
    const newFee = 2.5;
    const mockFee = createMockBaasFee({ baas_id: baasId, fee_value: newFee });
    const payload: UpdateBaasFeePayload = { fee: newFee };
    
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockFee,
      error: null,
    });

    const result = await baasService.updateBaasFee(baasId, payload);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockFee);
    expect(result.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith(`baas/${baasId}/taxa`, {
      method: 'PATCH',
      body: payload
    });
  });

  it('should return an error message on failure', async () => {
    const baasId = 'baas_123';
    const newFee = 2.5;
    const payload: UpdateBaasFeePayload = { fee: newFee };
    const errorMessage = 'Failed to update BaaS fee';
    
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const result = await baasService.updateBaasFee(baasId, payload);

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toContain(errorMessage);
  });
}); 