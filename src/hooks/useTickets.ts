/**
 * 🎫 HOOK DE TICKETS DE SUPORTE - KINGPAY
 * =====================================
 * 
 * Hook para gerenciar sistema de tickets seguindo exatamente
 * a documentação dos endpoints do sistema web
 */

import { useCallback, useState } from 'react';
import { edgeFunctionsService } from '../services/edgeFunctions';

export interface TicketData {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'closed';
  created_at: string;
  updated_at: string;
  messages_count: number;
  has_unread: boolean;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  message: string;
  sender_type: 'user' | 'support';
  created_at: string;
  attachment_url?: string;
}

export interface TicketMetrics {
  total_tickets: number;
  open_tickets: number;
  closed_tickets: number;
  average_response_time: number;
}

export const useTickets = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [currentTicket, setCurrentTicket] = useState<TicketData | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [metrics, setMetrics] = useState<TicketMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 🎫 CRIAR NOVO TICKET
   */
  const createTicket = useCallback(async (ticketData: {
    subject: string;
    message: string;
    attachment_url?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await edgeFunctionsService.createTicket(ticketData);
      
      if (result.success) {
        console.log('✅ Ticket criado com sucesso:', result.data);
        // Recarregar lista de tickets
        await loadTickets();
        return result.data;
      } else {
        setError(result.error || 'Erro ao criar ticket');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado';
      setError(errorMessage);
      console.error('❌ Erro ao criar ticket:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 📋 CARREGAR LISTA DE TICKETS
   */
  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await edgeFunctionsService.listTickets();
      
      if (result.success) {
        setTickets(result.data || []);
        console.log(`✅ ${(result.data || []).length} tickets carregados`);
      } else {
        setError(result.error || 'Erro ao carregar tickets');
        setTickets([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado';
      setError(errorMessage);
      setTickets([]);
      console.error('❌ Erro ao carregar tickets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🎫 CARREGAR TICKET ESPECÍFICO
   */
  const loadTicket = useCallback(async (ticketId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await edgeFunctionsService.getTicket(ticketId);
      
      if (result.success && result.data) {
        setCurrentTicket(result.data);
        console.log('✅ Ticket carregado:', result.data.subject);
        return result.data;
      } else {
        setError(result.error || 'Erro ao carregar ticket');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado';
      setError(errorMessage);
      console.error('❌ Erro ao carregar ticket:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 📨 CARREGAR MENSAGENS DO TICKET
   */
  const loadMessages = useCallback(async (ticketId: string, page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const result = await edgeFunctionsService.getTicketMessages(ticketId, page);
      
      if (result.success) {
        setMessages(result.data || []);
        console.log(`✅ ${(result.data || []).length} mensagens carregadas`);
        return result.data || [];
      } else {
        setError(result.error || 'Erro ao carregar mensagens');
        setMessages([]);
        return [];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado';
      setError(errorMessage);
      setMessages([]);
      console.error('❌ Erro ao carregar mensagens:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 💬 ENVIAR MENSAGEM
   */
  const sendMessage = useCallback(async (ticketId: string, messageData: {
    message: string;
    attachment_url?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await edgeFunctionsService.sendTicketMessage({
        ticket_id: ticketId,
        ...messageData
      });
      
      if (result.success) {
        console.log('✅ Mensagem enviada com sucesso');
        // Recarregar mensagens
        await loadMessages(ticketId);
        return result.data;
      } else {
        setError(result.error || 'Erro ao enviar mensagem');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado';
      setError(errorMessage);
      console.error('❌ Erro ao enviar mensagem:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [loadMessages]);

  /**
   * ✅ MARCAR MENSAGENS COMO LIDAS
   */
  const markAsRead = useCallback(async (ticketId: string) => {
    try {
      const result = await edgeFunctionsService.markTicketMessagesAsRead(ticketId);
      
      if (result.success) {
        console.log('✅ Mensagens marcadas como lidas');
        // Atualizar estado local se necessário
        setTickets(prev => prev.map(ticket => 
          ticket.id === ticketId 
            ? { ...ticket, has_unread: false }
            : ticket
        ));
      }
      
      return result.success;
    } catch (err) {
      console.error('❌ Erro ao marcar como lidas:', err);
      return false;
    }
  }, []);

  /**
   * 🔍 VERIFICAR MENSAGENS NÃO LIDAS
   */
  const checkUnreadMessages = useCallback(async () => {
    try {
      const result = await edgeFunctionsService.checkUnreadMessages();
      
      if (result.success && result.data) {
        return result.data.hasUnread;
      }
      
      return false;
    } catch (err) {
      console.error('❌ Erro ao verificar mensagens não lidas:', err);
      return false;
    }
  }, []);

  /**
   * 📊 CARREGAR MÉTRICAS
   */
  const loadMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await edgeFunctionsService.getTicketMetrics();
      
      if (result.success && result.data) {
        setMetrics(result.data);
        console.log('✅ Métricas carregadas');
        return result.data;
      } else {
        setError(result.error || 'Erro ao carregar métricas');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado';
      setError(errorMessage);
      console.error('❌ Erro ao carregar métricas:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🔄 LIMPAR ESTADO
   */
  const clearState = useCallback(() => {
    setTickets([]);
    setCurrentTicket(null);
    setMessages([]);
    setMetrics(null);
    setError(null);
  }, []);

  return {
    // Estado
    tickets,
    currentTicket,
    messages,
    metrics,
    loading,
    error,

    // Ações
    createTicket,
    loadTickets,
    loadTicket,
    loadMessages,
    sendMessage,
    markAsRead,
    checkUnreadMessages,
    loadMetrics,
    clearState
  };
}; 