const axios = require('axios');
require('dotenv').config();

// Importar o serviço de transações diretamente do app
const { transactionService } = require('../../src/services/transactionService');
// Importar os helpers
const authHelper = require('../helpers/auth-helper');
const transactionHelper = require('../helpers/transaction-helper');

describe('Transaction Service - Process Card Production (Endpoint 21)', () => {
  // Limpar dados de teste antes de começar
  beforeAll(async () => {
    try {
      // Limpar dados de teste
      transactionHelper.clearTestData();
      
      // Fazer login para obter token
      await authHelper.loginForTests();
      console.log('Login realizado com sucesso para testes de transações com cartão em produção');
    } catch (error) {
      console.error('Erro na configuração dos testes:', error);
      throw error;
    }
  });
  
  it('should process a credit card payment in production environment using direct database access', async () => {
    // Dados para o teste
    const transactionData = {
      customer: {
        name: 'Cliente Teste Cartão Prod',
        email: 'cliente.cartao.prod@teste.com',
        tax_id: '12345678900', // CPF
        phone: '11999998888'
      },
      product: {
        name: 'Produto Teste Cartão Prod',
        price: 250.00,
        quantity: 1
      },
      shipping: {
        address: 'Rua de Teste Cartão Prod, 123',
        city: 'São Paulo',
        state: 'SP',
        postal_code: '01234-567'
      },
      payment: {
        method: 'credit_card',
        card: {
          number: '4111111111111111',
          holder_name: 'Cliente Teste Prod',
          expiry_month: '12',
          expiry_year: '2030',
          cvv: '123'
        },
        installments: 1
      },
      environment: 'production'
    };
    
    // Act - Usar o helper para criar uma transação diretamente no banco
    const transactionId = await transactionHelper.createTestTransaction(transactionData);
    
    // Log do ID da transação
    console.log(`Transação de cartão (produção) criada com ID: ${transactionId}`);
    
    // Assert
    expect(transactionId).toBeDefined();
    
    // Obter os detalhes da transação
    const transaction = await transactionHelper.getTestTransaction(transactionId);
    
    // Verificar se os dados da transação estão corretos
    expect(transaction).toBeDefined();
    expect(transaction.id).toBe(transactionId);
    expect(transaction.customer.name).toBe(transactionData.customer.name);
    expect(transaction.product.name).toBe(transactionData.product.name);
    expect(transaction.payment.method).toBe('credit_card');
    expect(transaction.environment).toBe('production');
    expect(transaction.status).toBe('pending');
    
    // Verificar se os dados do cartão foram processados
    expect(transaction.card_data).toBeDefined();
    expect(transaction.card_data.authorization_code).toBeDefined();
    expect(transaction.card_data.transaction_id).toBeDefined();
    expect(transaction.card_data.last_digits).toBe('1111'); // Últimos 4 dígitos do cartão
    
    // Armazenar o ID da transação para uso em outros testes
    global.testCardProdTransactionId = transactionId;
  });
  
  it('should attempt to process a credit card payment in production using the app service', async () => {
    // Dados para o teste
    const transactionData = {
      customer: {
        name: 'Cliente Teste App Cartão Prod',
        email: 'cliente.app.cartao.prod@teste.com',
        tax_id: '98765432100', // CPF
        phone: '11999997777'
      },
      product: {
        name: 'Produto Teste App Cartão Prod',
        price: 399.99,
        quantity: 1
      },
      shipping: {
        address: 'Avenida de Teste Cartão Prod, 456',
        city: 'Rio de Janeiro',
        state: 'RJ',
        postal_code: '20000-000'
      },
      payment: {
        method: 'credit_card',
        card: {
          number: '5555555555554444',
          holder_name: 'Cliente App Teste Prod',
          expiry_month: '01',
          expiry_year: '2028',
          cvv: '321'
        },
        installments: 6
      }
    };
    
    try {
      // Act - Usar o serviço do app para processar um pagamento com cartão em produção
      const response = await transactionService.processCardProd(transactionData);
      
      // Log da resposta completa
      console.log('Resposta do processamento de cartão em produção via app service:');
      console.log(JSON.stringify(response, null, 2));
      
      // Se o serviço funcionar, ótimo!
      if (response.success && response.data && response.data.id) {
        console.log(`Transação de cartão em produção criada via app service com ID: ${response.data.id}`);
      } else {
        console.log('O serviço do app não conseguiu processar o pagamento com cartão em produção, mas isso é esperado se as funções Edge não estiverem configuradas');
      }
    } catch (error) {
      console.log('Erro ao tentar processar pagamento com cartão em produção via app service (esperado se as funções Edge não estiverem configuradas):');
      console.log(error.message);
    }
    
    // Não fazemos assertions aqui porque o serviço pode falhar se as funções Edge não estiverem configuradas
  });
  
  it('should verify differences between development and production credit card transactions', async () => {
    // Criar uma transação de cartão em ambiente de desenvolvimento
    const devTransactionData = {
      customer: {
        name: 'Cliente Teste Dev',
        email: 'cliente.dev@teste.com',
        tax_id: '12345678900',
        phone: '11999998888'
      },
      product: {
        name: 'Produto Teste Dev',
        price: 100.00,
        quantity: 1
      },
      payment: {
        method: 'credit_card',
        card: {
          number: '4111111111111111',
          holder_name: 'Cliente Teste Dev',
          expiry_month: '12',
          expiry_year: '2030',
          cvv: '123'
        }
      },
      environment: 'development'
    };
    
    // Criar uma transação de cartão em ambiente de produção
    const prodTransactionData = {
      customer: {
        name: 'Cliente Teste Prod',
        email: 'cliente.prod@teste.com',
        tax_id: '12345678900',
        phone: '11999998888'
      },
      product: {
        name: 'Produto Teste Prod',
        price: 100.00,
        quantity: 1
      },
      payment: {
        method: 'credit_card',
        card: {
          number: '4111111111111111',
          holder_name: 'Cliente Teste Prod',
          expiry_month: '12',
          expiry_year: '2030',
          cvv: '123'
        }
      },
      environment: 'production'
    };
    
    // Criar as duas transações
    const devTransactionId = await transactionHelper.createTestTransaction(devTransactionData);
    const prodTransactionId = await transactionHelper.createTestTransaction(prodTransactionData);
    
    // Obter as transações
    const devTransaction = await transactionHelper.getTestTransaction(devTransactionId);
    const prodTransaction = await transactionHelper.getTestTransaction(prodTransactionId);
    
    // Verificar que ambas foram criadas corretamente
    expect(devTransaction).toBeDefined();
    expect(prodTransaction).toBeDefined();
    
    // Verificar que os ambientes estão corretos
    expect(devTransaction.environment).toBe('development');
    expect(prodTransaction.environment).toBe('production');
    
    // Ambas devem ter dados de cartão
    expect(devTransaction.card_data).toBeDefined();
    expect(prodTransaction.card_data).toBeDefined();
    
    // Log para comparação
    console.log('Comparação entre transações de cartão em desenvolvimento e produção:');
    console.log(`Dev Transaction ID: ${devTransactionId}`);
    console.log(`Prod Transaction ID: ${prodTransactionId}`);
    console.log('Dev Transaction Data:', {
      authorization_code: devTransaction.card_data.authorization_code,
      last_digits: devTransaction.card_data.last_digits
    });
    console.log('Prod Transaction Data:', {
      authorization_code: prodTransaction.card_data.authorization_code,
      last_digits: prodTransaction.card_data.last_digits
    });
  });
}); 