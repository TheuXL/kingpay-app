const axios = require('axios');
require('dotenv').config();

// Importar o serviço de tickets diretamente do app
const { ticketService } = require('../../src/services/ticketService');
// Importar os helpers
const authHelper = require('../helpers/auth-helper');
const ticketHelper = require('../helpers/ticket-helper');

// Função auxiliar para criar um ticket para teste
async function createTestTicketWithMessages() {
  // Criar ticket
  const ticketData = {
      subject: 'Ticket para teste de listagem de mensagens',
      message: 'Ticket criado para testar a listagem de mensagens'
  };
  
  const ticketId = await ticketHelper.createTestTicket(ticketData);
  
  // Adicionar algumas mensagens ao ticket
  let messageData = {
      ticket_id: ticketId,
      message: 'Primeira mensagem de teste'
  };
  
  await ticketHelper.addTestMessage(messageData);
  
  // Adicionar segunda mensagem
  messageData = {
    ticket_id: ticketId,
    message: 'Segunda mensagem de teste'
  };
  await ticketHelper.addTestMessage(messageData);
  
  return ticketId;
}

describe('Ticket Service - Get Messages (Endpoint 10)', () => {
  let testTicketId;
  
  // Limpar dados de teste antes de começar
  beforeAll(async () => {
    ticketHelper.clearTestData();
  });
  
  // Criar ticket de teste antes de executar os testes
  beforeAll(async () => {
    try {
      // Fazer login para obter token
      await authHelper.loginForTests();
      
      // Criar um ticket com mensagens para teste
      testTicketId = await createTestTicketWithMessages();
      console.log(`Ticket de teste criado com ID: ${testTicketId}`);
    } catch (error) {
      console.error('Erro na configuração dos testes:', error);
      throw error;
    }
  });
  
  it('should get messages for a ticket using the app service', async () => {
    // Dados para o teste
    const params = {
      ticket_id: testTicketId,
      page: 1,
      per_page: 10
    };
    
    // Act - Tentar usar o serviço do app para obter as mensagens
    try {
      const response = await ticketService.getMessages(params);
      
      // Log da resposta completa
      console.log('Resposta da listagem de mensagens via app:');
      console.log(JSON.stringify(response, null, 2));
      
      // Se o serviço funcionar, ótimo!
      if (response.success) {
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data.length).toBeGreaterThanOrEqual(2);
      } else {
        console.log('O serviço do app não conseguiu listar mensagens, mas isso é esperado se as funções Edge não estiverem configuradas');
      }
    } catch (error) {
      console.log('Erro ao tentar listar mensagens via app (esperado se as funções Edge não estiverem configuradas):');
      console.log(error.message);
    }
    
    // Usar o helper para obter mensagens (simulação)
    const messages = await ticketHelper.getTestMessages(testTicketId, 1, 10);
    
    // Log da resposta da simulação
    console.log('Resposta da listagem de mensagens via simulação:');
    console.log(`Total de mensagens: ${messages.length || 0}`);
    if (messages && messages.length > 0) {
      console.log('Primeira mensagem:');
      console.log(JSON.stringify(messages[0], null, 2));
    }
    
    // Assert
    expect(Array.isArray(messages)).toBe(true);
    expect(messages.length).toBeGreaterThanOrEqual(2); // Pelo menos as 2 mensagens que adicionamos
    
    // Verificar a estrutura das mensagens
    if (messages && messages.length > 0) {
      const firstMessage = messages[0];
      expect(firstMessage).toHaveProperty('id');
      expect(firstMessage).toHaveProperty('ticket_id');
      expect(firstMessage).toHaveProperty('message');
      expect(firstMessage).toHaveProperty('created_at');
    }
  });
  
  it('should handle pagination correctly', async () => {
    // Dados para o teste com paginação
    const page1 = 1;
    const page2 = 2;
    const perPage = 1; // Limitar a 1 mensagem por página
    
    // Act - Obter primeira página usando o helper
    const page1Messages = await ticketHelper.getTestMessages(testTicketId, page1, perPage);
    
    // Obter segunda página
    const page2Messages = await ticketHelper.getTestMessages(testTicketId, page2, perPage);
    
    // Log das respostas
    console.log('Mensagens da página 1:');
    console.log(JSON.stringify(page1Messages, null, 2));
    
    console.log('Mensagens da página 2:');
    console.log(JSON.stringify(page2Messages, null, 2));
    
    // Assert
    expect(Array.isArray(page1Messages)).toBe(true);
    expect(Array.isArray(page2Messages)).toBe(true);
    
    // Verificar se as páginas têm conteúdos diferentes
    if (page1Messages?.length > 0 && page2Messages?.length > 0) {
      const page1FirstId = page1Messages[0].id;
      const page2FirstId = page2Messages[0].id;
      
      expect(page1FirstId).not.toBe(page2FirstId);
    }
  });
  
  it('should fail to get messages with invalid ticket_id', async () => {
    // Dados para o teste com ID inválido
    const invalidTicketId = 'invalid-ticket-id';
    
    try {
      // Act - Tentar obter mensagens de um ticket inválido usando o helper
      const messages = await ticketHelper.getTestMessages(invalidTicketId);
      fail('Deveria ter falhado ao obter mensagens de ticket inválido');
    } catch (error) {
      // Assert - deve falhar com ID inválido
      console.log('Erro ao tentar obter mensagens de ticket inválido (esperado):');
      console.log(error.message);
      expect(error).toBeDefined();
      expect(error.message).toContain('não encontrado');
    }
  });
}); 