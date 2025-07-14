import { toggleAcquirerActive } from '../../src/services/acquirersService';
import { mockAcquirer, setupMocks, cleanupMocks } from './helpers/acquirers-helper';
import { UpdateAcquirerActivePayload } from '../../src/types/acquirers';

describe('toggleAcquirerActive', () => {
  beforeEach(() => {
    setupMocks();
  });

  afterEach(() => {
    cleanupMocks();
  });

  it('should toggle payment methods for an acquirer', async () => {
    const payload: UpdateAcquirerActivePayload = {
      acquirers_pix: false,
      acquirers_boleto: true,
      acquirers_card: false,
    };

    const result = await toggleAcquirerActive(mockAcquirer.id, payload);
    
    expect(result).toEqual({
      ...mockAcquirer,
      ...payload,
    });
  });

  it('should handle errors when acquirer is not found', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const payload: UpdateAcquirerActivePayload = {
      acquirers_pix: false,
      acquirers_boleto: true,
      acquirers_card: false,
    };
    
    await expect(toggleAcquirerActive('non-existent-id', payload)).rejects.toThrow('Acquirer not found');
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

    const payload: UpdateAcquirerActivePayload = {
      acquirers_pix: false,
      acquirers_boleto: true,
      acquirers_card: false,
    };

    await expect(toggleAcquirerActive(mockAcquirer.id, payload)).rejects.toThrow('API Error');

    // Restore the original implementation
    require('../../src/services/supabase').supabase.from = originalFrom;
  });
}); 