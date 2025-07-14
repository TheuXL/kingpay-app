import {
    CreateTicketParams,
    GetMessagesParams,
    SendMessageParams,
    Ticket,
    TicketMessage,
    TicketMetrics,
    TicketResponse,
    UpdateStatusParams
} from '../types/ticket';
import { supabase } from './supabase';

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
  }: CreateTicketParams): Promise<TicketResponse<Ticket>> => {
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
        return { success: false, error: { message: error.message } };
      }

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, error: { message: errorMessage } };
    }
  },

  /**
   * Get all tickets for the current user
   * Endpoint: POST https://{{base_url}}/functions/v1/support-tickets
   */
  getTickets: async (): Promise<TicketResponse<Ticket[]>> => {
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
        return { success: false, error: { message: error.message } };
      }

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, error: { message: errorMessage } };
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
  }: SendMessageParams): Promise<TicketResponse<TicketMessage>> => {
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
        return { success: false, error: { message: error.message } };
      }

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, error: { message: errorMessage } };
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
  }: GetMessagesParams): Promise<TicketResponse<TicketMessage[]>> => {
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
        return { success: false, error: { message: error.message } };
      }

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, error: { message: errorMessage } };
    }
  },

  /**
   * Check if a ticket has unread messages
   * Endpoint: POST https://{{base_url}}/functions/v1/support-tickets
   */
  checkUnreadMessages: async (): Promise<TicketResponse<{ tickets: Ticket[] }>> => {
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
        return { success: false, error: { message: error.message } };
      }

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, error: { message: errorMessage } };
    }
  },

  /**
   * Mark messages in a ticket as read
   * Endpoint: POST https://{{base_url}}/functions/v1/support-tickets
   */
  markMessagesAsRead: async (ticket_id: string): Promise<TicketResponse<{ updated: boolean }>> => {
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
        return { success: false, error: { message: error.message } };
      }

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, error: { message: errorMessage } };
    }
  },

  /**
   * Get a single ticket by ID
   * Endpoint: POST https://{{base_url}}/functions/v1/support-tickets
   */
  getTicket: async (ticket_id: string): Promise<TicketResponse<Ticket>> => {
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
        return { success: false, error: { message: error.message } };
      }

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, error: { message: errorMessage } };
    }
  },

  /**
   * Get ticket metrics
   * Endpoint: POST https://{{base_url}}/functions/v1/support-tickets
   */
  getMetrics: async (): Promise<TicketResponse<TicketMetrics>> => {
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
        return { success: false, error: { message: error.message } };
      }

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, error: { message: errorMessage } };
    }
  },

  /**
   * Update ticket status
   * Endpoint: POST https://{{base_url}}/functions/v1/support-tickets
   */
  updateStatus: async ({ ticket_id, status }: UpdateStatusParams): Promise<TicketResponse<{ updated: boolean }>> => {
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
        return { success: false, error: { message: error.message } };
      }

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, error: { message: errorMessage } };
    }
  },
}; 