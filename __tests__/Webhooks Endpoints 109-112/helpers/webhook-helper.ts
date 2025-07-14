import { Webhook } from '../../../src/types/webhook';

export const createMockWebhook = (overrides: Partial<Webhook> = {}): Webhook => ({
  id: `wh_${Math.random().toString(36).substring(2, 11)}`,
  url: `https://example.com/webhook/${Math.random().toString(36).substring(2, 11)}`,
  active: true,
  events: ['payment.created', 'payment.updated'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  user_id: `user_${Math.random().toString(36).substring(2, 11)}`,
  ...overrides,
});

export const createMockWebhookList = (count: number, overrides: Partial<Webhook> = {}): Webhook[] => {
    return Array.from({ length: count }, () => createMockWebhook(overrides));
}; 