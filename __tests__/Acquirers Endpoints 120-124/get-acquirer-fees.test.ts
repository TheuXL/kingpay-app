import { getAcquirerFees } from '../../src/services/acquirersService';
import { mockAcquirer, mockAcquirerFees, setupMocks, cleanupMocks } from './helpers/acquirers-helper';

describe('getAcquirerFees', () => {
  beforeEach(() => {
    setupMocks();
  });

  afterEach(() => {
    cleanupMocks();
  });

  it('should fetch fees for a specific acquirer', async () => {
    const result = await getAcquirerFees(mockAcquirer.id);
    expect(result).toEqual([mockAcquirerFees]);
  });

  it('should handle errors when acquirer is not found', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    await expect(getAcquirerFees('non-existent-id')).rejects.toThrow('Acquirer not found');
  });

  it('should handle API errors', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock the implementation to throw an error
    const mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          append: jest.fn().mockReturnValue({
            data: null,
            error: new Error('API Error'),
          }),
        }),
      }),
    });

    const originalFrom = require('../../src/services/supabase').supabase.from;
    require('../../src/services/supabase').supabase.from = mockFrom;

    await expect(getAcquirerFees(mockAcquirer.id)).rejects.toThrow('API Error');

    // Restore the original implementation
    require('../../src/services/supabase').supabase.from = originalFrom;
  });
}); 