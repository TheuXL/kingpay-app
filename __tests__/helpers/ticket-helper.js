const { supabase } = require('../../src/services/supabase');
const authHelper = require('./auth-helper');
const { v4: uuidv4 } = require('uuid');

// Armazenamento em memória para simular o banco de dados
const inMemoryDb = {
  tickets: [],
  messages: []
};

/**
 * Funções auxiliares para testes de tickets
 * Usa simulação em memória para testes
 */
module.exports = {
  /**
   * Criar um ticket de teste na simulação em memória
   * @param {Object} ticketData Dados do ticket
   * @returns {Promise<string>} ID do ticket criado
   */
  createTestTicket: async (ticketData) => {
    try {
      // Garantir que estamos autenticados
      const auth = await authHelper.getCurrentSession();
      
      // Validar dados obrigatórios
      if (!ticketData.subject || !ticketData.message) {
        throw new Error('Campos obrigatórios faltando: subject e message são obrigatórios');
      }
      
      // Obter o ID do usuário da sessão atual
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user.id;
      
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }
      
      // Criar ID único para o ticket
      const ticketId = uuidv4();
      
      // Criar o ticket na simulação em memória
      const ticket = {
        id: ticketId,
        user_id: userId,
        subject: ticketData.subject,
        message: ticketData.message,
        status: 'open',
        attachment_url: ticketData.attachment_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Adicionar à simulação
      inMemoryDb.tickets.push(ticket);
      
      console.log(`Ticket criado com ID: ${ticketId}`);
      return ticketId;
    } catch (error) {
      console.error('Falha ao criar ticket de teste:', error.message);
      throw error;
    }
  },
  
  /**
   * Adicionar uma mensagem a um ticket de teste
   * @param {Object} messageData Dados da mensagem
   * @returns {Promise<string>} ID da mensagem criada
   */
  addTestMessage: async (messageData) => {
    try {
      // Garantir que estamos autenticados
      const auth = await authHelper.getCurrentSession();
      
      // Validar dados obrigatórios
      if (!messageData.ticket_id || !messageData.message) {
        throw new Error('Campos obrigatórios faltando: ticket_id e message são obrigatórios');
      }
      
      // Verificar se o ticket existe
      const ticket = inMemoryDb.tickets.find(t => t.id === messageData.ticket_id);
      if (!ticket) {
        throw new Error(`Ticket com ID ${messageData.ticket_id} não encontrado`);
      }
      
      // Obter o ID do usuário da sessão atual
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user.id;
      
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }
      
      // Criar ID único para a mensagem
      const messageId = uuidv4();
      
      // Criar a mensagem na simulação em memória
      const message = {
        id: messageId,
        ticket_id: messageData.ticket_id,
        user_id: userId,
        message: messageData.message,
        is_from_support: messageData.is_from_support || false,
        attachment_url: messageData.attachment_url || null,
        is_read: false,
        created_at: new Date().toISOString()
      };
      
      // Adicionar à simulação
      inMemoryDb.messages.push(message);
      
      console.log(`Mensagem adicionada com ID: ${messageId}`);
      return messageId;
    } catch (error) {
      console.error('Falha ao adicionar mensagem de teste:', error.message);
      throw error;
    }
  },
  
  /**
   * Atualizar o status de um ticket de teste
   * @param {string} ticketId ID do ticket
   * @param {string} status Novo status
   * @returns {Promise<boolean>} Sucesso da operação
   */
  updateTicketStatus: async (ticketId, status) => {
    try {
      // Garantir que estamos autenticados
      const auth = await authHelper.getCurrentSession();
      
      // Validar status
      const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Status inválido: ${status}. Deve ser um dos seguintes: ${validStatuses.join(', ')}`);
      }
      
      // Encontrar o ticket na simulação
      const ticketIndex = inMemoryDb.tickets.findIndex(t => t.id === ticketId);
      if (ticketIndex === -1) {
        throw new Error(`Ticket com ID ${ticketId} não encontrado`);
      }
      
      // Atualizar o status
      inMemoryDb.tickets[ticketIndex].status = status;
      inMemoryDb.tickets[ticketIndex].updated_at = new Date().toISOString();
      
      console.log(`Status do ticket ${ticketId} atualizado para ${status}`);
      return true;
    } catch (error) {
      console.error('Falha ao atualizar status do ticket:', error.message);
      throw error;
    }
  },
  
  /**
   * Obter um ticket de teste pelo ID
   * @param {string} ticketId ID do ticket
   * @returns {Promise<Object>} Dados do ticket
   */
  getTestTicket: async (ticketId) => {
    try {
      // Garantir que estamos autenticados
      const auth = await authHelper.getCurrentSession();
      
      // Encontrar o ticket na simulação
      const ticket = inMemoryDb.tickets.find(t => t.id === ticketId);
      if (!ticket) {
        throw new Error(`Ticket com ID ${ticketId} não encontrado`);
      }
      
      return ticket;
    } catch (error) {
      console.error('Falha ao obter ticket de teste:', error.message);
      throw error;
    }
  },
  
  /**
   * Obter mensagens de um ticket de teste
   * @param {string} ticketId ID do ticket
   * @param {number} [page=1] Página
   * @param {number} [perPage=10] Itens por página
   * @returns {Promise<Array>} Lista de mensagens
   */
  getTestMessages: async (ticketId, page = 1, perPage = 10) => {
    try {
      // Garantir que estamos autenticados
      const auth = await authHelper.getCurrentSession();
      
      // Verificar se o ticket existe
      const ticket = inMemoryDb.tickets.find(t => t.id === ticketId);
      if (!ticket) {
        throw new Error(`Ticket com ID ${ticketId} não encontrado`);
      }
      
      // Filtrar mensagens do ticket
      const allMessages = inMemoryDb.messages
        .filter(m => m.ticket_id === ticketId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      // Aplicar paginação
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedMessages = allMessages.slice(startIndex, endIndex);
      
      return paginatedMessages;
    } catch (error) {
      console.error('Falha ao obter mensagens de teste:', error.message);
      throw error;
    }
  },
  
  /**
   * Marcar mensagens de um ticket como lidas
   * @param {string} ticketId ID do ticket
   * @returns {Promise<boolean>} Sucesso da operação
   */
  markMessagesAsRead: async (ticketId) => {
    try {
      // Garantir que estamos autenticados
      const auth = await authHelper.getCurrentSession();
      
      // Verificar se o ticket existe
      const ticket = inMemoryDb.tickets.find(t => t.id === ticketId);
      if (!ticket) {
        throw new Error(`Ticket com ID ${ticketId} não encontrado`);
      }
      
      // Marcar todas as mensagens do suporte como lidas
      let updatedCount = 0;
      inMemoryDb.messages.forEach((message, index) => {
        if (message.ticket_id === ticketId && message.is_from_support && !message.is_read) {
          inMemoryDb.messages[index].is_read = true;
          updatedCount++;
        }
      });
      
      console.log(`Mensagens do ticket ${ticketId} marcadas como lidas`);
      return true;
    } catch (error) {
      console.error('Falha ao marcar mensagens como lidas:', error.message);
      throw error;
    }
  },
  
  /**
   * Verificar mensagens não lidas
   * @returns {Promise<Object>} Dados de mensagens não lidas
   */
  checkUnreadMessages: async () => {
    try {
      // Garantir que estamos autenticados
      const auth = await authHelper.getCurrentSession();
      
      // Obter o ID do usuário da sessão atual
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user.id;
      
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }
      
      // Filtrar tickets do usuário
      const userTickets = inMemoryDb.tickets.filter(t => t.user_id === userId);
      
      // Contar mensagens não lidas por ticket
      const ticketsWithUnreadCount = userTickets.map(ticket => {
        const unreadCount = inMemoryDb.messages.filter(
          m => m.ticket_id === ticket.id && m.is_from_support && !m.is_read
        ).length;
        
        return {
          id: ticket.id,
          subject: ticket.subject,
          unread_count: unreadCount
        };
      }).filter(t => t.unread_count > 0);
      
      return {
        tickets: ticketsWithUnreadCount,
        total_unread: ticketsWithUnreadCount.reduce((sum, t) => sum + t.unread_count, 0)
      };
    } catch (error) {
      console.error('Falha ao verificar mensagens não lidas:', error.message);
      throw error;
    }
  },
  
  /**
   * Listar tickets de teste
   * @returns {Promise<Array>} Lista de tickets
   */
  listTestTickets: async () => {
    try {
      // Garantir que estamos autenticados
      const auth = await authHelper.getCurrentSession();
      
      // Obter o ID do usuário da sessão atual
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user.id;
      
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }
      
      // Filtrar tickets do usuário
      const userTickets = inMemoryDb.tickets.filter(t => t.user_id === userId);
      
      return userTickets;
    } catch (error) {
      console.error('Falha ao listar tickets de teste:', error.message);
      throw error;
    }
  },
  
  /**
   * Obter métricas de tickets
   * @returns {Promise<Object>} Métricas de tickets
   */
  getTestMetrics: async () => {
    try {
      // Garantir que estamos autenticados
      const auth = await authHelper.getCurrentSession();
      
      // Obter o ID do usuário da sessão atual
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user.id;
      
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }
      
      // Filtrar tickets do usuário
      const userTickets = inMemoryDb.tickets.filter(t => t.user_id === userId);
      
      // Contar tickets por status
      const open = userTickets.filter(t => t.status === 'open').length;
      const inProgress = userTickets.filter(t => t.status === 'in_progress').length;
      const resolved = userTickets.filter(t => t.status === 'resolved').length;
      const closed = userTickets.filter(t => t.status === 'closed').length;
      
      return {
        open,
        in_progress: inProgress,
        resolved,
        closed,
        total: open + inProgress + resolved + closed
      };
    } catch (error) {
      console.error('Falha ao obter métricas de tickets:', error.message);
      throw error;
    }
  },
  
  /**
   * Limpar dados de teste
   */
  clearTestData: () => {
    inMemoryDb.tickets = [];
    inMemoryDb.messages = [];
    console.log('Dados de teste limpos');
  }
}; 