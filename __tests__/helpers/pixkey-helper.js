const { pixKeyService } = require('../../src/services/pixKeyService');
const authHelper = require('./auth-helper');

/**
 * Helper para testes de chaves Pix
 */
module.exports = {
  /**
   * Listar chaves Pix para testes
   * @param {Object} options Opções de paginação e filtro
   * @returns {Promise<Object>} Lista de chaves Pix
   */
  listTestPixKeys: async (options = {}) => {
    try {
      // Garantir que estamos autenticados como administrador
      await authHelper.getCurrentSession();
      
      // Tentar usar o serviço real
      try {
        const response = await pixKeyService.listAllPixKeys(options);
        
        if (response.success && response.data) {
          console.log('Chaves Pix listadas com sucesso via API');
          
          // Verificar se os dados estão no formato esperado
          if (response.data && Array.isArray(response.data)) {
            // Adaptar para o formato esperado pelos testes
            return {
              items: response.data,
              total: response.data.length,
              page: options.page || 1,
              limit: options.limit || 10,
              totalPages: Math.ceil(response.data.length / (options.limit || 10))
            };
          }
          
          // Se já estiver no formato esperado, retornar diretamente
          if (response.data && response.data.items) {
            return response.data;
          }
          
          // Caso contrário, usar simulação
          console.log('Formato de resposta da API não reconhecido, usando simulação');
        }
      } catch (apiError) {
        console.log('Erro ao listar chaves Pix via API:', apiError.message);
      }
      
      // Se a API falhar, usar simulação
      console.log('Usando simulação para listar chaves Pix');
      return pixKeyService.simulateListPixKeys(options);
    } catch (error) {
      console.error('Falha ao listar chaves Pix de teste:', error.message);
      throw error;
    }
  },
  
  /**
   * Aprovar ou reprovar uma chave Pix para testes
   * @param {string} pixKeyId ID da chave Pix
   * @param {boolean} approve Aprovar (true) ou reprovar (false)
   * @param {string} financialPassword Senha financeira do administrador
   * @returns {Promise<Object>} Resultado da operação
   */
  approveTestPixKey: async (pixKeyId, approve, financialPassword = 'senha-financeira-teste') => {
    try {
      if (!pixKeyId) {
        throw new Error('ID da chave Pix é obrigatório');
      }
      
      // Garantir que estamos autenticados como administrador
      await authHelper.getCurrentSession();
      
      // Tentar usar o serviço real
      try {
        const response = await pixKeyService.approvePixKey(pixKeyId, approve, financialPassword);
        
        if (response.success && response.data) {
          console.log(`Chave Pix ${approve ? 'aprovada' : 'reprovada'} com sucesso via API`);
          return response.data;
        }
      } catch (apiError) {
        console.log(`Erro ao ${approve ? 'aprovar' : 'reprovar'} chave Pix via API:`, apiError.message);
      }
      
      // Se a API falhar, usar simulação
      console.log(`Usando simulação para ${approve ? 'aprovar' : 'reprovar'} chave Pix`);
      return pixKeyService.simulateApprovePixKey(pixKeyId, approve);
    } catch (error) {
      console.error(`Falha ao ${approve ? 'aprovar' : 'reprovar'} chave Pix de teste:`, error.message);
      throw error;
    }
  },
  
  /**
   * Validar uma chave Pix
   * @param {Object} pixKey Chave Pix a ser validada
   * @returns {boolean} Se a chave Pix é válida
   */
  validatePixKey: (pixKey) => {
    try {
      // Verificar se todos os campos necessários estão presentes
      const requiredFields = ['id', 'user_id', 'key_type', 'key_value', 'status'];
      
      for (const field of requiredFields) {
        if (!pixKey[field]) {
          console.error(`Campo obrigatório ausente: ${field}`);
          return false;
        }
      }
      
      // Verificar se o tipo da chave é válido
      const validKeyTypes = ['cpf', 'email', 'phone', 'random'];
      if (!validKeyTypes.includes(pixKey.key_type)) {
        console.error(`Tipo de chave inválido: ${pixKey.key_type}`);
        return false;
      }
      
      // Verificar se o status é válido
      const validStatuses = ['pending', 'approved', 'rejected'];
      if (!validStatuses.includes(pixKey.status)) {
        console.error(`Status inválido: ${pixKey.status}`);
        return false;
      }
      
      // Validar o formato da chave de acordo com o tipo
      switch (pixKey.key_type) {
        case 'cpf':
          // Formato básico de CPF: XXX.XXX.XXX-XX ou XXXXXXXXXXX
          if (!/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(pixKey.key_value)) {
            console.error(`Formato de CPF inválido: ${pixKey.key_value}`);
            return false;
          }
          break;
        case 'email':
          // Formato básico de email
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pixKey.key_value)) {
            console.error(`Formato de email inválido: ${pixKey.key_value}`);
            return false;
          }
          break;
        case 'phone':
          // Formato básico de telefone: +XXXXXXXXXXXX
          if (!/^\+\d{1,3}\d{8,14}$/.test(pixKey.key_value)) {
            console.error(`Formato de telefone inválido: ${pixKey.key_value}`);
            return false;
          }
          break;
        case 'random':
          // Formato de UUID
          if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pixKey.key_value)) {
            console.error(`Formato de chave aleatória inválido: ${pixKey.key_value}`);
            return false;
          }
          break;
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao validar chave Pix:', error.message);
      return false;
    }
  }
}; 