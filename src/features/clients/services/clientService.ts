import { supabase } from '../../../lib/supabase';

/**
 * Módulo: Clientes (CRM)
 * Endpoints 37-40 da documentação INTEGRACAO.md
 */
export const clientService = {
  /**
   * Endpoint 37: Listar Clientes (GET /functions/v1/clientes)
   * Propósito: Obter a lista de clientes de um vendedor.
   */
  async getClients({ page = 1, limit = 20, name = '', taxid = '' }: {
    page?: number;
    limit?: number;
    name?: string;
    taxid?: string;
  }) {
    try {
      const { data, error } = await supabase.functions.invoke(
        `clientes?limit=${limit}&offset=${(page - 1) * limit}&name=${name}&taxid=${taxid}`,
        { method: 'GET' } // Garantir que seja GET
      );
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao listar clientes:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  },

  /**
   * Endpoint 38: Buscar Cliente por ID (GET /functions/v1/clientes/:id)
   * Propósito: Obter os detalhes de um cliente específico.
   */
  async getClientById(clientId: string) {
    try {
      const { data, error } = await supabase.functions.invoke(`clientes/${clientId}`, {
        method: 'GET', // Garantir que seja GET
      });
      if (error) throw error;
      return data.client;
    } catch (error) {
      console.error('Erro ao buscar cliente:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  },

  /**
   * Endpoint 39: Criar Cliente (POST /functions/v1/clientes)
   * Propósito: Adicionar um novo cliente ao CRM do vendedor.
   * clientPayload contém name, taxid, email, etc.
   */
  async createClient(clientPayload: any) {
    try {
      const { data, error } = await supabase.functions.invoke('clientes', {
        body: clientPayload,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  },

  /**
   * Endpoint 40: Editar Cliente (PUT /functions/v1/clientes)
   * Propósito: Atualizar os dados de um cliente existente.
   * clientPayload deve incluir o 'id' do cliente a ser atualizado
   */
  async updateClient(clientPayload: any) {
    try {
      const { data, error } = await supabase.functions.invoke('clientes', {
        method: 'PUT',
        body: clientPayload,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }
}; 