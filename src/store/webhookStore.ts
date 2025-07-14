import create from 'zustand';
import { webhookService } from '../services/webhookService';
import { CreateWebhookPayload, EditWebhookPayload, Webhook } from '../types/webhook';

interface WebhookState {
  webhooks: Webhook[];
  loading: boolean;
  error: string | null;
  fetchWebhooks: (userId: string) => Promise<void>;
  addWebhook: (payload: CreateWebhookPayload) => Promise<boolean>;
  updateWebhook: (webhookId: string, payload: EditWebhookPayload) => Promise<boolean>;
  removeWebhook: (webhookId: string) => Promise<boolean>;
}

export const useWebhookStore = create<WebhookState>((set, get) => ({
  webhooks: [],
  loading: false,
  error: null,

  fetchWebhooks: async (userId: string) => {
    set({ loading: true, error: null });
    const response = await webhookService.getWebhooks(userId);
    if (response.success && response.data) {
      set({ webhooks: response.data, loading: false });
    } else {
      set({ error: response.error?.message || 'Failed to fetch webhooks', loading: false });
    }
  },

  addWebhook: async (payload: CreateWebhookPayload) => {
    set({ loading: true, error: null });
    const response = await webhookService.createWebhook(payload);
    if (response.success && response.data) {
      set((state) => ({
        webhooks: [...state.webhooks, response.data!],
        loading: false,
      }));
      return true;
    } else {
      set({ error: response.error?.message || 'Failed to create webhook', loading: false });
      return false;
    }
  },

  updateWebhook: async (webhookId: string, payload: EditWebhookPayload) => {
    set({ loading: true, error: null });
    const response = await webhookService.editWebhook(webhookId, payload);
    if (response.success && response.data) {
      set((state) => ({
        webhooks: state.webhooks.map((webhook) =>
          webhook.id === webhookId ? response.data! : webhook
        ),
        loading: false,
      }));
      return true;
    } else {
      set({ error: response.error?.message || 'Failed to update webhook', loading: false });
      return false;
    }
  },

  removeWebhook: async (webhookId: string) => {
    set({ loading: true, error: null });
    const response = await webhookService.deleteWebhook(webhookId);
    if (response.success) {
      set((state) => ({
        webhooks: state.webhooks.filter((webhook) => webhook.id !== webhookId),
        loading: false,
      }));
      return true;
    } else {
      set({ error: response.error?.message || 'Failed to delete webhook', loading: false });
      return false;
    }
  },
})); 