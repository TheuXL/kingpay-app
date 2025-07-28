export interface Ticket {
  id: string;
  subject: string;
  status: 'pending' | 'open' | 'closed';
  created_at: string;
}

export interface TicketMessage {
  id: string;
  message: string;
  created_at: string;
  is_admin_response: boolean;
  user_id: string;
}

export interface CreateTicketPayload {
    subject: string;
    message: string;
}

export interface SendMessagePayload {
    ticket_id: string;
    message: string;
}
