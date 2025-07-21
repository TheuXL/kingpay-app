import { supabase } from '../../../lib/supabase';
import { PixKey } from '../types';

/**
 * Módulo: Chaves PIX (Admin e Usuário)
 * Endpoints 26-29 da documentação INTEGRACAO.md
 */
export class PixKeyService {

  /**
   * Endpoint 26: Listar Todas Chaves PIX (Admin) / Próprias chaves (Usuário)
   * GET /functions/v1/pix-key
   * Propósito: Ver todas as chaves PIX cadastradas (admin) ou próprias chaves.
   */
  async getAllPixKeys(page: number = 1, limit: number = 20): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke(`pix-key?limit=${limit}&offset=${(page - 1) * limit}`, {
        method: 'GET',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar chaves PIX:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Endpoint 27: Aprovar/Reprovar Chave PIX (Admin)
   * PATCH /functions/v1/pix-key/:id/approve
   * Propósito: Alterar o status de verificação de uma chave.
   */
  async approvePixKey(keyId: string, shouldApprove: boolean): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke(`pix-key/${keyId}/approve`, {
        method: 'PATCH',
        body: { v: shouldApprove }, // v: true para aprovar, false para reprovar
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao aprovar chave:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Endpoint 28: Criar Chave PIX (Usuário)
   * POST /functions/v1/pix-key
   * Propósito: Permitir que um usuário adicione uma nova chave PIX.
   */
  async createPixKey(key: string, type: string, description: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('pix-key', {
        body: { key, type, description },
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar chave:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Endpoint 29: Atualizar Chave PIX (Usuário)
   * PUT /functions/v1/pix-key/:id
   * Propósito: Editar uma chave PIX existente.
   */
  async updatePixKey(keyId: string, key: string, type: string, description: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke(`pix-key/${keyId}`, {
        method: 'PUT',
        body: { key, type, description },
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar chave:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  // Métodos auxiliares para compatibilidade com código existente
  async getPixKeys(): Promise<PixKey[]> {
    const data = await this.getAllPixKeys();
    return data.data || [];
  }

  async deletePixKey(keyId: string): Promise<boolean> {
    try {
      // Implementar se houver endpoint de deleção na documentação
      console.warn('Método deletePixKey não implementado na documentação atual');
      return false;
    } catch (error) {
      console.error('Erro ao deletar chave PIX:', error);
      return false;
    }
  }
}

export const pixKeyService = new PixKeyService(); 