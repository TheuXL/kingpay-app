import {
    ClienteFilterParams,
    ClienteResponse,
    CreateClienteRequest,
    UpdateClienteRequest
} from '../types/clientes';
import { supabase } from './supabase';

export const clientesService = {
  /**
   * Buscar todos os clientes com filtros opcionais
   */
  async getClientes(params?: ClienteFilterParams): Promise<ClienteResponse> {
    try {
      // Construir query parameters
      const queryParams = new URLSearchParams();
      
      if (params?.taxId) {
        queryParams.append('taxid', params.taxId);
      }
      
      if (params?.nome) {
        queryParams.append('nome', params.nome);
      }
      
      if (params?.email) {
        queryParams.append('email', params.email);
      }
      
      if (params?.status) {
        queryParams.append('status', params.status);
      }
      
      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      
      if (params?.offset) {
        queryParams.append('offset', params.offset.toString());
      }

      // Construir a URL com os parâmetros
      const url = `clientes${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

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
      console.error('Erro ao buscar clientes:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido ao buscar clientes',
        },
      };
    }
  },

  /**
   * Buscar um cliente específico pelo ID
   */
  async getClienteById(id: string): Promise<ClienteResponse> {
    try {
      if (!id) {
        throw new Error('ID do cliente é obrigatório');
      }

      const { data, error } = await supabase
        .functions
        .invoke(`clientes/${id}`, {
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
      console.error(`Erro ao buscar cliente com ID ${id}:`, error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : `Erro desconhecido ao buscar cliente com ID ${id}`,
        },
      };
    }
  },

  /**
   * Criar um novo cliente
   */
  async createCliente(clienteData: CreateClienteRequest): Promise<ClienteResponse> {
    try {
      // Validar dados obrigatórios
      if (!clienteData.nome) {
        throw new Error('Nome do cliente é obrigatório');
      }
      
      if (!clienteData.taxId) {
        throw new Error('TaxID (CPF/CNPJ) é obrigatório');
      }
      
      // Validar formato do TaxID
      if (clienteData.tipo === 'PF' && clienteData.taxId.replace(/\D/g, '').length !== 11) {
        throw new Error('CPF deve ter 11 dígitos');
      }
      
      if (clienteData.tipo === 'PJ' && clienteData.taxId.replace(/\D/g, '').length !== 14) {
        throw new Error('CNPJ deve ter 14 dígitos');
      }

      const { data, error } = await supabase
        .functions
        .invoke('clientes', {
          method: 'POST',
          body: clienteData
        });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido ao criar cliente',
        },
      };
    }
  },

  /**
   * Atualizar um cliente existente
   */
  async updateCliente(clienteData: UpdateClienteRequest): Promise<ClienteResponse> {
    try {
      if (!clienteData.id) {
        throw new Error('ID do cliente é obrigatório para atualização');
      }

      // Validar dados opcionais se fornecidos
      if (clienteData.taxId) {
        if (clienteData.tipo === 'PF' && clienteData.taxId.replace(/\D/g, '').length !== 11) {
          throw new Error('CPF deve ter 11 dígitos');
        }
        
        if (clienteData.tipo === 'PJ' && clienteData.taxId.replace(/\D/g, '').length !== 14) {
          throw new Error('CNPJ deve ter 14 dígitos');
        }
      }

      const { data, error } = await supabase
        .functions
        .invoke('clientes', {
          method: 'PUT',
          body: clienteData
        });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar cliente',
        },
      };
    }
  },

  /**
   * Buscar todas as rotas disponíveis
   */
  async getRotas(): Promise<{ success: boolean; data?: string[]; error?: { message: string } }> {
    try {
      const { data, error } = await supabase
        .functions
        .invoke('', {
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
      console.error('Erro ao buscar rotas:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido ao buscar rotas',
        },
      };
    }
  }
}; 