import { create } from 'zustand';
import { ticketService } from '../services';
import { CreateTicketParams, SendMessageParams, Ticket, TicketMessage, TicketMetrics, UpdateStatusParams } from '../types/ticket';

interface TicketState {
  // State
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  ticketMessages: TicketMessage[];
  ticketMetrics: TicketMetrics | null;
  unreadTickets: Ticket[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTickets: () => Promise<void>;
  fetchTicket: (ticketId: string) => Promise<void>;
  fetchMessages: (ticketId: string, page?: number, perPage?: number) => Promise<void>;
  fetchUnreadMessages: () => Promise<void>;
  fetchMetrics: () => Promise<void>;
  
  createTicket: (params: CreateTicketParams) => Promise<string | null>;
  sendMessage: (params: SendMessageParams) => Promise<boolean>;
  markAsRead: (ticketId: string) => Promise<boolean>;
  updateStatus: (params: UpdateStatusParams) => Promise<boolean>;
  
  selectTicket: (ticket: Ticket | null) => void;
  clearError: () => void;
}

export const useTicketStore = create<TicketState>((set, get) => ({
  // Initial state
  tickets: [],
  selectedTicket: null,
  ticketMessages: [],
  ticketMetrics: null,
  unreadTickets: [],
  loading: false,
  error: null,
  
  // Actions
  fetchTickets: async () => {
    set({ loading: true, error: null });
    try {
      const response = await ticketService.getTickets();
      
      if (response.success && response.data) {
        set({ tickets: response.data });
      } else {
        set({ error: response.error?.message || 'Failed to fetch tickets' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },
  
  fetchTicket: async (ticketId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await ticketService.getTicket(ticketId);
      
      if (response.success && response.data) {
        set({ selectedTicket: response.data });
      } else {
        set({ error: response.error?.message || 'Failed to fetch ticket details' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },
  
  fetchMessages: async (ticketId: string, page = 1, perPage = 20) => {
    set({ loading: true, error: null });
    try {
      const response = await ticketService.getMessages({
        ticket_id: ticketId,
        page,
        per_page: perPage
      });
      
      if (response.success && response.data) {
        set({ ticketMessages: response.data });
      } else {
        set({ error: response.error?.message || 'Failed to fetch ticket messages' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },
  
  fetchUnreadMessages: async () => {
    set({ loading: true, error: null });
    try {
      const response = await ticketService.checkUnreadMessages();
      
      if (response.success && response.data) {
        set({ unreadTickets: response.data.tickets || [] });
      } else {
        set({ error: response.error?.message || 'Failed to check unread messages' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },
  
  fetchMetrics: async () => {
    set({ loading: true, error: null });
    try {
      const response = await ticketService.getMetrics();
      
      if (response.success && response.data) {
        set({ ticketMetrics: response.data });
      } else {
        set({ error: response.error?.message || 'Failed to fetch ticket metrics' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },
  
  createTicket: async (params: CreateTicketParams) => {
    set({ loading: true, error: null });
    try {
      const response = await ticketService.createTicket(params);
      
      if (response.success && response.data) {
        // Refresh tickets list
        get().fetchTickets();
        return response.data.id;
      } else {
        set({ error: response.error?.message || 'Failed to create ticket' });
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage });
      return null;
    } finally {
      set({ loading: false });
    }
  },
  
  sendMessage: async (params: SendMessageParams) => {
    set({ loading: true, error: null });
    try {
      const response = await ticketService.sendMessage(params);
      
      if (response.success) {
        // Refresh messages
        await get().fetchMessages(params.ticket_id);
        return true;
      } else {
        set({ error: response.error?.message || 'Failed to send message' });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage });
      return false;
    } finally {
      set({ loading: false });
    }
  },
  
  markAsRead: async (ticketId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await ticketService.markMessagesAsRead(ticketId);
      
      if (response.success) {
        // Refresh unread messages
        await get().fetchUnreadMessages();
        return true;
      } else {
        set({ error: response.error?.message || 'Failed to mark messages as read' });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage });
      return false;
    } finally {
      set({ loading: false });
    }
  },
  
  updateStatus: async (params: UpdateStatusParams) => {
    set({ loading: true, error: null });
    try {
      const response = await ticketService.updateStatus(params);
      
      if (response.success) {
        // Refresh ticket details
        await get().fetchTicket(params.ticket_id);
        return true;
      } else {
        set({ error: response.error?.message || 'Failed to update ticket status' });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage });
      return false;
    } finally {
      set({ loading: false });
    }
  },
  
  selectTicket: (ticket: Ticket | null) => {
    set({ selectedTicket: ticket });
  },
  
  clearError: () => {
    set({ error: null });
  },
})); 