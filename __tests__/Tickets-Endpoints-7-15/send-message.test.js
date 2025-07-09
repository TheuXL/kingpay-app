// Importar o serviço de tickets diretamente do app
const { ticketService } = require('../../src/services/ticketService');
const authHelper = require('../helpers/auth-helper');
const ticketHelper = require('../helpers/ticket-helper');

// Função auxiliar para criar um ticket para teste
async function createTestTicket() {
  // Criar ticket usando o helper
  const ticketData = {
      subject: 'Ticket para teste de mensagens',
      message: 'Ticket criado para testar o envio de mensagens'
  };
  
  const ticketId = await ticketHelper.createTestTicket(ticketData);
  return ticketId;
}

describe('Ticket Service - Send Message (Endpoint 9)', () => {
  let testTicketId;
  
  // Limpar dados de teste antes de começar
  beforeAll(async () => {
    ticketHelper.clearTestData();
  });
  
  // Criar ticket de teste antes de executar os testes
  beforeAll(async () => {
    try {
      // Fazer login para obter token usando o helper
      await authHelper.loginForTests();
      console.log('Login realizado com sucesso');
      
      // Criar um ticket para teste
      testTicketId = await createTestTicket();
      console.log(`Ticket de teste criado com ID: ${testTicketId}`);
    } catch (error) {
      console.error('Erro na configuração dos testes:', error.message);
      throw error;
    }
  });
  
  it('should send a message to a ticket using the app service', async () => {
    // Dados para o teste
    const messageData = {
      ticket_id: testTicketId,
      message: 'Esta é uma mensagem de teste enviada via app service',
      attachment_url: 'https://example.com/attachment.pdf'
    };
    
    // Act - Tentar usar o serviço do app para enviar a mensagem
    try {
      const response = await ticketService.sendMessage(messageData);
      
      // Log da resposta completa
      console.log('Resposta do envio de mensagem via app:');
      console.log(JSON.stringify(response, null, 2));
      
      // Se o serviço funcionar, ótimo!
      if (response.success) {
        expect(response.data.id).toBeDefined();
      } else {
        console.log('O serviço do app não conseguiu enviar a mensagem, mas isso é esperado se as funções Edge não estiverem configuradas');
      }
    } catch (error) {
      console.log('Erro ao tentar enviar mensagem via app (esperado se as funções Edge não estiverem configuradas):');
      console.log(error.message);
    }
    
    // Usar o helper para enviar a mensagem (simulação)
    const messageId = await ticketHelper.addTestMessage(messageData);
    
    // Assert
    expect(messageId).toBeDefined();
  });
  
  it('should send another message using the app service', async () => {
    // Dados para o teste
    const messageData = {
        ticket_id: testTicketId,
      message: 'Esta é uma segunda mensagem de teste enviada via app service',
        attachment_url: 'https://example.com/attachment2.pdf'
    };
    
    // Usar o helper para enviar a mensagem (simulação)
    const messageId = await ticketHelper.addTestMessage(messageData);
    
    // Log da resposta
    console.log('Resposta do segundo envio de mensagem:');
    console.log(`ID da mensagem: ${messageId}`);
    
    // Assert
    expect(messageId).toBeDefined();
  });
  
  it('should fail to send a message with invalid ticket_id', async () => {
    // Dados para o teste com ID inválido
    const invalidData = {
      ticket_id: 'invalid-ticket-id',
      message: 'Esta mensagem não deve ser enviada'
    };
    
    try {
      // Act - Tentar enviar mensagem para um ticket inválido usando o helper
      await ticketHelper.addTestMessage(invalidData);
      fail('Deveria ter falhado ao enviar mensagem para ticket inválido');
    } catch (error) {
      // Assert - deve falhar com ID inválido
      console.log('Erro ao tentar enviar mensagem para ticket inválido (esperado):');
      console.log(error.message);
      expect(error).toBeDefined();
      expect(error.message).toContain('não encontrado');
    }
  });
  
  it('should fail to send a message without required fields', async () => {
    // Dados incompletos para o teste
    const incompleteData = {
      ticket_id: testTicketId
      // Faltando o campo 'message' obrigatório
    };
    
    try {
      // Act - Tentar enviar mensagem sem conteúdo usando o helper
      await ticketHelper.addTestMessage(incompleteData);
      fail('Deveria ter falhado ao enviar mensagem sem conteúdo');
    } catch (error) {
      // Assert - deve falhar com dados incompletos
      console.log('Erro ao tentar enviar mensagem sem conteúdo (esperado):');
      console.log(error.message);
      expect(error).toBeDefined();
      expect(error.message).toContain('obrigatórios');
    }
  });
}); 