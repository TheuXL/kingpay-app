import { create } from 'zustand';
import { utmfyService } from '../services/utmfyService';
import {
    CreateUtmFyTrackerRequest,
    UpdateUtmFyTrackerRequest,
    UtmFyTracker
} from '../types/utmfy';

interface UtmFyState {
  // Estados
  trackers: UtmFyTracker[];
  selectedTracker: UtmFyTracker | null;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  error: string | null;
  
  // Ações
  fetchTrackers: () => Promise<void>;
  createTracker: (trackerData: CreateUtmFyTrackerRequest) => Promise<boolean>;
  updateTracker: (trackerData: UpdateUtmFyTrackerRequest) => Promise<boolean>;
  selectTracker: (trackerId: string | null) => void;
  resetError: () => void;
}

export const useUtmFyStore = create<UtmFyState>((set, get) => ({
  // Estados iniciais
  trackers: [],
  selectedTracker: null,
  loading: false,
  creating: false,
  updating: false,
  error: null,
  
  // Ações
  fetchTrackers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await utmfyService.getTrackers();
      if (response.success && response.data) {
        // Se a resposta é um array, usamos diretamente, senão convertemos para array
        const trackersArray = Array.isArray(response.data) ? response.data : [response.data];
        set({ trackers: trackersArray });
      } else {
        set({ error: response.error?.message || 'Erro ao buscar rastreadores UTM' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar rastreadores UTM' });
    } finally {
      set({ loading: false });
    }
  },
  
  createTracker: async (trackerData: CreateUtmFyTrackerRequest) => {
    set({ creating: true, error: null });
    try {
      const response = await utmfyService.createTracker(trackerData);
      if (response.success && response.data) {
        // Adiciona o novo rastreador à lista
        const newTracker = Array.isArray(response.data) ? response.data[0] : response.data;
        set(state => ({ 
          trackers: [...state.trackers, newTracker],
          selectedTracker: newTracker
        }));
        return true;
      } else {
        set({ error: response.error?.message || 'Erro ao criar rastreador UTM' });
        return false;
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro desconhecido ao criar rastreador UTM' });
      return false;
    } finally {
      set({ creating: false });
    }
  },
  
  updateTracker: async (trackerData: UpdateUtmFyTrackerRequest) => {
    set({ updating: true, error: null });
    try {
      const response = await utmfyService.updateTracker(trackerData);
      if (response.success && response.data) {
        // Atualiza o rastreador na lista
        const updatedTracker = Array.isArray(response.data) ? response.data[0] : response.data;
        set(state => ({ 
          trackers: state.trackers.map(tracker => 
            tracker.id === updatedTracker.id ? updatedTracker : tracker
          ),
          selectedTracker: state.selectedTracker?.id === updatedTracker.id ? updatedTracker : state.selectedTracker
        }));
        return true;
      } else {
        set({ error: response.error?.message || 'Erro ao atualizar rastreador UTM' });
        return false;
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar rastreador UTM' });
      return false;
    } finally {
      set({ updating: false });
    }
  },
  
  selectTracker: (trackerId: string | null) => {
    if (trackerId === null) {
      set({ selectedTracker: null });
    } else {
      const { trackers } = get();
      const selected = trackers.find(tracker => tracker.id === trackerId) || null;
      set({ selectedTracker: selected });
    }
  },
  
  resetError: () => set({ error: null }),
})); 