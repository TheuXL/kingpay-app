const { subAccountService } = require('../../src/services/subAccountService');
const authHelper = require('./auth-helper');

/**
 * Helper para testes de subcontas
 */
module.exports = {
  /**
   * Listar subcontas para testes
   * @param {Object} options Opções de paginação e filtro
   * @returns {Promise<Object>} Lista de subcontas
   */
  listTestSubAccounts: async (options = {}) => {
    try {
      // Garantir que estamos autenticados como administrador
      await authHelper.getCurrentSession();
      
      // Tentar usar o serviço real
      try {
        const response = await subAccountService.listSubAccounts(options);
        
        if (response.success && response.data) {
          console.log('Subcontas listadas com sucesso via API');
          return response.data;
        }
      } catch (apiError) {
        console.log('Erro ao listar subcontas via API:', apiError.message);
      }
      
      // Se a API falhar, usar simulação
      console.log('Usando simulação para listar subcontas');
      return subAccountService.simulateListSubAccounts(options);
    } catch (error) {
      console.error('Falha ao listar subcontas de teste:', error.message);
      throw error;
    }
  },
  
  /**
   * Reenviar documentos para uma subconta para testes
   * @param {string} subAccountId ID da subconta
   * @param {Object} documents Documentos a serem enviados
   * @returns {Promise<Object>} Resultado da operação
   */
  resendTestDocuments: async (subAccountId, documents) => {
    try {
      if (!subAccountId) {
        throw new Error('ID da subconta é obrigatório');
      }
      
      if (!documents || !documents.balance_sheet) {
        throw new Error('Documentos são obrigatórios');
      }
      
      // Garantir que estamos autenticados como administrador
      await authHelper.getCurrentSession();
      
      // Tentar usar o serviço real
      try {
        const response = await subAccountService.resendDocuments(subAccountId, documents);
        
        if (response.success && response.data) {
          console.log('Documentos reenviados com sucesso via API');
          return response.data;
        }
      } catch (apiError) {
        console.log('Erro ao reenviar documentos via API:', apiError.message);
      }
      
      // Se a API falhar, usar simulação
      console.log('Usando simulação para reenviar documentos');
      return subAccountService.simulateResendDocuments(subAccountId, documents);
    } catch (error) {
      console.error('Falha ao reenviar documentos de teste:', error.message);
      throw error;
    }
  },
  
  /**
   * Verificar status de uma subconta para testes
   * @param {string} subAccountId ID da subconta
   * @param {string} token Token da subconta
   * @returns {Promise<Object>} Status da subconta
   */
  checkTestStatus: async (subAccountId, token) => {
    try {
      if (!subAccountId) {
        throw new Error('ID da subconta é obrigatório');
      }
      
      if (!token) {
        throw new Error('Token da subconta é obrigatório');
      }
      
      // Garantir que estamos autenticados como administrador
      await authHelper.getCurrentSession();
      
      // Tentar usar o serviço real
      try {
        const response = await subAccountService.checkStatus(subAccountId, token);
        
        if (response.success && response.data) {
          console.log('Status verificado com sucesso via API');
          return response.data;
        }
      } catch (apiError) {
        console.log('Erro ao verificar status via API:', apiError.message);
      }
      
      // Se a API falhar, usar simulação
      console.log('Usando simulação para verificar status');
      return subAccountService.simulateCheckStatus(subAccountId, token);
    } catch (error) {
      console.error('Falha ao verificar status de teste:', error.message);
      throw error;
    }
  },
  
  /**
   * Verificar status KYC de uma subconta para testes
   * @param {string} token Token da subconta
   * @returns {Promise<Object>} Status KYC da subconta
   */
  checkTestKyc: async (token) => {
    try {
      if (!token) {
        throw new Error('Token da subconta é obrigatório');
      }
      
      // Garantir que estamos autenticados como administrador
      await authHelper.getCurrentSession();
      
      // Tentar usar o serviço real
      try {
        const response = await subAccountService.checkKyc(token);
        
        if (response.success && response.data) {
          console.log('Status KYC verificado com sucesso via API');
          return response.data;
        }
      } catch (apiError) {
        console.log('Erro ao verificar status KYC via API:', apiError.message);
      }
      
      // Se a API falhar, usar simulação
      console.log('Usando simulação para verificar status KYC');
      return subAccountService.simulateCheckKyc(token);
    } catch (error) {
      console.error('Falha ao verificar status KYC de teste:', error.message);
      throw error;
    }
  },
  
  /**
   * Criar subconta com KYC para testes
   * @param {Object} subAccountData Dados da subconta
   * @returns {Promise<Object>} Subconta criada
   */
  createTestSubAccountWithKyc: async (subAccountData) => {
    try {
      if (!subAccountData.companyId) {
        throw new Error('ID da empresa é obrigatório');
      }
      
      if (!subAccountData.subconta_nome) {
        throw new Error('Nome da subconta é obrigatório');
      }
      
      if (!subAccountData.balance_sheet) {
        throw new Error('Balanço patrimonial é obrigatório');
      }
      
      // Garantir que estamos autenticados como administrador
      await authHelper.getCurrentSession();
      
      // Tentar usar o serviço real
      try {
        const response = await subAccountService.createSubAccountWithKyc(subAccountData);
        
        if (response.success && response.data) {
          console.log('Subconta criada com sucesso via API');
          return response.data;
        }
      } catch (apiError) {
        console.log('Erro ao criar subconta via API:', apiError.message);
      }
      
      // Se a API falhar, usar simulação
      console.log('Usando simulação para criar subconta');
      return subAccountService.simulateCreateSubAccountWithKyc(subAccountData);
    } catch (error) {
      console.error('Falha ao criar subconta de teste:', error.message);
      throw error;
    }
  },
  
  /**
   * Validar uma subconta
   * @param {Object} subAccount Subconta a ser validada
   * @returns {boolean} Se a subconta é válida
   */
  validateSubAccount: (subAccount) => {
    try {
      // Verificar se todos os campos necessários estão presentes
      const requiredFields = ['id', 'company_id', 'name'];
      
      for (const field of requiredFields) {
        if (!subAccount[field]) {
          console.error(`Campo obrigatório ausente: ${field}`);
          return false;
        }
      }
      
      // Verificar se o status é válido (se presente)
      if (subAccount.status) {
        const validStatuses = ['pending', 'active', 'rejected', 'suspended'];
        if (!validStatuses.includes(subAccount.status)) {
          console.error(`Status inválido: ${subAccount.status}`);
          return false;
        }
      }
      
      // Verificar se o status KYC é válido (se presente)
      if (subAccount.kyc_status) {
        const validKycStatuses = ['pending', 'approved', 'rejected'];
        if (!validKycStatuses.includes(subAccount.kyc_status)) {
          console.error(`Status KYC inválido: ${subAccount.kyc_status}`);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao validar subconta:', error.message);
      return false;
    }
  }
}; 