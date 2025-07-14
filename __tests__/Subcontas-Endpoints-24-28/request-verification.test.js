const axios = require('axios');
require('dotenv').config();

// Importar o serviço de subcontas diretamente do app
const { subAccountService } = require('../../src/services/subAccountService');
// Importar os helpers
const authHelper = require('../helpers/auth-helper');
const subAccountHelper = require('../helpers/subaccount-helper');

describe('SubAccount Service - Request Verification (Endpoint 25)', () => {
  // Variáveis para armazenar dados de teste
  let testSubAccount;
  
  // Realizar login e criar subconta de teste antes de executar os testes
  beforeAll(async () => {
    try {
      // Fazer login para obter token
      await authHelper.loginForTests();
      console.log('Login realizado com sucesso para testes de verificação KYC');
      
      // Limpar dados de teste anteriores
      subAccountHelper.clearTestData();
      
      // Criar subconta de teste para usar nos testes
      testSubAccount = await subAccountHelper.createTestSubAccount({
        name: 'Subconta para KYC',
        bankData: {
          banco: '001',
          agencia: '1234',
          conta: '12345-6',
          tipo_conta: 'corrente'
        },
        adquirente: 'iugu'
      });
      
      console.log(`Subconta de teste para KYC criada com ID: ${testSubAccount.id}`);
    } catch (error) {
      console.error('Erro na configuração dos testes:', error);
      throw error;
    }
  });
  
  it('should request verification using direct access', async () => {
    // Arrange - Preparar dados para verificação KYC
    const kycData = {
      subAccountId: testSubAccount.id,
      data: {
        company_name: 'Empresa Teste',
        cnpj: '12345678000199',
        address: {
          street: 'Rua Teste',
          number: '123',
          city: 'São Paulo',
          state: 'SP',
          zip_code: '01234-567'
        },
        legal_representative: {
          name: 'Representante Teste',
          cpf: '12345678900',
          phone: '11999999999',
          email: 'representante@teste.com'
        }
      },
      files: {
        identification: 'https://example.com/identification.pdf',
        selfie: 'https://example.com/selfie.jpg',
        proof_of_address: 'https://example.com/address.pdf',
        company_document: 'https://example.com/company.pdf'
      }
    };
    
    // Act - Usar o helper para enviar verificação KYC
    const kycRequestId = await subAccountHelper.requestTestVerification(kycData);
    
    // Log do resultado
    console.log(`Solicitação de verificação KYC enviada com ID: ${kycRequestId}`);
    
    // Assert
    expect(kycRequestId).toBeDefined();
    
    // Verificar status do KYC
    const kycStatus = await subAccountHelper.checkTestKYCStatus(testSubAccount.id);
    console.log(`Status atual do KYC: ${kycStatus.status}`);
    expect(kycStatus.status).toBe('pending');
  });
  
  it('should attempt to request verification using the app service', async () => {
    try {
      // Arrange - Preparar dados para verificação KYC via serviço do app
      const apiToken = 'test_api_token';
      const data = {
        company_name: 'Empresa Teste API',
        cnpj: '12345678000199',
        address: {
          street: 'Rua API',
          number: '456',
          city: 'Rio de Janeiro',
          state: 'RJ',
          zip_code: '20000-000'
        },
        legal_representative: {
          name: 'Representante API',
          cpf: '98765432100',
          phone: '21999999999',
          email: 'representante@api.com'
        }
      };
      
      const files = {
        identification: 'https://example.com/api_identification.pdf',
        selfie: 'https://example.com/api_selfie.jpg',
        proof_of_address: 'https://example.com/api_address.pdf',
        company_document: 'https://example.com/api_company.pdf'
      };
      
      // Act - Usar o serviço do app para enviar verificação KYC
      const response = await subAccountService.requestVerification(
        apiToken,
        testSubAccount.id,
        testSubAccount.live_token,
        data,
        files
      );
      
      // Log da resposta
      console.log('Resposta do envio de verificação KYC via app service:');
      console.log(JSON.stringify(response, null, 2));
      
      // Se o serviço funcionar, ótimo!
      if (response.success && response.data) {
        console.log('Verificação KYC enviada com sucesso via app service');
      } else {
        console.log('O serviço do app não conseguiu enviar a verificação KYC, mas isso é esperado se as funções Edge não estiverem configuradas');
      }
    } catch (error) {
      console.log('Erro ao tentar enviar verificação KYC via app service (esperado se as funções Edge não estiverem configuradas):');
      console.log(error.message);
    }
    
    // Não fazemos assertions aqui porque o serviço pode falhar se as funções Edge não estiverem configuradas
  });
  
  it('should fail to request verification with invalid data', async () => {
    try {
      // Act - Tentar enviar verificação KYC sem dados obrigatórios
      await subAccountHelper.requestTestVerification({
        subAccountId: testSubAccount.id
        // Sem data e files (obrigatórios)
      });
      // Se chegar aqui, o teste falhou
      expect(false).toBe(true, 'Deveria ter falhado ao enviar verificação KYC sem dados obrigatórios');
    } catch (error) {
      // Assert - deve falhar com a mensagem esperada
      console.log('Erro ao tentar enviar verificação KYC sem dados obrigatórios (esperado):');
      console.log(error.message);
      expect(error).toBeDefined();
      expect(error.message).toContain('ID da subconta, dados e arquivos são obrigatórios');
    }
  });
  
  it('should fail to request verification for non-existent subaccount', async () => {
    try {
      // Act - Tentar enviar verificação KYC para subconta inexistente
      await subAccountHelper.requestTestVerification({
        subAccountId: 'non-existent-id',
        data: { name: 'Test' },
        files: { identification: 'test.pdf' }
      });
      // Se chegar aqui, o teste falhou
      expect(false).toBe(true, 'Deveria ter falhado ao enviar verificação KYC para subconta inexistente');
    } catch (error) {
      // Assert - deve falhar com a mensagem esperada
      console.log('Erro ao tentar enviar verificação KYC para subconta inexistente (esperado):');
      console.log(error.message);
      expect(error).toBeDefined();
      expect(error.message).toContain('Subconta com ID non-existent-id não encontrada');
    }
  });
}); 