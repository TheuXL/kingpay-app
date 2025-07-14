export interface Webhook {
  id: string;
  user_id: string;
  url: string;
  description?: string;
  events: string[];
  active: boolean;
  admin?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateWebhookPayload {
  url: string;
  description?: string;
  events: string[];
  admin?: boolean;
}

export interface EditWebhookPayload {
  url?: string;
  description?: string;
  events?: string[];
  active?: boolean;
  admin?: boolean;
} 