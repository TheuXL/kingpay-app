import create from 'zustand';
import { billingService } from '../services/billingService';
import { Billing, PayBillingPayload } from '../types/billing';

interface BillingState {
  billings: Billing[];
  loading: boolean;
  error: string | null;
  fetchBillings: () => Promise<void>;
  payBilling: (billingId: string) => Promise<boolean>;
}

export const useBillingStore = create<BillingState>((set, get) => ({
  billings: [],
  loading: false,
  error: null,

  fetchBillings: async () => {
    set({ loading: true, error: null });
    const response = await billingService.getBillings();
    
    if (response.success && response.data) {
      set({ billings: response.data, loading: false });
    } else {
      set({ error: response.error?.message || 'Failed to fetch billings', loading: false });
    }
  },

  payBilling: async (billingId: string) => {
    set({ loading: true, error: null });
    const payload: PayBillingPayload = { billingId, paymentMethod: 'pix' };
    const response = await billingService.payBilling(payload);
    
    if (response.success) {
      // Update the local state to reflect the paid billing
      set((state) => ({
        billings: state.billings.map((billing) =>
          billing.id === billingId
            ? { ...billing, status: 'paid' }
            : billing
        ),
        loading: false,
      }));
      return true;
    } else {
      set({ error: response.error?.message || 'Failed to pay billing', loading: false });
      return false;
    }
  },
})); 