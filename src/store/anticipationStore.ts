// src/store/anticipationStore.ts
import { create } from 'zustand';
import {
  AnticipationFilters,
  DenyAnticipationPayload,
  approveAnticipation as approveAnticipationService,
  denyAnticipation as denyAnticipationService,
  getAnticipations
} from '../services/anticipationService';
import {
  Anticipation,
  ApproveAnticipationPayload
} from '../types/anticipations';

interface AnticipationState {
  anticipations: Anticipation[];
  loading: boolean;
  error: string | null;
  fetchAnticipations: (filters?: AnticipationFilters) => Promise<void>;
  approveAnticipation: (payload: ApproveAnticipationPayload) => Promise<boolean>;
  denyAnticipation: (payload: DenyAnticipationPayload) => Promise<boolean>;
}

export const useAnticipationStore = create<AnticipationState>((set, get) => ({
  anticipations: [],
  loading: false,
  error: null,
  fetchAnticipations: async (filters) => {
    set({ loading: true, error: null });
    try {
      const response = await getAnticipations(filters);
      if (response.success) {
        set({ anticipations: response.data || [], loading: false });
      } else {
        set({ error: response.error?.message || 'Erro ao buscar antecipações', loading: false });
      }
    } catch (error) {
      set({ error: 'Ocorreu um erro inesperado.', loading: false });
    }
  },
  approveAnticipation: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await approveAnticipationService(payload);
      if (response.success) {
        // Refresh the list after approval
        await get().fetchAnticipations();
        set({ loading: false });
        return true;
      } else {
        set({ error: response.error?.message || 'Erro ao aprovar antecipação', loading: false });
        return false;
      }
    } catch (error) {
      set({ error: 'Ocorreu um erro inesperado.', loading: false });
      return false;
    }
  },
  denyAnticipation: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await denyAnticipationService(payload);
      if (response.success) {
        // Refresh the list after denial
        await get().fetchAnticipations();
        set({ loading: false });
        return true;
      } else {
        set({ error: response.error?.message || 'Erro ao negar antecipação', loading: false });
        return false;
      }
    } catch (error) {
      set({ error: 'Ocorreu um erro inesperado.', loading: false });
      return false;
    }
  },
})); 