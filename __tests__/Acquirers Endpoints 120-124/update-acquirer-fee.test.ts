import { updateAcquirerFee } from '../../src/services/acquirersService';
import { mockAcquirer, mockAcquirerFees, setupMocks, cleanupMocks } from './helpers/acquirers-helper';
import { UpdateAcquirerFeePayload } from '../../src/types/acquirers';

describe('updateAcquirerFee', () => {
  beforeEach(() => {
    setupMocks();
  });

  afterEach(() => {
    cleanupMocks();
  });

  it('should update fees for an acquirer', async () => {
    const payload: UpdateAcquirerFeePayload = {
      mdr_1x_adquirente: 2.5,
      pix_fee_percentage: 1.5,
      boleto_fee_fixed: 4.0,
    };

    const result = await updateAcquirerFee(mockAcquirer.id, payload);
    
    expect(result).toEqual({
      ...mockAcquirerFees,
      ...payload,
    });
  });

  it('should handle errors when acquirer is not found', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const payload: UpdateAcquirerFeePayload = {
      mdr_1x_adquirente: 2.5,
    };
    
    await expect(updateAcquirerFee('non-existent-id', payload)).rejects.toThrow('Acquirer not found');
  });

  it('should handle API errors', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock the implementation to throw an error
    const mockFrom = jest.fn().mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          append: jest.fn().mockReturnValue({
            single: jest.fn().mockReturnValue({
              data: null,
              error: new Error('API Error'),
            }),
          }),
        }),
      }),
    });

    const originalFrom = require('../../src/services/supabase').supabase.from;
    require('../../src/services/supabase').supabase.from = mockFrom;

    const payload: UpdateAcquirerFeePayload = {
      mdr_1x_adquirente: 2.5,
    };

    await expect(updateAcquirerFee(mockAcquirer.id, payload)).rejects.toThrow('API Error');

    // Restore the original implementation
    require('../../src/services/supabase').supabase.from = originalFrom;
  });
}); 