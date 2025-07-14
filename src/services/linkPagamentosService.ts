import {
    CreateLinkPagamentoRequest,
    LinkPagamentoFilterParams,
    LinkPagamentoResponse,
    UpdateLinkPagamentoRequest
} from '../types/linkPagamentos';
import { supabase } from './supabase';

export const linkPagamentosService = {
  /**
   * Buscar todos os links de pagamento com filtros opcionais
   */
  async getLinkPagamentos(params?: LinkPagamentoFilterParams): Promise<LinkPagamentoResponse> {
    try {
      // Construir query parameters
      const queryParams = new URLSearchParams();
      
      if (params?.company) {
        queryParams.append('company', params.company);
      }
      
      if (params?.id) {
        queryParams.append('id', params.id);
      }
      
      if (params?.status) {
        queryParams.append('status', params.status);
      }

      // Construir a URL com os parâmetros
      const url = `link-pagamentos${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

      const { data, error } = await supabase
        .functions
        .invoke(url, {
          method: 'GET',
        });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Erro ao buscar links de pagamento:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido ao buscar links de pagamento',
        },
      };
    }
  },

  /**
   * Buscar um link de pagamento específico pelo ID
   */
  async getLinkPagamentoById(id: string): Promise<LinkPagamentoResponse> {
    try {
      if (!id) {
        throw new Error('ID do link de pagamento é obrigatório');
      }

      const { data, error } = await supabase
        .functions
        .invoke(`link-pagamentos?id=${id}`, {
          method: 'GET',
        });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error(`Erro ao buscar link de pagamento com ID ${id}:`, error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : `Erro desconhecido ao buscar link de pagamento com ID ${id}`,
        },
      };
    }
  },

  /**
   * Buscar a visualização de um link de pagamento pelo ID
   */
  async getLinkPagamentoView(id: string): Promise<LinkPagamentoResponse> {
    try {
      if (!id) {
        throw new Error('ID do link de pagamento é obrigatório');
      }

      const { data, error } = await supabase
        .functions
        .invoke(`link-pagamento-view/${id}`, {
          method: 'GET',
        });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error(`Erro ao buscar visualização do link de pagamento com ID ${id}:`, error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : `Erro desconhecido ao buscar visualização do link de pagamento com ID ${id}`,
        },
      };
    }
  },

  /**
   * Criar um novo link de pagamento
   */
  async createLinkPagamento(linkData: CreateLinkPagamentoRequest): Promise<LinkPagamentoResponse> {
    try {
      // Validar dados obrigatórios
      if (!linkData.nome) {
        throw new Error('Nome do link de pagamento é obrigatório');
      }
      
      if (linkData.valor <= 0) {
        throw new Error('Valor do link de pagamento deve ser maior que zero');
      }
      
      if (!linkData.formas_pagamento || linkData.formas_pagamento.length === 0) {
        throw new Error('Pelo menos uma forma de pagamento deve ser selecionada');
      }
      
      if (!linkData.company_id) {
        throw new Error('ID da empresa é obrigatório');
      }

      const { data, error } = await supabase
        .functions
        .invoke('link-pagamentos', {
          method: 'POST',
          body: linkData
        });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Erro ao criar link de pagamento:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido ao criar link de pagamento',
        },
      };
    }
  },

  /**
   * Atualizar um link de pagamento existente
   */
  async updateLinkPagamento(linkData: UpdateLinkPagamentoRequest): Promise<LinkPagamentoResponse> {
    try {
      if (!linkData.id) {
        throw new Error('ID do link de pagamento é obrigatório para atualização');
      }

      // Validar dados opcionais se fornecidos
      if (linkData.valor !== undefined && linkData.valor <= 0) {
        throw new Error('Valor do link de pagamento deve ser maior que zero');
      }
      
      if (linkData.formas_pagamento !== undefined && linkData.formas_pagamento.length === 0) {
        throw new Error('Pelo menos uma forma de pagamento deve ser selecionada');
      }

      const { data, error } = await supabase
        .functions
        .invoke(`link-pagamentos/${linkData.id}`, {
          method: 'PATCH',
          body: linkData
        });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Erro ao atualizar link de pagamento:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar link de pagamento',
        },
      };
    }
  }
}; 