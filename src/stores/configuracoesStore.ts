import { create } from 'zustand';
import { configuracoesService } from '../services/configuracoesService';
import { 
  TermosDeUso, 
  ConfiguracoesGerais, 
  Personalizacao, 
  ConfiguracaoEmpresa 
} from '../types/configuracoes';

interface ConfiguracoesState {
  // Estados
  termosDeUso: TermosDeUso | null;
  configuracoes: ConfiguracoesGerais | null;
  personalizacao: Personalizacao | null;
  configuracaoEmpresa: ConfiguracaoEmpresa | null;
  loadingTermos: boolean;
  loadingConfiguracoes: boolean;
  loadingPersonalizacao: boolean;
  loadingEmpresa: boolean;
  error: string | null;
  
  // Ações
  fetchTermosDeUso: () => Promise<void>;
  updateTermosDeUso: (termos: string) => Promise<boolean>;
  fetchConfiguracoes: () => Promise<void>;
  updateConfiguracoes: (configuracoes: Partial<ConfiguracoesGerais>) => Promise<boolean>;
  fetchPersonalizacao: () => Promise<void>;
  updatePersonalizacao: (personalizacao: Partial<Personalizacao>) => Promise<boolean>;
  fetchConfiguracoesEmpresa: () => Promise<void>;
  resetError: () => void;
}

export const useConfiguracoesStore = create<ConfiguracoesState>((set, get) => ({
  // Estados iniciais
  termosDeUso: null,
  configuracoes: null,
  personalizacao: null,
  configuracaoEmpresa: null,
  loadingTermos: false,
  loadingConfiguracoes: false,
  loadingPersonalizacao: false,
  loadingEmpresa: false,
  error: null,
  
  // Ações
  fetchTermosDeUso: async () => {
    set({ loadingTermos: true, error: null });
    try {
      const response = await configuracoesService.getTermosDeUso();
      if (response.success && response.data) {
        set({ termosDeUso: response.data });
      } else {
        set({ error: response.error?.message || 'Erro ao buscar termos de uso' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar termos de uso' });
    } finally {
      set({ loadingTermos: false });
    }
  },
  
  updateTermosDeUso: async (termos: string) => {
    set({ loadingTermos: true, error: null });
    try {
      const response = await configuracoesService.updateTermosDeUso(termos);
      if (response.success && response.data) {
        set({ termosDeUso: response.data });
        return true;
      } else {
        set({ error: response.error?.message || 'Erro ao atualizar termos de uso' });
        return false;
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar termos de uso' });
      return false;
    } finally {
      set({ loadingTermos: false });
    }
  },
  
  fetchConfiguracoes: async () => {
    set({ loadingConfiguracoes: true, error: null });
    try {
      const response = await configuracoesService.getConfiguracoes();
      if (response.success && response.data) {
        set({ configuracoes: response.data });
      } else {
        set({ error: response.error?.message || 'Erro ao buscar configurações gerais' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar configurações gerais' });
    } finally {
      set({ loadingConfiguracoes: false });
    }
  },
  
  updateConfiguracoes: async (configuracoes: Partial<ConfiguracoesGerais>) => {
    set({ loadingConfiguracoes: true, error: null });
    try {
      const response = await configuracoesService.updateConfiguracoes(configuracoes);
      if (response.success && response.data) {
        set({ configuracoes: response.data });
        return true;
      } else {
        set({ error: response.error?.message || 'Erro ao atualizar configurações gerais' });
        return false;
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar configurações gerais' });
      return false;
    } finally {
      set({ loadingConfiguracoes: false });
    }
  },
  
  fetchPersonalizacao: async () => {
    set({ loadingPersonalizacao: true, error: null });
    try {
      const response = await configuracoesService.getPersonalizacao();
      if (response.success && response.data) {
        set({ personalizacao: response.data });
      } else {
        set({ error: response.error?.message || 'Erro ao buscar configurações de personalização' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar configurações de personalização' });
    } finally {
      set({ loadingPersonalizacao: false });
    }
  },
  
  updatePersonalizacao: async (personalizacao: Partial<Personalizacao>) => {
    set({ loadingPersonalizacao: true, error: null });
    try {
      const response = await configuracoesService.updatePersonalizacao(personalizacao);
      if (response.success && response.data) {
        set({ personalizacao: response.data });
        return true;
      } else {
        set({ error: response.error?.message || 'Erro ao atualizar configurações de personalização' });
        return false;
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar configurações de personalização' });
      return false;
    } finally {
      set({ loadingPersonalizacao: false });
    }
  },
  
  fetchConfiguracoesEmpresa: async () => {
    set({ loadingEmpresa: true, error: null });
    try {
      const response = await configuracoesService.getConfiguracoesEmpresa();
      if (response.success && response.data) {
        set({ configuracaoEmpresa: response.data });
      } else {
        set({ error: response.error?.message || 'Erro ao buscar configurações da empresa' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar configurações da empresa' });
    } finally {
      set({ loadingEmpresa: false });
    }
  },
  
  resetError: () => set({ error: null }),
})); 