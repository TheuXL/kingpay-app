// src/store/transactionStore.ts
import create from 'zustand';
import { transactionService } from '../services/transactionService';
import {
  Transaction,
  TransactionFilters,
  TransactionSummary,
} from '../types/transactions';

interface TransactionState {
  transactions: Transaction[];
  summary: TransactionSummary | null;
  selectedTransaction: Transaction | null;
  loading: boolean;
  error: string | null;
  fetchTransactions: (filters: TransactionFilters) => Promise<void>;
  fetchTransactionSummary: (companyId: string) => Promise<void>;
  fetchTransactionById: (transactionId: string) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  summary: null,
  selectedTransaction: null,
  loading: false,
  error: null,
  fetchTransactions: async (filters: TransactionFilters) => {
    set({ loading: true, error: null });
    const response = await transactionService.getAllTransactions(filters);
    if (response.success && response.data) {
      set({ transactions: response.data, loading: false });
    } else {
      set({ error: response.error?.message || 'Failed to fetch transactions', loading: false });
    }
  },
  fetchTransactionSummary: async (companyId: string) => {
    set({ loading: true, error: null });
    const response = await transactionService.getTransactionsSummary();
    if (response.success && response.data) {
      set({ summary: response.data, loading: false });
    } else {
      set({ error: response.error?.message || 'Failed to fetch transaction summary', loading: false });
    }
  },
  fetchTransactionById: async (transactionId: string) => {
    set({ loading: true, error: null });
    const response = await transactionService.getTransactionDetails(transactionId);
    if (response.success && response.data) {
      set({ selectedTransaction: response.data, loading: false });
    } else {
      set({ error: response.error?.message || 'Failed to fetch transaction details', loading: false });
    }
  },
})); 