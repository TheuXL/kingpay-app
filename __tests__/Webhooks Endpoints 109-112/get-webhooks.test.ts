import { supabase } from '../../src/services/supabase';
import { webhookService } from '../../src/services/webhookService';
import { createMockWebhookList } from './helpers/webhook-helper';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('getWebhooks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of webhooks on success', async () => {
    const mockWebhooks = createMockWebhookList(3);
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockWebhooks,
      error: null,
    });

    const result = await webhookService.getWebhooks('test-user-id');

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockWebhooks);
    expect(result.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith(
      'webhook?user_id=test-user-id&limit=100&offset=0',
      { method: 'GET' }
    );
  });

  it('should return an error message on failure', async () => {
    const errorMessage = 'Failed to fetch webhooks';
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const result = await webhookService.getWebhooks('test-user-id');

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toContain(errorMessage);
  });
}); 