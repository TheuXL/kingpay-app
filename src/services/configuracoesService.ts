import { ApiResponse, ConfiguracaoEmpresa, ConfiguracoesGerais, Personalizacao, TermosDeUso } from '../types/configuracoes';
import { supabase } from './supabase';

export const configuracoesService = {
  // Obter termos de uso
  async getTermosDeUso(): Promise<ApiResponse<TermosDeUso>> {
    try {
      const { data, error } = await supabase
        .functions
        .invoke('configuracoes/termos', {
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
      console.error('Erro ao buscar termos de uso:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido ao buscar termos de uso',
        },
      };
    }
  },

  // Atualizar termos de uso
  async updateTermosDeUso(termos: string): Promise<ApiResponse<TermosDeUso>> {
    try {
      const { data, error } = await supabase
        .functions
        .invoke('configuracoes/termos', {
          method: 'PUT',
          body: { termos }
        });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Erro ao atualizar termos de uso:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar termos de uso',
        },
      };
    }
  },

  // Obter configurações gerais
  async getConfiguracoes(): Promise<ApiResponse<ConfiguracoesGerais>> {
    try {
      const { data, error } = await supabase
        .functions
        .invoke('configuracoes', {
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
      console.error('Erro ao buscar configurações gerais:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido ao buscar configurações gerais',
        },
      };
    }
  },

  // Atualizar configurações gerais
  async updateConfiguracoes(configuracoes: Partial<ConfiguracoesGerais>): Promise<ApiResponse<ConfiguracoesGerais>> {
    try {
      const { data, error } = await supabase
        .functions
        .invoke('configuracoes', {
          method: 'PUT',
          body: configuracoes
        });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Erro ao atualizar configurações gerais:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar configurações gerais',
        },
      };
    }
  },

  // Obter configurações de personalização
  async getPersonalizacao(): Promise<ApiResponse<Personalizacao>> {
    try {
      const { data, error } = await supabase
        .functions
        .invoke('personalization', {
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
      console.error('Erro ao buscar configurações de personalização:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido ao buscar configurações de personalização',
        },
      };
    }
  },

  // Atualizar configurações de personalização
  async updatePersonalizacao(personalizacao: Partial<Personalizacao>): Promise<ApiResponse<Personalizacao>> {
    try {
      const { data, error } = await supabase
        .functions
        .invoke('personalization', {
          method: 'PUT',
          body: personalizacao
        });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Erro ao atualizar configurações de personalização:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar configurações de personalização',
        },
      };
    }
  },

  // Obter configurações da empresa
  async getConfiguracoesEmpresa(): Promise<ApiResponse<ConfiguracaoEmpresa>> {
    try {
      const { data, error } = await supabase
        .functions
        .invoke('config-companie-view', {
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
      console.error('Erro ao buscar configurações da empresa:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido ao buscar configurações da empresa',
        },
      };
    }
  }
}; 