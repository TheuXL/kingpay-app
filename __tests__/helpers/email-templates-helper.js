const axios = require('axios');
require('dotenv').config();

// Importar o serviço de templates de email diretamente do app
const { emailTemplatesService } = require('../../src/services/emailTemplatesService');
// Importar o cliente Supabase para chamadas diretas à API
const { supabase } = require('../../src/services/supabase');

// Templates de email mockados para testes
const emailTemplatesMock = [
  {
    id: '1',
    assunto: 'Confirmação de Cadastro',
    remetente_nome: 'KingPay',
    email_body: 'Olá {user_name}, seu cadastro foi confirmado com sucesso!',
    tipo: 'cadastro',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    assunto: 'Recuperação de Senha',
    remetente_nome: 'KingPay',
    email_body: 'Olá {user_name}, você solicitou a recuperação de senha. Clique no link abaixo para redefinir sua senha.',
    tipo: 'recuperacao_senha',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    assunto: 'Notificação de Pagamento',
    remetente_nome: 'KingPay',
    email_body: 'Olá {user_name}, um pagamento no valor de {payment_amount} foi realizado com sucesso!',
    tipo: 'pagamento',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

/**
 * Helper para testes de templates de email
 */
module.exports = {
  /**
   * Obter os templates de email para testes
   * @returns {Promise<Object>} Dados dos templates de email
   */
  getEmailTemplates: async function() {
    try {
      // Usar o serviço do app para obter os templates
      const response = await emailTemplatesService.getEmailTemplates();
      
      if (!response.success || !response.data) {
        throw new Error(`Erro ao obter templates de email: ${response.error?.message || 'Resposta inválida'}`);
      }
      
      return response.data;
    } catch (error) {
      console.error('Falha ao obter templates de email:', error);
      throw error;
    }
  },
  
  /**
   * Atualizar um template de email para testes
   * @param {Object} template Dados para atualização do template
   * @returns {Promise<Object>} Dados do template atualizado
   */
  updateEmailTemplate: async function(template) {
    try {
      // Usar o serviço do app para atualizar o template
      const response = await emailTemplatesService.updateEmailTemplate(template);
      
      if (!response.success || !response.data) {
        throw new Error(`Erro ao atualizar template de email: ${response.error?.message || 'Resposta inválida'}`);
      }
      
      return response.data;
    } catch (error) {
      console.error('Falha ao atualizar template de email:', error);
      throw error;
    }
  },
  
  /**
   * Aceitar os termos de uso para testes
   * @returns {Promise<Object>} Resposta da aceitação dos termos
   */
  aceitarTermos: async function() {
    try {
      // Usar o serviço do app para aceitar os termos
      const response = await emailTemplatesService.aceitarTermos();
      
      if (!response.success || !response.data) {
        throw new Error(`Erro ao aceitar termos: ${response.error?.message || 'Resposta inválida'}`);
      }
      
      return response.data;
    } catch (error) {
      console.error('Falha ao aceitar termos:', error);
      throw error;
    }
  },
  
  /**
   * Obter os templates de email diretamente da API
   * @returns {Promise<Object>} Dados dos templates de email
   */
  getEmailTemplatesDirectAPI: async function() {
    try {
      const { data, error } = await supabase
        .functions
        .invoke('configuracoes/termos', {
          method: 'GET',
        });

      if (error) {
        throw new Error(`Erro ao obter templates de email via API direta: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Falha ao obter templates de email via API direta:', error);
      throw error;
    }
  },
  
  /**
   * Atualizar um template de email diretamente da API
   * @param {Object} template Dados para atualização do template
   * @returns {Promise<Object>} Dados do template atualizado
   */
  updateEmailTemplateDirectAPI: async function(template) {
    try {
      const { data, error } = await supabase
        .functions
        .invoke('configuracoes/emails', {
          method: 'PUT',
          body: template
        });

      if (error) {
        throw new Error(`Erro ao atualizar template de email via API direta: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Falha ao atualizar template de email via API direta:', error);
      throw error;
    }
  },
  
  /**
   * Aceitar os termos de uso diretamente da API
   * @returns {Promise<Object>} Resposta da aceitação dos termos
   */
  aceitarTermosDirectAPI: async function() {
    try {
      const { data, error } = await supabase
        .functions
        .invoke('configuracoes/acecitar-termos', {
          method: 'PUT',
        });

      if (error) {
        throw new Error(`Erro ao aceitar termos via API direta: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Falha ao aceitar termos via API direta:', error);
      throw error;
    }
  },
  
  /**
   * Obter templates de email mockados para testes
   * @returns {Array} Array de templates de email mockados
   */
  getMockEmailTemplates: function() {
    return emailTemplatesMock;
  },
  
  /**
   * Validar a estrutura de um template de email
   * @param {Object} template Template a ser validado
   * @returns {boolean} True se a estrutura for válida
   */
  validarEstruturaTemplate: function(template) {
    // Verificar se os campos obrigatórios existem
    if (!template) return false;
    
    const camposObrigatorios = [
      'id',
      'assunto',
      'remetente_nome',
      'email_body',
      'tipo'
    ];
    
    for (const campo of camposObrigatorios) {
      if (template[campo] === undefined) {
        console.error(`Campo obrigatório ausente: ${campo}`);
        return false;
      }
    }
    
    return true;
  }
}; 