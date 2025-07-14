import { create } from 'zustand';
import { padroesService } from '../services/padroesService';
import { AtualizarPadroesRequest, Padroes } from '../types/padroes';

interface PadroesState {
  // Estado
  padroes: Padroes | null;
  loading: boolean;
  error: string | null;
  
  // Ações
  fetchPadroes: () => Promise<void>;
  updatePadroes: (padroes: AtualizarPadroesRequest) => Promise<boolean>;
  clearError: () => void;
}

export const usePadroesStore = create<PadroesState>((set, get) => ({
  // Estado inicial
  padroes: null,
  loading: false,
  error: null,
  
  // Ações
  fetchPadroes: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await padroesService.getPadroes();
      
      if (response.success && response.data) {
        set({ padroes: response.data, loading: false });
      } else {
        set({ 
          error: response.error?.message || 'Erro ao buscar padrões do sistema', 
          loading: false 
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar padrões', 
        loading: false 
      });
    }
  },
  
  updatePadroes: async (dadosPadroes: AtualizarPadroesRequest) => {
    set({ loading: true, error: null });
    
    try {
      const response = await padroesService.updatePadroes(dadosPadroes);
      
      if (response.success && response.data) {
        set({ padroes: response.data, loading: false });
        return true;
      } else {
        set({ 
          error: response.error?.message || 'Erro ao atualizar padrões do sistema', 
          loading: false 
        });
        return false;
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar padrões', 
        loading: false 
      });
      return false;
    }
  },
  
  clearError: () => set({ error: null }),
})); 