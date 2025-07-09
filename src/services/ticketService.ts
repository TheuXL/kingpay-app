import { supabase } from './supabase';

interface CreateTicketParams {
  subject: string;
  message: string;
  attachment_url?: string;
}

interface SendMessageParams {
  ticket_id: string;
  message: string;
  attachment_url?: string;
}

interface GetMessagesParams {
  ticket_id: string;
  page?: number;
  per_page?: number;
}

interface UpdateStatusParams {
  ticket_id: string;
  status: 'open' | 'in_progress' | 'closed';
}

interface TicketResponse {
  success: boolean;
  data?: any;
  error?: any;
}

/**
 * Service for handling ticket operations
 */
export const ticketService = {
  /**
   * Create a new support ticket
   * Endpoint: POST https://{{base_url}}/functions/v1/support-tickets
   */
  createTicket: async ({
    subject,
    message,
    attachment_url,
  }: CreateTicketParams): Promise<TicketResponse> => {
    try {
      // Based on the Postman collection, we need to format the request with action and payload
      const payload = {
        action: 'create_ticket',
        payload: {
          subject,
          message,
          attachment_url,
        },
      };

      // Using the correct endpoint from the Postman collection
      const { data, error } = await supabase.functions.invoke('support-tickets', {
        method: 'POST',
        body: payload,
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  },

  /**
   * Get all tickets for the current user
   * Endpoint: POST https://{{base_url}}/functions/v1/support-tickets
   */
  getTickets: async (): Promise<TicketResponse> => {
    try {
      // Based on the Postman collection, we need to use the action-based approach
      const payload = {
        action: 'list_tickets',
        payload: {}
      };

      // Using the correct endpoint from the Postman collection
      const { data, error } = await supabase.functions.invoke('support-tickets', {
        method: 'POST',
        body: payload,
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  },

  /**
   * Send a new message to an existing ticket
   * Endpoint: POST https://{{base_url}}/functions/v1/support-tickets
   */
  sendMessage: async ({
    ticket_id,
    message,
    attachment_url,
  }: SendMessageParams): Promise<TicketResponse> => {
    try {
      const payload = {
        action: 'send_message',
        payload: {
          ticket_id,
          message,
          attachment_url,
        },
      };

      const { data, error } = await supabase.functions.invoke('support-tickets', {
        method: 'POST',
        body: payload,
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  },

  /**
   * Get messages for a specific ticket
   * Endpoint: POST https://{{base_url}}/functions/v1/support-tickets
   */
  getMessages: async ({
    ticket_id,
    page = 1,
    per_page = 20,
  }: GetMessagesParams): Promise<TicketResponse> => {
    try {
      const payload = {
        action: 'get_messages',
        payload: {
          ticket_id,
          page,
          per_page,
        },
      };

      const { data, error } = await supabase.functions.invoke('support-tickets', {
        method: 'POST',
        body: payload,
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  },

  /**
   * Check if a ticket has unread messages
   * Endpoint: POST https://{{base_url}}/functions/v1/support-tickets
   */
  checkUnreadMessages: async (): Promise<TicketResponse> => {
    try {
      const payload = {
        action: 'check_unread_messages',
        payload: {},
      };

      const { data, error } = await supabase.functions.invoke('support-tickets', {
        method: 'POST',
        body: payload,
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  },

  /**
   * Mark messages in a ticket as read
   * Endpoint: POST https://{{base_url}}/functions/v1/support-tickets
   */
  markMessagesAsRead: async (ticket_id: string): Promise<TicketResponse> => {
    try {
      const payload = {
        action: 'mark_messages_as_read',
        payload: {
          ticket_id,
        },
      };

      const { data, error } = await supabase.functions.invoke('support-tickets', {
        method: 'POST',
        body: payload,
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  },

  /**
   * Get a single ticket by ID
   * Endpoint: POST https://{{base_url}}/functions/v1/support-tickets
   */
  getTicket: async (ticket_id: string): Promise<TicketResponse> => {
    try {
      const payload = {
        action: 'get_ticket',
        payload: {
          ticket_id,
        },
      };

      const { data, error } = await supabase.functions.invoke('support-tickets', {
        method: 'POST',
        body: payload,
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  },

  /**
   * Get ticket metrics
   * Endpoint: POST https://{{base_url}}/functions/v1/support-tickets
   */
  getMetrics: async (): Promise<TicketResponse> => {
    try {
      const payload = {
        action: 'get_metrics',
        payload: {},
      };

      const { data, error } = await supabase.functions.invoke('support-tickets', {
        method: 'POST',
        body: payload,
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  },

  /**
   * Update ticket status
   * Endpoint: POST https://{{base_url}}/functions/v1/support-tickets
   */
  updateStatus: async ({ ticket_id, status }: UpdateStatusParams): Promise<TicketResponse> => {
    try {
      const payload = {
        action: 'update_status',
        payload: {
          ticket_id,
          status,
        },
      };

      const { data, error } = await supabase.functions.invoke('support-tickets', {
        method: 'POST',
        body: payload,
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  },
}; 