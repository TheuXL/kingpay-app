import { create } from 'zustand';
import {
    approveWithdrawal,
    createWithdrawal,
    denyWithdrawal,
    getWithdrawalAggregates,
    getWithdrawals,
    markWithdrawalAsPaidManually
} from '../services/withdrawalService';
import { CreateWithdrawalPayload, Withdrawal, WithdrawalAggregates, WithdrawalFilters } from '../types';

interface WithdrawalState {
  // Estados
  withdrawals: Withdrawal[];
  selectedWithdrawal: Withdrawal | null;
  withdrawalAggregates: WithdrawalAggregates | null;
  filters: WithdrawalFilters;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  error: string | null;
  totalCount: number;
  
  // Ações
  setFilters: (filters: WithdrawalFilters) => void;
  fetchWithdrawals: () => Promise<void>;
  fetchWithdrawalAggregates: (startDate: string, endDate: string) => Promise<void>;
  createNewWithdrawal: (payload: CreateWithdrawalPayload) => Promise<boolean>;
  approveSelectedWithdrawal: () => Promise<boolean>;
  denySelectedWithdrawal: (reasonForDenial: string) => Promise<boolean>;
  markSelectedWithdrawalAsPaidManually: () => Promise<boolean>;
  selectWithdrawal: (withdrawal: Withdrawal) => void;
  clearSelectedWithdrawal: () => void;
  clearError: () => void;
}

export const useWithdrawalStore = create<WithdrawalState>((set, get) => ({
  // Estados iniciais
  withdrawals: [],
  selectedWithdrawal: null,
  withdrawalAggregates: null,
  filters: {
    limit: 10,
    offset: 0,
  },
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  error: null,
  totalCount: 0,
  
  // Ações
  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },
  
  fetchWithdrawals: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getWithdrawals(get().filters);
      
      if (response.success && response.data) {
        set({ 
          withdrawals: response.data,
          totalCount: response.data.length > 0 && 'total_count' in response.data[0] 
            ? (response.data[0] as any).total_count 
            : get().totalCount
        });
      } else {
        set({ error: response.error?.message || 'Erro ao buscar saques' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar saques' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchWithdrawalAggregates: async (startDate, endDate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getWithdrawalAggregates(startDate, endDate);
      
      if (response.success && response.data) {
        set({ withdrawalAggregates: response.data });
      } else {
        set({ error: response.error?.message || 'Erro ao buscar dados agregados de saques' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar dados agregados de saques' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  createNewWithdrawal: async (payload) => {
    set({ isCreating: true, error: null });
    try {
      const response = await createWithdrawal(payload);
      
      if (response.success && response.data) {
        // Atualizar a lista de saques
        await get().fetchWithdrawals();
        return true;
      } else {
        set({ error: response.error?.message || 'Erro ao criar saque' });
        return false;
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro desconhecido ao criar saque' });
      return false;
    } finally {
      set({ isCreating: false });
    }
  },
  
  approveSelectedWithdrawal: async () => {
    const { selectedWithdrawal } = get();
    if (!selectedWithdrawal) {
      set({ error: 'Nenhum saque selecionado' });
      return false;
    }
    
    set({ isUpdating: true, error: null });
    try {
      const response = await approveWithdrawal(selectedWithdrawal.id);
      
      if (response.success && response.data) {
        // Atualizar o saque selecionado e a lista de saques
        set({ selectedWithdrawal: response.data });
        await get().fetchWithdrawals();
        return true;
      } else {
        set({ error: response.error?.message || 'Erro ao aprovar saque' });
        return false;
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro desconhecido ao aprovar saque' });
      return false;
    } finally {
      set({ isUpdating: false });
    }
  },
  
  denySelectedWithdrawal: async (reasonForDenial) => {
    const { selectedWithdrawal } = get();
    if (!selectedWithdrawal) {
      set({ error: 'Nenhum saque selecionado' });
      return false;
    }
    
    set({ isUpdating: true, error: null });
    try {
      const response = await denyWithdrawal(selectedWithdrawal.id, reasonForDenial);
      
      if (response.success && response.data) {
        // Atualizar o saque selecionado e a lista de saques
        set({ selectedWithdrawal: response.data });
        await get().fetchWithdrawals();
        return true;
      } else {
        set({ error: response.error?.message || 'Erro ao negar saque' });
        return false;
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro desconhecido ao negar saque' });
      return false;
    } finally {
      set({ isUpdating: false });
    }
  },
  
  markSelectedWithdrawalAsPaidManually: async () => {
    const { selectedWithdrawal } = get();
    if (!selectedWithdrawal) {
      set({ error: 'Nenhum saque selecionado' });
      return false;
    }
    
    set({ isUpdating: true, error: null });
    try {
      const response = await markWithdrawalAsPaidManually(selectedWithdrawal.id);
      
      if (response.success && response.data) {
        // Atualizar o saque selecionado e a lista de saques
        set({ selectedWithdrawal: response.data });
        await get().fetchWithdrawals();
        return true;
      } else {
        set({ error: response.error?.message || 'Erro ao marcar saque como pago manualmente' });
        return false;
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro desconhecido ao marcar saque como pago manualmente' });
      return false;
    } finally {
      set({ isUpdating: false });
    }
  },
  
  selectWithdrawal: (withdrawal) => {
    set({ selectedWithdrawal: withdrawal });
  },
  
  clearSelectedWithdrawal: () => {
    set({ selectedWithdrawal: null });
  },
  
  clearError: () => {
    set({ error: null });
  },
})); 