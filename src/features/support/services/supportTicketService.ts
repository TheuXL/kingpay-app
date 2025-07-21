/**
 * 🎫 SERVIÇO DE TICKETS DE SUPORTE - KINGPAY
 * ==========================================
 * 
 * Módulo: Tickets de Suporte
 * Endpoint 5 da documentação INTEGRACAO.md
 * 
 * Implementação do sistema de tickets de suporte com ações múltiplas
 * usando um único endpoint com roteamento por action
 */

import { supabase } from '../../../lib/supabase';

export interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  userId: string;
  companyId?: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date;
  unreadMessages: number;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  userId: string;
  userType: 'customer' | 'support' | 'admin';
  message: string;
  attachmentUrl?: string;
  createdAt: Date;
  isRead: boolean;
}

export interface CreateTicketRequest {
  subject: string;
  message: string;
  attachmentUrl?: string;
}

export interface SendMessageRequest {
  ticketId: string;
  message: string;
  attachmentUrl?: string;
}

export interface TicketMetrics {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  averageResponseTime: number;
  satisfactionScore: number;
}

export class SupportTicketService {

  /**
   * Endpoint 5: Gerenciamento de Tickets de Suporte
   * POST /functions/v1/support-tickets
   * 
   * Ponto de entrada único para todas as operações relacionadas a tickets.
   * A ação específica é determinada pelo campo "action" no corpo da requisição.
   */
  private async executeTicketAction<T>(action: string, payload: any = {}): Promise<T> {
    try {
      console.log(`🎫 Executando ação de ticket: ${action}`);

      const { data, error } = await supabase.functions.invoke('support-tickets', {
        method: 'POST',
        body: {
          action,
          payload
        },
      });

      if (error) {
        console.error(`❌ Erro na ação ${action}:`, error.message);
        throw error;
      }

      console.log(`✅ Ação ${action} executada com sucesso`);
      return data;

    } catch (error) {
      console.error(`❌ Erro inesperado na ação ${action}:`, error);
      throw error;
    }
  }

  /**
   * Criar um novo ticket de suporte
   * Action: "create_ticket"
   */
  async createTicket(ticketData: CreateTicketRequest): Promise<SupportTicket> {
    return await this.executeTicketAction<SupportTicket>('create_ticket', ticketData);
  }

  /**
   * Listar tickets do usuário logado
   * Action: "list_tickets"
   */
  async listTickets(page: number = 1, perPage: number = 10): Promise<{ tickets: SupportTicket[]; total: number }> {
    return await this.executeTicketAction<{ tickets: SupportTicket[]; total: number }>('list_tickets', {
      page,
      per_page: perPage
    });
  }

  /**
   * Buscar tickets com filtros
   */
  async getTickets(filters?: {
    status?: string;
    priority?: string;
    userId?: string;
    page?: number;
    perPage?: number;
  }): Promise<{ tickets: SupportTicket[]; total: number }> {
    return await this.executeTicketAction<{ tickets: SupportTicket[]; total: number }>('list_tickets', {
      ...filters,
      page: filters?.page || 1,
      per_page: filters?.perPage || 10
    });
  }

  /**
   * Obter detalhes de um ticket específico
   * Action: "get_ticket"
   */
  async getTicketById(ticketId: string): Promise<SupportTicket> {
    return await this.executeTicketAction<SupportTicket>('get_ticket', { ticket_id: ticketId });
  }

  /**
   * Enviar uma nova mensagem para um ticket
   * Action: "send_message"
   */
  async sendMessage(messageData: SendMessageRequest): Promise<TicketMessage> {
    return await this.executeTicketAction<TicketMessage>('send_message', {
      ticket_id: messageData.ticketId,
      message: messageData.message,
      attachment_url: messageData.attachmentUrl
    });
  }

  /**
   * Obter mensagens de um ticket
   * Action: "get_messages"
   */
  async getTicketMessages(
    ticketId: string,
    page: number = 1,
    perPage: number = 20
  ): Promise<{ messages: TicketMessage[]; total: number }> {
    return await this.executeTicketAction<{ messages: TicketMessage[]; total: number }>('get_messages', {
      ticket_id: ticketId,
      page,
      per_page: perPage
    });
  }

  /**
   * Verificar mensagens não lidas
   * Action: "check_unread_messages"
   */
  async checkUnreadMessages(): Promise<{ count: number; tickets: string[] }> {
    return await this.executeTicketAction<{ count: number; tickets: string[] }>('check_unread_messages');
  }

  /**
   * Marcar mensagens de um ticket como lidas
   * Action: "mark_message_read"
   */
  async markMessagesAsRead(ticketId: string): Promise<{ success: boolean }> {
    return await this.executeTicketAction<{ success: boolean }>('mark_message_read', {
      ticket_id: ticketId
    });
  }

  /**
   * Atualizar status de um ticket
   * Action: "update_status"
   */
  async updateTicketStatus(ticketId: string, status: 'closed' | 'open' | 'in_progress' | 'resolved'): Promise<SupportTicket> {
    return await this.executeTicketAction<SupportTicket>('update_status', {
      ticket_id: ticketId,
      status
    });
  }

  /**
   * Obter métricas de tickets (para administradores)
   * Action: "get_metrics"
   */
  async getTicketMetrics(): Promise<TicketMetrics> {
    return await this.executeTicketAction<TicketMetrics>('get_metrics');
  }

  /**
   * Fechar um ticket
   */
  async closeTicket(ticketId: string): Promise<SupportTicket> {
    return await this.updateTicketStatus(ticketId, 'closed');
  }

  /**
   * Reabrir um ticket
   */
  async reopenTicket(ticketId: string): Promise<SupportTicket> {
    return await this.updateTicketStatus(ticketId, 'open');
  }

  /**
   * Buscar tickets por status
   */
  async getTicketsByStatus(status: string): Promise<SupportTicket[]> {
    const result = await this.getTickets({ status });
    return result.tickets;
  }

  /**
   * Buscar tickets abertos do usuário
   */
  async getOpenTickets(): Promise<SupportTicket[]> {
    return await this.getTicketsByStatus('open');
  }

  /**
   * Buscar tickets fechados do usuário
   */
  async getClosedTickets(): Promise<SupportTicket[]> {
    return await this.getTicketsByStatus('closed');
  }

  /**
   * Obter contagem de tickets não lidos
   */
  async getUnreadTicketsCount(): Promise<number> {
    const result = await this.checkUnreadMessages();
    return result.count;
  }

  /**
   * Buscar ticket com suas mensagens
   */
  async getTicketWithMessages(ticketId: string): Promise<{
    ticket: SupportTicket;
    messages: TicketMessage[];
  }> {
    const [ticket, messagesResult] = await Promise.all([
      this.getTicketById(ticketId),
      this.getTicketMessages(ticketId)
    ]);

    return {
      ticket,
      messages: messagesResult.messages
    };
  }

  /**
   * Método de compatibilidade com interface existente
   */
  async getAllTickets(): Promise<SupportTicket[]> {
    const result = await this.listTickets(1, 100); // Buscar mais tickets
    return result.tickets;
  }
}

export const supportTicketService = new SupportTicketService(); 