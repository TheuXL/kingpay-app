import { webhookService } from '../../src/services/webhookService';
import { supabase } from '../../src/services/supabase';
import { createMockWebhook } from './helpers/webhook-helper';
import { CreateWebhookPayload } from '../../src/types/webhook';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('createWebhook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the created webhook on success', async () => {
    const mockWebhook = createMockWebhook();
    const payload: CreateWebhookPayload = {
      url: mockWebhook.url,
      ativa: mockWebhook.ativa,
      admin: mockWebhook.admin,
    };
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockWebhook,
      error: null,
    });

    const result = await webhookService.createWebhook(payload);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockWebhook);
    expect(result.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith('webhook', {
      method: 'POST',
      body: payload,
    });
  });

  it('should return an error message on failure', async () => {
    const payload: CreateWebhookPayload = {
      url: 'https://example.com/webhook',
      ativa: true,
      admin: false,
    };
    const errorMessage = 'Failed to create webhook';
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const result = await webhookService.createWebhook(payload);

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toContain(errorMessage);
  });
}); 