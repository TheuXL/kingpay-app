import { create } from 'zustand';
import {
  financialService,
  WithdrawalFilters,
  AnticipationFilters
} from '@/services/financialService';

export type Withdrawal = {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  company_id: string;
  companies: { 
    id: string;
    name: string;
    cnpj: string;
  };
  approved_at?: string;
  approved_by?: string;
  approval_notes?: string;
  rejected_at?: string;
  rejected_by?: string;
  rejection_reason?: string;
  paid_at?: string;
  paid_by?: string;
  payment_details?: any;
};

export type Anticipation = {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  company_id: string;
  companies: { 
    id: string;
    name: string;
    cnpj: string;
  };
  approved_at?: string;
  approved_by?: string;
  approval_notes?: string;
  rejected_at?: string;
  rejected_by?: string;
  rejection_reason?: string;
  paid_at?: string;
  paid_by?: string;
  payment_details?: any;
};

export type FinancialStats = {
  pendingWithdrawalsCount: number | null;
  pendingAnticipationsCount: number | null;
  totalPendingCount: number | null;
  totalPendingWithdrawals: number;
  totalPendingAnticipations: number;
  totalPendingAmount: number;
};

type FinancialState = {
  withdrawals: Withdrawal[];
  anticipations: Anticipation[];
  selectedItem: Withdrawal | Anticipation | null;
  stats: FinancialStats | null;
  loadingWithdrawals: boolean;
  loadingAnticipations: boolean;
  loadingStats: boolean;
  withdrawalFilters: WithdrawalFilters;
  anticipationFilters: AnticipationFilters;
  fetchWithdrawals: (filters?: WithdrawalFilters) => Promise<void>;
  fetchAnticipations: (filters?: AnticipationFilters) => Promise<void>;
  fetchWithdrawalById: (id: string) => Promise<void>;
  fetchAnticipationById: (id: string) => Promise<void>;
  fetchFinancialStats: () => Promise<void>;
  approveWithdrawal: (id: string, approvalData: { userId: string, notes?: string }) => Promise<void>;
  rejectWithdrawal: (id: string, rejectionData: { userId: string, reason: string }) => Promise<void>;
  markWithdrawalAsPaid: (id: string, paymentData: { userId: string, paymentDetails?: any }) => Promise<void>;
  approveAnticipation: (id: string, approvalData: { userId: string, notes?: string }) => Promise<void>;
  rejectAnticipation: (id: string, rejectionData: { userId: string, reason: string }) => Promise<void>;
  markAnticipationAsPaid: (id: string, paymentData: { userId: string, paymentDetails?: any }) => Promise<void>;
  setWithdrawalFilters: (filters: WithdrawalFilters) => void;
  setAnticipationFilters: (filters: AnticipationFilters) => void;
};

export const useFinancialStore = create<FinancialState>((set, get) => ({
  withdrawals: [],
  anticipations: [],
  selectedItem: null,
  stats: null,
  loadingWithdrawals: false,
  loadingAnticipations: false,
  loadingStats: false,
  withdrawalFilters: {},
  anticipationFilters: {},
  
  fetchWithdrawals: async (filters?: WithdrawalFilters) => {
    set({ loadingWithdrawals: true });
    try {
      const currentFilters = filters || get().withdrawalFilters;
      const data = await financialService.getWithdrawals(currentFilters);
      set({ withdrawals: data || [], loadingWithdrawals: false });
    } catch (error) {
      console.error('Falha ao carregar saques no store:', error);
      set({ loadingWithdrawals: false });
    }
  },
  
  fetchAnticipations: async (filters?: AnticipationFilters) => {
    set({ loadingAnticipations: true });
    try {
      const currentFilters = filters || get().anticipationFilters;
      const data = await financialService.getAnticipations(currentFilters);
      set({ anticipations: data || [], loadingAnticipations: false });
    } catch (error) {
      console.error('Falha ao carregar antecipações no store:', error);
      set({ loadingAnticipations: false });
    }
  },
  
  fetchWithdrawalById: async (id: string) => {
    set({ loadingWithdrawals: true });
    try {
      const data = await financialService.getWithdrawalById(id);
      set({ selectedItem: data || null, loadingWithdrawals: false });
    } catch (error) {
      console.error('Falha ao carregar saque por ID no store:', error);
      set({ loadingWithdrawals: false });
    }
  },
  
  fetchAnticipationById: async (id: string) => {
    set({ loadingAnticipations: true });
    try {
      const data = await financialService.getAnticipationById(id);
      set({ selectedItem: data || null, loadingAnticipations: false });
    } catch (error) {
      console.error('Falha ao carregar antecipação por ID no store:', error);
      set({ loadingAnticipations: false });
    }
  },
  
  fetchFinancialStats: async () => {
    set({ loadingStats: true });
    try {
      const data = await financialService.getFinancialStats();
      set({ stats: data, loadingStats: false });
    } catch (error) {
      console.error('Falha ao carregar estatísticas financeiras:', error);
      set({ loadingStats: false });
    }
  },
  
  approveWithdrawal: async (id: string, approvalData: { userId: string, notes?: string }) => {
    set({ loadingWithdrawals: true });
    try {
      await financialService.approveWithdrawal(id, approvalData);
      
      // Atualizar o item selecionado se estiver visualizando ele
      if (get().selectedItem?.id === id) {
        const updatedWithdrawal = await financialService.getWithdrawalById(id);
        set({ selectedItem: updatedWithdrawal });
      }
      
      // Atualizar a lista de saques e estatísticas
      await get().fetchWithdrawals();
      await get().fetchFinancialStats();
      
      set({ loadingWithdrawals: false });
    } catch (error) {
      console.error('Falha ao aprovar saque:', error);
      set({ loadingWithdrawals: false });
    }
  },
  
  rejectWithdrawal: async (id: string, rejectionData: { userId: string, reason: string }) => {
    set({ loadingWithdrawals: true });
    try {
      await financialService.rejectWithdrawal(id, rejectionData);
      
      // Atualizar o item selecionado se estiver visualizando ele
      if (get().selectedItem?.id === id) {
        const updatedWithdrawal = await financialService.getWithdrawalById(id);
        set({ selectedItem: updatedWithdrawal });
      }
      
      // Atualizar a lista de saques e estatísticas
      await get().fetchWithdrawals();
      await get().fetchFinancialStats();
      
      set({ loadingWithdrawals: false });
    } catch (error) {
      console.error('Falha ao rejeitar saque:', error);
      set({ loadingWithdrawals: false });
    }
  },
  
  markWithdrawalAsPaid: async (id: string, paymentData: { userId: string, paymentDetails?: any }) => {
    set({ loadingWithdrawals: true });
    try {
      await financialService.markWithdrawalAsPaid(id, paymentData);
      
      // Atualizar o item selecionado se estiver visualizando ele
      if (get().selectedItem?.id === id) {
        const updatedWithdrawal = await financialService.getWithdrawalById(id);
        set({ selectedItem: updatedWithdrawal });
      }
      
      // Atualizar a lista de saques e estatísticas
      await get().fetchWithdrawals();
      await get().fetchFinancialStats();
      
      set({ loadingWithdrawals: false });
    } catch (error) {
      console.error('Falha ao marcar saque como pago:', error);
      set({ loadingWithdrawals: false });
    }
  },
  
  approveAnticipation: async (id: string, approvalData: { userId: string, notes?: string }) => {
    set({ loadingAnticipations: true });
    try {
      await financialService.approveAnticipation(id, approvalData);
      
      // Atualizar o item selecionado se estiver visualizando ele
      if (get().selectedItem?.id === id) {
        const updatedAnticipation = await financialService.getAnticipationById(id);
        set({ selectedItem: updatedAnticipation });
      }
      
      // Atualizar a lista de antecipações e estatísticas
      await get().fetchAnticipations();
      await get().fetchFinancialStats();
      
      set({ loadingAnticipations: false });
    } catch (error) {
      console.error('Falha ao aprovar antecipação:', error);
      set({ loadingAnticipations: false });
    }
  },
  
  rejectAnticipation: async (id: string, rejectionData: { userId: string, reason: string }) => {
    set({ loadingAnticipations: true });
    try {
      await financialService.rejectAnticipation(id, rejectionData);
      
      // Atualizar o item selecionado se estiver visualizando ele
      if (get().selectedItem?.id === id) {
        const updatedAnticipation = await financialService.getAnticipationById(id);
        set({ selectedItem: updatedAnticipation });
      }
      
      // Atualizar a lista de antecipações e estatísticas
      await get().fetchAnticipations();
      await get().fetchFinancialStats();
      
      set({ loadingAnticipations: false });
    } catch (error) {
      console.error('Falha ao rejeitar antecipação:', error);
      set({ loadingAnticipations: false });
    }
  },
  
  markAnticipationAsPaid: async (id: string, paymentData: { userId: string, paymentDetails?: any }) => {
    set({ loadingAnticipations: true });
    try {
      await financialService.markAnticipationAsPaid(id, paymentData);
      
      // Atualizar o item selecionado se estiver visualizando ele
      if (get().selectedItem?.id === id) {
        const updatedAnticipation = await financialService.getAnticipationById(id);
        set({ selectedItem: updatedAnticipation });
      }
      
      // Atualizar a lista de antecipações e estatísticas
      await get().fetchAnticipations();
      await get().fetchFinancialStats();
      
      set({ loadingAnticipations: false });
    } catch (error) {
      console.error('Falha ao marcar antecipação como paga:', error);
      set({ loadingAnticipations: false });
    }
  },
  
  setWithdrawalFilters: (filters: WithdrawalFilters) => {
    set({ withdrawalFilters: filters });
    get().fetchWithdrawals(filters);
  },
  
  setAnticipationFilters: (filters: AnticipationFilters) => {
    set({ anticipationFilters: filters });
    get().fetchAnticipations(filters);
  },
})); 