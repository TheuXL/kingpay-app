import { getAllAcquirers } from '../../src/services/acquirersService';
import { mockAcquirersList, setupMocks, cleanupMocks } from './helpers/acquirers-helper';

describe('getAllAcquirers', () => {
  beforeEach(() => {
    setupMocks();
  });

  afterEach(() => {
    cleanupMocks();
  });

  it('should fetch all acquirers with default limit', async () => {
    const result = await getAllAcquirers();
    expect(result).toEqual(mockAcquirersList);
  });

  it('should fetch all acquirers with custom limit', async () => {
    const result = await getAllAcquirers(50);
    expect(result).toEqual(mockAcquirersList);
  });

  it('should handle errors', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock the implementation to throw an error
    const mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          data: null,
          error: new Error('Failed to fetch acquirers'),
        }),
      }),
    });

    const originalFrom = require('../../src/services/supabase').supabase.from;
    require('../../src/services/supabase').supabase.from = mockFrom;

    await expect(getAllAcquirers()).rejects.toThrow('Failed to fetch acquirers');

    // Restore the original implementation
    require('../../src/services/supabase').supabase.from = originalFrom;
  });
}); 