const { supabase } = require('../../src/services/supabase');
const authHelper = require('./auth-helper');
const { v4: uuidv4 } = require('uuid');

// Armazenamento em memória para simular o banco de dados
const inMemoryDb = {
  transactions: [],
  webhooks: []
};

/**
 * Funções auxiliares para testes de transações
 * Usa acesso direto ao banco de dados para testes
 */
module.exports = {
  /**
   * Criar uma transação de teste
   * @param {Object} transactionData Dados da transação
   * @returns {Promise<string>} ID da transação criada
   */
  createTestTransaction: async (transactionData) => {
    try {
      // Garantir que estamos autenticados
      const auth = await authHelper.getCurrentSession();
      
      // Validar dados obrigatórios
      if (!transactionData.customer || !transactionData.product || !transactionData.payment) {
        throw new Error('Campos obrigatórios faltando: customer, product e payment são obrigatórios');
      }
      
      if (!transactionData.customer.name || !transactionData.customer.email || !transactionData.customer.tax_id) {
        throw new Error('Campos obrigatórios do cliente faltando: name, email e tax_id são obrigatórios');
      }
      
      if (!transactionData.product.name || !transactionData.product.price || !transactionData.product.quantity) {
        throw new Error('Campos obrigatórios do produto faltando: name, price e quantity são obrigatórios');
      }
      
      if (!transactionData.payment.method) {
        throw new Error('Método de pagamento é obrigatório');
      }
      
      // Validar método de pagamento
      if (transactionData.payment.method === 'credit_card') {
        if (!transactionData.payment.card) {
          throw new Error('Dados do cartão são obrigatórios para pagamento com cartão de crédito');
        }
        
        // Verificar se é um cartão completo ou hash
        if (!transactionData.payment.card.card_hash) {
          if (!transactionData.payment.card.number || !transactionData.payment.card.holder_name || 
              !transactionData.payment.card.expiry_month || !transactionData.payment.card.expiry_year || 
              !transactionData.payment.card.cvv) {
            throw new Error('Dados do cartão incompletos: number, holder_name, expiry_month, expiry_year e cvv são obrigatórios');
          }
        }
      }
      
      // Obter o ID do usuário da sessão atual
      const { data: { user } } = await supabase.auth.getUser();
      
      // Verificar se o usuário existe antes de acessar user.id
      let userId;
      if (user) {
        userId = user.id;
      } else {
        // Se não houver usuário autenticado, usar um ID fixo para testes
        userId = '00000000-0000-0000-0000-000000000000'; // ID fictício para testes
        console.log('Usuário não autenticado. Usando ID de teste para fins de simulação.');
      }
      
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }
      
      // Criar ID único para a transação
      const transactionId = uuidv4();
      
      // Calcular o valor total
      const totalAmount = transactionData.product.price * transactionData.product.quantity;
      
      // Criar a transação na simulação em memória
      const transaction = {
        id: transactionId,
        user_id: userId,
        customer: transactionData.customer,
        product: transactionData.product,
        shipping: transactionData.shipping || null,
        payment: {
          method: transactionData.payment.method,
          installments: transactionData.payment.installments || 1
        },
        amount: totalAmount,
        status: 'pending',
        environment: transactionData.environment || 'development',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Para pagamentos PIX, gerar QR code e código PIX
      if (transactionData.payment.method === 'pix') {
        transaction.pix_data = {
          qr_code: `00020101021226930014br.gov.bcb.pix2571pix-h.example.com/v2/9d36b0b9-8af1-4da2-a93c-e748b8e25122520400005303986540510.005802BR5925Recipient Name6009Sao Paulo62070503***6304${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
          pix_code: `pix-h.example.com/v2/9d36b0b9-8af1-4da2-a93c-e748b8e25122${Math.random().toString(36).substring(2, 15)}`,
          expiration_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
        };
      }
      
      // Para cartão de crédito, simular resposta do gateway
      if (transactionData.payment.method === 'credit_card') {
        transaction.card_data = {
          authorization_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
          transaction_id: Math.floor(Math.random() * 10000000000).toString(),
          last_digits: transactionData.payment.card.number ? 
            transactionData.payment.card.number.slice(-4) : 
            Math.floor(Math.random() * 10000).toString().padStart(4, '0')
        };
      }
      
      // Adicionar à simulação
      inMemoryDb.transactions.push(transaction);
      
      console.log(`Transação criada com ID: ${transactionId}`);
      return transactionId;
    } catch (error) {
      console.error('Falha ao criar transação de teste:', error.message);
      throw error;
    }
  },
  
  /**
   * Obter uma transação de teste pelo ID
   * @param {string} transactionId ID da transação
   * @returns {Promise<Object>} Dados da transação
   */
  getTestTransaction: async (transactionId) => {
    try {
      // Garantir que estamos autenticados
      const auth = await authHelper.getCurrentSession();
      
      // Encontrar a transação na simulação
      const transaction = inMemoryDb.transactions.find(t => t.id === transactionId);
      if (!transaction) {
        throw new Error(`Transação com ID ${transactionId} não encontrada`);
      }
      
      return transaction;
    } catch (error) {
      console.error('Falha ao obter transação de teste:', error.message);
      throw error;
    }
  },
  
  /**
   * Atualizar o status de uma transação
   * @param {string} transactionId ID da transação
   * @param {string} status Novo status
   * @returns {Promise<boolean>} Sucesso da operação
   */
  updateTransactionStatus: async (transactionId, status) => {
    try {
      // Garantir que estamos autenticados
      const auth = await authHelper.getCurrentSession();
      
      // Validar status
      const validStatuses = ['pending', 'processing', 'approved', 'declined', 'refunded', 'canceled'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Status inválido: ${status}. Deve ser um dos seguintes: ${validStatuses.join(', ')}`);
      }
      
      // Encontrar a transação na simulação
      const transactionIndex = inMemoryDb.transactions.findIndex(t => t.id === transactionId);
      if (transactionIndex === -1) {
        throw new Error(`Transação com ID ${transactionId} não encontrada`);
      }
      
      // Atualizar o status
      inMemoryDb.transactions[transactionIndex].status = status;
      inMemoryDb.transactions[transactionIndex].updated_at = new Date().toISOString();
      
      console.log(`Status da transação ${transactionId} atualizado para ${status}`);
      return true;
    } catch (error) {
      console.error('Falha ao atualizar status da transação:', error.message);
      throw error;
    }
  },
  
  /**
   * Processar webhook de transação
   * @param {Object} webhookData Dados do webhook
   * @returns {Promise<boolean>} Sucesso da operação
   */
  processTestWebhook: async (webhookData) => {
    try {
      // Garantir que estamos autenticados
      const auth = await authHelper.getCurrentSession();
      
      // Validar dados obrigatórios
      if (!webhookData.event || !webhookData.data || !webhookData.data.transaction_id) {
        throw new Error('Dados de webhook inválidos: event, data e transaction_id são obrigatórios');
      }
      
      // Encontrar a transação na simulação
      const transactionIndex = inMemoryDb.transactions.findIndex(t => t.id === webhookData.data.transaction_id);
      if (transactionIndex === -1) {
        throw new Error(`Transação com ID ${webhookData.data.transaction_id} não encontrada`);
      }
      
      // Processar o evento
      switch (webhookData.event) {
        case 'transaction.approved':
          inMemoryDb.transactions[transactionIndex].status = 'approved';
          break;
        case 'transaction.declined':
          inMemoryDb.transactions[transactionIndex].status = 'declined';
          break;
        case 'transaction.refunded':
          inMemoryDb.transactions[transactionIndex].status = 'refunded';
          break;
        case 'transaction.canceled':
          inMemoryDb.transactions[transactionIndex].status = 'canceled';
          break;
        default:
          console.log(`Evento de webhook não processado: ${webhookData.event}`);
      }
      
      // Atualizar data de modificação
      inMemoryDb.transactions[transactionIndex].updated_at = new Date().toISOString();
      
      // Registrar o webhook
      const webhookId = uuidv4();
      inMemoryDb.webhooks.push({
        id: webhookId,
        transaction_id: webhookData.data.transaction_id,
        event: webhookData.event,
        data: webhookData.data,
        received_at: new Date().toISOString(),
        processed: true
      });
      
      console.log(`Webhook processado com ID: ${webhookId}`);
      return true;
    } catch (error) {
      console.error('Falha ao processar webhook de teste:', error.message);
      throw error;
    }
  },
  
  /**
   * Obter credenciais de teste
   * @returns {Promise<Object>} Credenciais
   */
  getTestCredentials: async () => {
    try {
      // Garantir que estamos autenticados
      const auth = await authHelper.getCurrentSession();
      
      // Verificar explicitamente se o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      // Simular credenciais
      return {
        development: {
          api_key: 'dev_api_key_' + Math.random().toString(36).substring(2, 15),
          api_secret: 'dev_api_secret_' + Math.random().toString(36).substring(2, 15),
          merchant_id: 'dev_merchant_' + Math.random().toString(36).substring(2, 10)
        },
        production: {
          api_key: 'prod_api_key_' + Math.random().toString(36).substring(2, 15),
          api_secret: 'prod_api_secret_' + Math.random().toString(36).substring(2, 15),
          merchant_id: 'prod_merchant_' + Math.random().toString(36).substring(2, 10)
        }
      };
    } catch (error) {
      console.error('Falha ao obter credenciais de teste:', error.message);
      throw error;
    }
  },
  
  /**
   * Listar transações de teste
   * @returns {Promise<Array>} Lista de transações
   */
  listTestTransactions: async () => {
    try {
      // Garantir que estamos autenticados
      const auth = await authHelper.getCurrentSession();
      
      // Obter o ID do usuário da sessão atual
      const { data: { user } } = await supabase.auth.getUser();
      
      // Verificar se o usuário existe antes de acessar user.id
      let userId;
      if (user) {
        userId = user.id;
      } else {
        // Se não houver usuário autenticado, usar um ID fixo para testes
        userId = '00000000-0000-0000-0000-000000000000'; // ID fictício para testes
        console.log('Usuário não autenticado. Usando ID de teste para fins de simulação.');
      }
      
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }
      
      // Filtrar transações do usuário
      const userTransactions = inMemoryDb.transactions.filter(t => t.user_id === userId);
      
      return userTransactions;
    } catch (error) {
      console.error('Falha ao listar transações de teste:', error.message);
      throw error;
    }
  },
  
  /**
   * Limpar dados de teste
   */
  clearTestData: () => {
    inMemoryDb.transactions = [];
    inMemoryDb.webhooks = [];
    console.log('Dados de teste limpos');
  }
}; 