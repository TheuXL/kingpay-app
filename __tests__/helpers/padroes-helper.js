const axios = require('axios');
require('dotenv').config();

// Importar o serviço de padrões diretamente do app
const { padroesService } = require('../../src/services/padroesService');
// Importar o cliente Supabase para chamadas diretas à API
const { supabase } = require('../../src/services/supabase');

/**
 * Helper para testes de padrões do sistema
 */
module.exports = {
  /**
   * Obter os padrões do sistema para testes
   * @returns {Promise<Object>} Dados dos padrões do sistema
   */
  getPadroes: async function() {
    try {
      // Usar o serviço do app para obter os padrões
      const response = await padroesService.getPadroes();
      
      if (!response.success || !response.data) {
        throw new Error(`Erro ao obter padrões: ${response.error?.message || 'Resposta inválida'}`);
      }
      
      return response.data;
    } catch (error) {
      console.error('Falha ao obter padrões:', error);
      throw error;
    }
  },
  
  /**
   * Atualizar os padrões do sistema para testes
   * @param {Object} dadosPadroes Dados para atualização dos padrões
   * @returns {Promise<Object>} Dados dos padrões atualizados
   */
  updatePadroes: async function(dadosPadroes) {
    try {
      // Usar o serviço do app para atualizar os padrões
      const response = await padroesService.updatePadroes(dadosPadroes);
      
      if (!response.success || !response.data) {
        throw new Error(`Erro ao atualizar padrões: ${response.error?.message || 'Resposta inválida'}`);
      }
      
      return response.data;
    } catch (error) {
      console.error('Falha ao atualizar padrões:', error);
      throw error;
    }
  },
  
  /**
   * Obter os padrões do sistema diretamente da API
   * @returns {Promise<Object>} Dados dos padrões do sistema
   */
  getPadroesDirectAPI: async function() {
    try {
      const { data, error } = await supabase
        .functions
        .invoke('standard', {
          method: 'GET',
        });

      if (error) {
        throw new Error(`Erro ao obter padrões via API direta: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Falha ao obter padrões via API direta:', error);
      throw error;
    }
  },
  
  /**
   * Atualizar os padrões do sistema diretamente da API
   * @param {Object} dadosPadroes Dados para atualização dos padrões
   * @returns {Promise<Object>} Dados dos padrões atualizados
   */
  updatePadroesDirectAPI: async function(dadosPadroes) {
    try {
      const { data, error } = await supabase
        .functions
        .invoke('standard/last', {
          method: 'PATCH',
          body: dadosPadroes
        });

      if (error) {
        throw new Error(`Erro ao atualizar padrões via API direta: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Falha ao atualizar padrões via API direta:', error);
      throw error;
    }
  },
  
  /**
   * Validar a estrutura dos dados de padrões
   * @param {Object} padroes Dados dos padrões a serem validados
   * @returns {boolean} True se a estrutura for válida
   */
  validarEstruturaPadroes: function(padroes) {
    // Verificar se os campos obrigatórios existem
    if (!padroes) return false;
    
    const camposObrigatorios = [
      'id',
      'metodos_pagamento',
      'percentual_reserva_antecipacao',
      'dias_antecipacao',
      'taxa_antecipacao',
      'taxa_saque',
      'valor_minimo_saque',
      'dias_liberacao_saque',
      'created_at',
      'updated_at'
    ];
    
    for (const campo of camposObrigatorios) {
      if (padroes[campo] === undefined) {
        console.error(`Campo obrigatório ausente: ${campo}`);
        return false;
      }
    }
    
    // Verificar se os métodos de pagamento têm a estrutura correta
    if (!Array.isArray(padroes.metodos_pagamento)) {
      console.error('metodos_pagamento deve ser um array');
      return false;
    }
    
    for (const metodo of padroes.metodos_pagamento) {
      const camposMetodo = ['id', 'nome', 'tipo', 'ativo'];
      for (const campo of camposMetodo) {
        if (metodo[campo] === undefined) {
          console.error(`Campo obrigatório ausente em método de pagamento: ${campo}`);
          return false;
        }
      }
      
      // Verificar se o tipo é válido
      if (!['pix', 'boleto', 'cartao'].includes(metodo.tipo)) {
        console.error(`Tipo de método de pagamento inválido: ${metodo.tipo}`);
        return false;
      }
    }
    
    return true;
  }
}; 