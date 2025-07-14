import { getAcquirerById } from '../../src/services/acquirersService';
import { mockAcquirer, setupMocks, cleanupMocks } from './helpers/acquirers-helper';

describe('getAcquirerById', () => {
  beforeEach(() => {
    setupMocks();
  });

  afterEach(() => {
    cleanupMocks();
  });

  it('should fetch an acquirer by ID', async () => {
    const result = await getAcquirerById(mockAcquirer.id);
    expect(result).toEqual(mockAcquirer);
  });

  it('should handle errors when acquirer is not found', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    await expect(getAcquirerById('non-existent-id')).rejects.toThrow('Acquirer not found');
  });

  it('should handle API errors', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock the implementation to throw an error
    const mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockReturnValue({
            data: null,
            error: new Error('API Error'),
          }),
        }),
      }),
    });

    const originalFrom = require('../../src/services/supabase').supabase.from;
    require('../../src/services/supabase').supabase.from = mockFrom;

    await expect(getAcquirerById(mockAcquirer.id)).rejects.toThrow('API Error');

    // Restore the original implementation
    require('../../src/services/supabase').supabase.from = originalFrom;
  });
}); 