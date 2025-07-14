import { webhookService } from '../../src/services/webhookService';
import { supabase } from '../../src/services/supabase';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('deleteWebhook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return success on successful deletion', async () => {
    const webhookId = 'wh_123';
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: null,
    });

    const result = await webhookService.deleteWebhook(webhookId);

    expect(result.success).toBe(true);
    expect(result.data).toBeNull();
    expect(result.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith(`webhook/${webhookId}`, {
      method: 'DELETE',
    });
  });

  it('should return an error message on failure', async () => {
    const webhookId = 'wh_123';
    const errorMessage = 'Failed to delete webhook';
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const result = await webhookService.deleteWebhook(webhookId);

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toContain(errorMessage);
  });
}); 