import { create } from 'zustand';
import { 
  getAllAcquirers, 
  getAcquirerById, 
  getAcquirerFees, 
  toggleAcquirerActive, 
  updateAcquirerFee 
} from '../services/acquirersService';
import { 
  Acquirer, 
  AcquirerFee, 
  UpdateAcquirerActivePayload, 
  UpdateAcquirerFeePayload 
} from '../types/acquirers';

interface AcquirersState {
  acquirers: Acquirer[];
  currentAcquirer: Acquirer | null;
  acquirerFees: AcquirerFee[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAcquirers: (limit?: number) => Promise<void>;
  fetchAcquirerById: (id: string) => Promise<void>;
  fetchAcquirerFees: (id: string) => Promise<void>;
  updateAcquirerActive: (id: string, payload: UpdateAcquirerActivePayload) => Promise<void>;
  updateAcquirerFees: (id: string, payload: UpdateAcquirerFeePayload) => Promise<void>;
  clearError: () => void;
}

export const useAcquirersStore = create<AcquirersState>((set) => ({
  acquirers: [],
  currentAcquirer: null,
  acquirerFees: [],
  isLoading: false,
  error: null,

  fetchAcquirers: async (limit = 100) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getAllAcquirers(limit);
      set({ acquirers: data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch acquirers', isLoading: false });
    }
  },

  fetchAcquirerById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getAcquirerById(id);
      set({ currentAcquirer: data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch acquirer', isLoading: false });
    }
  },

  fetchAcquirerFees: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getAcquirerFees(id);
      set({ acquirerFees: data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch acquirer fees', isLoading: false });
    }
  },

  updateAcquirerActive: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await toggleAcquirerActive(id, payload);
      set((state) => ({
        acquirers: state.acquirers.map((acquirer) => 
          acquirer.id === id ? data : acquirer
        ),
        currentAcquirer: state.currentAcquirer?.id === id ? data : state.currentAcquirer,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update acquirer active status', isLoading: false });
    }
  },

  updateAcquirerFees: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await updateAcquirerFee(id, payload);
      set((state) => ({
        acquirerFees: state.acquirerFees.map((fee) => 
          fee.id === data.id ? data : fee
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update acquirer fees', isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
})); 