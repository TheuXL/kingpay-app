import create from 'zustand';
import { walletService } from '../services/walletService';
import { Wallet, WalletTransaction } from '../types/wallet';

// Define Statement type locally if not exported
interface Statement {
  entries: WalletTransaction[];
  total: number;
}

interface WalletState {
  wallet: Wallet | null;
  statement: Statement | null;
  loading: boolean;
  error: string | null;
  fetchWallet: (userId: string) => Promise<void>;
  fetchStatement: (userId: string, limit?: number, offset?: number) => Promise<void>;
  simulateAnticipation: (userId: string) => Promise<any>;
  removeBalance: (userId: string, amount: number, type: string, reason: string) => Promise<boolean>;
  manageBalance: (userId: string, amount: number, type: string, reason: string, operation: 'add' | 'subtract') => Promise<boolean>;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallet: null,
  statement: null,
  loading: false,
  error: null,

  fetchWallet: async (userId: string) => {
    set({ loading: true, error: null });
    const response = await walletService.getWallet(userId);
    if (response.success && response.data) {
      set({ wallet: response.data, loading: false });
    } else {
      set({ error: response.error?.message || 'Failed to fetch wallet', loading: false });
    }
  },

  fetchStatement: async (userId: string, limit?: number, offset?: number) => {
    set({ loading: true, error: null });
    const response = await walletService.getStatement(userId, limit, offset);
    if (response.success && response.data) {
      set({ statement: response.data, loading: false });
    } else {
      set({ error: response.error?.message || 'Failed to fetch statement', loading: false });
    }
  },

  simulateAnticipation: async (userId: string) => {
    set({ loading: true, error: null });
    // Using transaction_ids as empty array and company_id instead of userId
    const response = await walletService.simulateAnticipation({ 
      transaction_ids: [],
      company_id: userId 
    });
    set({ loading: false, error: response.error?.message || null });
    return response.data;
  },

  removeBalance: async (userId: string, amount: number, type: string, reason: string) => {
    set({ loading: true, error: null });
    const response = await walletService.removeBalance({ 
      user_id: userId, 
      amount, 
      description: reason,
      reference_type: type,
      financial_password: '' // This should be provided by the user
    });
    set({ loading: false, error: response.error?.message || null });
    if(response.success) {
        // Optimistically update or refetch
        const walletResponse = await walletService.getWallet(userId);
        if (walletResponse.success && walletResponse.data) {
            set({ wallet: walletResponse.data });
        }
    }
    return response.success;
  },
  
  manageBalance: async (userId: string, amount: number, type: string, reason: string, operation: 'add' | 'subtract') => {
    set({ loading: true, error: null });
    const operationType = operation === 'add' ? 'credit' : 'debit';
    const response = await walletService.manageBalance({ 
      user_id: userId, 
      amount, 
      description: reason,
      reference_type: type,
      operation: operationType 
    });
    set({ loading: false, error: response.error?.message || null });
    if(response.success) {
        // Optimistically update or refetch
        const walletResponse = await walletService.getWallet(userId);
        if (walletResponse.success && walletResponse.data) {
            set({ wallet: walletResponse.data });
        }
    }
    return response.success;
  }
})); 