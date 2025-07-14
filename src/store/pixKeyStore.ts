import { create } from 'zustand';
import { pixKeyService } from '../services';
import { PixKey } from '../types';

interface PixKeyStore {
  // Estados
  pixKeys: PixKey[];
  selectedPixKey: PixKey | null;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  
  // Ações
  fetchPixKeys: () => Promise<void>;
  selectPixKey: (pixKey: PixKey) => void;
  clearSelectedPixKey: () => void;
  clearError: () => void;
}

export const usePixKeyStore = create<PixKeyStore>((set) => ({
  // Estados iniciais
  pixKeys: [],
  selectedPixKey: null,
  isLoading: false,
  isCreating: false,
  error: null,
  
  // Ações
  fetchPixKeys: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await pixKeyService.getPixKeys();
      
      if (response.success && response.data) {
        set({ pixKeys: response.data });
      } else {
        set({ error: response.error?.message || 'Erro ao buscar chaves PIX' });
      }
    } catch (error: any) {
      set({ error: error.message || 'Erro desconhecido ao buscar chaves PIX' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  selectPixKey: (pixKey) => {
    set({ selectedPixKey: pixKey });
  },
  
  clearSelectedPixKey: () => {
    set({ selectedPixKey: null });
  },
  
  clearError: () => {
    set({ error: null });
  },
})); 