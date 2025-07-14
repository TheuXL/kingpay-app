import create from 'zustand';
import { baasService } from '../services/baasService';
import { Baas, BaasFee, UpdateBaasFeePayload } from '../types/baas';

interface BaasState {
  baasList: Baas[];
  selectedBaas: Baas | null;
  baasFees: BaasFee[];
  loading: boolean;
  error: string | null;
  
  fetchAllBaas: () => Promise<void>;
  fetchBaasById: (baasId: string) => Promise<void>;
  fetchBaasFees: (baasId: string) => Promise<void>;
  toggleBaasActive: (baasId: string) => Promise<boolean>;
  updateBaasFee: (baasId: string, fee: number) => Promise<boolean>;
}

export const useBaasStore = create<BaasState>((set, get) => ({
  baasList: [],
  selectedBaas: null,
  baasFees: [],
  loading: false,
  error: null,

  fetchAllBaas: async () => {
    set({ loading: true, error: null });
    const response = await baasService.getAllBaas();
    
    if (response.success && response.data) {
      set({ baasList: response.data, loading: false });
    } else {
      set({ error: response.error?.message || 'Failed to fetch BaaS providers', loading: false });
    }
  },

  fetchBaasById: async (baasId: string) => {
    set({ loading: true, error: null });
    const response = await baasService.getBaasById(baasId);
    
    if (response.success && response.data) {
      set({ selectedBaas: response.data, loading: false });
    } else {
      set({ error: response.error?.message || 'Failed to fetch BaaS details', loading: false });
    }
  },

  fetchBaasFees: async (baasId: string) => {
    set({ loading: true, error: null });
    const response = await baasService.getBaasFees(baasId);
    
    if (response.success && response.data) {
      set({ baasFees: response.data, loading: false });
    } else {
      set({ error: response.error?.message || 'Failed to fetch BaaS fees', loading: false });
    }
  },

  toggleBaasActive: async (baasId: string) => {
    set({ loading: true, error: null });
    const response = await baasService.toggleBaasActive(baasId);
    
    if (response.success && response.data) {
      // Update both the list and the selected BaaS if it's the same one
      set((state) => ({
        baasList: state.baasList.map(baas => 
          baas.id === baasId ? response.data! : baas
        ),
        selectedBaas: state.selectedBaas?.id === baasId ? response.data : state.selectedBaas,
        loading: false
      }));
      return true;
    } else {
      set({ error: response.error?.message || 'Failed to toggle BaaS status', loading: false });
      return false;
    }
  },

  updateBaasFee: async (baasId: string, fee: number) => {
    set({ loading: true, error: null });
    const payload: UpdateBaasFeePayload = { fee };
    const response = await baasService.updateBaasFee(baasId, payload);
    
    if (response.success && response.data) {
      // Update the fees list if we have it loaded
      set((state) => ({
        baasFees: state.baasFees.map(baasFee => 
          baasFee.id === response.data!.id ? response.data! : baasFee
        ),
        loading: false
      }));
      return true;
    } else {
      set({ error: response.error?.message || 'Failed to update BaaS fee', loading: false });
      return false;
    }
  }
})); 