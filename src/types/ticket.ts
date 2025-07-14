/**
 * Ticket status types
 */
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

/**
 * Ticket model
 */
export interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  attachment_url?: string;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
  unread_count?: number;
  user?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

/**
 * Ticket message model
 */
export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  attachment_url?: string;
  is_from_support: boolean;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

/**
 * Ticket metrics model
 */
export interface TicketMetrics {
  total_tickets: number;
  open_tickets: number;
  in_progress_tickets: number;
  closed_tickets: number;
  avg_response_time?: number;
  avg_resolution_time?: number;
  tickets_last_7_days: number;
  tickets_last_30_days: number;
}

/**
 * Create ticket parameters
 */
export interface CreateTicketParams {
  subject: string;
  message: string;
  attachment_url?: string;
}

/**
 * Send message parameters
 */
export interface SendMessageParams {
  ticket_id: string;
  message: string;
  attachment_url?: string;
}

/**
 * Get messages parameters
 */
export interface GetMessagesParams {
  ticket_id: string;
  page?: number;
  per_page?: number;
}

/**
 * Update ticket status parameters
 */
export interface UpdateStatusParams {
  ticket_id: string;
  status: TicketStatus;
}

/**
 * Ticket API response
 */
export interface TicketResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
} 