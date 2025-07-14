import { webhookService } from '../../src/services/webhookService';
import { supabase } from '../../src/services/supabase';
import { createMockWebhook } from './helpers/webhook-helper';
import { EditWebhookPayload } from '../../src/types/webhook';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

describe('editWebhook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the updated webhook on success', async () => {
    const webhookId = 'wh_123';
    const mockWebhook = createMockWebhook({ id: webhookId });
    const payload: EditWebhookPayload = {
      url: 'https://example.com/new-url',
      ativa: !mockWebhook.ativa,
      admin: mockWebhook.admin,
    };
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: { ...mockWebhook, ...payload },
      error: null,
    });

    const result = await webhookService.editWebhook(webhookId, payload);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ ...mockWebhook, ...payload });
    expect(result.error).toBeNull();
    expect(supabase.functions.invoke).toHaveBeenCalledWith(`webhook/${webhookId}`, {
      method: 'PUT',
      body: payload,
    });
  });

  it('should return an error message on failure', async () => {
    const webhookId = 'wh_123';
    const payload: EditWebhookPayload = {
      url: 'https://example.com/new-url',
      ativa: false,
      admin: false,
    };
    const errorMessage = 'Failed to edit webhook';
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const result = await webhookService.editWebhook(webhookId, payload);

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toContain(errorMessage);
  });
}); 