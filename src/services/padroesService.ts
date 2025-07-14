import { AtualizarPadroesRequest, Padroes, PadroesResponse } from '../types/padroes';
import { supabase } from './supabase';

export const padroesService = {
  /**
   * Obter os padrões do sistema
   * @returns Promise com os padrões do sistema
   */
  async getPadroes(): Promise<PadroesResponse> {
    try {
      const { data, error } = await supabase
        .functions
        .invoke('standard', {
          method: 'GET',
        });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data: data as Padroes
      };
    } catch (error) {
      console.error('Erro ao buscar padrões do sistema:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido ao buscar padrões do sistema',
        },
      };
    }
  },

  /**
   * Atualizar os padrões do sistema
   * @param padroes Dados para atualização dos padrões
   * @returns Promise com os padrões atualizados
   */
  async updatePadroes(padroes: AtualizarPadroesRequest): Promise<PadroesResponse> {
    try {
      const { data, error } = await supabase
        .functions
        .invoke('standard/last', {
          method: 'PATCH',
          body: padroes
        });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data: data as Padroes
      };
    } catch (error) {
      console.error('Erro ao atualizar padrões do sistema:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar padrões do sistema',
        },
      };
    }
  }
}; 