import { create } from 'zustand';
import {
  CalculateTaxesPayload,
  CalculatedTaxes,
  CompanyStatus,
  acceptTerms,
  calculateTaxes,
  createCompany,
  getAllCompanies,
  getCompanyAcquirers,
  getCompanyById,
  getCompanyConfig,
  getCompanyCount,
  getCompanyDocs,
  getCompanyFinancialInfo,
  getCompanyReserve,
  getCompanyTaxes,
  updateCompanyAcquirer,
  updateCompanyConfig,
  updateCompanyConfigBulk,
  updateCompanyInfo,
  updateCompanyReserve,
  updateCompanyStatus,
  updateCompanyTaxes,
} from '../services/companyService';
import {
  Company,
  CompanyAcquirer,
  CompanyConfig,
  CompanyCount,
  CompanyDocument,
  CompanyFinancialInfo,
  CompanyReserve,
  CompanyTaxes,
  CreateCompanyPayload,
  UpdateCompanyPayload as UpdateCompanyAcquirerPayload,
  UpdateCompanyPayload as UpdateCompanyConfigPayload,
  UpdateCompanyPayload as UpdateCompanyInfoPayload,
  UpdateCompanyPayload as UpdateCompanyReservePayload,
  UpdateCompanyStatusPayload,
  UpdateCompanyTaxesPayload,
} from '../types/company';

interface CompanyState {
  companies: Company[];
  companyCount: CompanyCount | null;
  currentCompany: Company | null;
  companyTaxes: CompanyTaxes | null;
  companyReserve: CompanyReserve | null;
  companyConfig: CompanyConfig | null;
  companyDocs: CompanyDocument[];
  companyAcquirers: CompanyAcquirer[];
  companyFinancialInfo: CompanyFinancialInfo | null;
  calculatedTaxes: CalculatedTaxes | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCompanies: (status?: CompanyStatus) => Promise<void>;
  fetchCompanyCount: () => Promise<void>;
  fetchCompanyById: (id: string) => Promise<void>;
  fetchCompanyTaxes: (id: string) => Promise<void>;
  fetchCompanyReserve: (id: string) => Promise<void>;
  fetchCompanyConfig: (id: string) => Promise<void>;
  fetchCompanyDocs: (id: string) => Promise<void>;
  fetchCompanyAcquirers: (id: string) => Promise<void>;
  fetchCompanyFinancialInfo: (id: string) => Promise<void>;
  
  updateTaxes: (id: string, payload: UpdateCompanyTaxesPayload) => Promise<void>;
  updateInfo: (id: string, payload: UpdateCompanyInfoPayload) => Promise<void>;
  updateConfig: (id: string, payload: UpdateCompanyConfigPayload) => Promise<void>;
  updateConfigBulk: (id: string, payload: UpdateCompanyConfigPayload[]) => Promise<void>;
  updateReserve: (id: string, payload: UpdateCompanyReservePayload) => Promise<void>;
  updateAcquirer: (id: string, payload: UpdateCompanyAcquirerPayload) => Promise<void>;
  updateStatus: (id: string, payload: UpdateCompanyStatusPayload) => Promise<void>;
  
  createNewCompany: (payload: CreateCompanyPayload) => Promise<void>;
  calculateCompanyTaxes: (payload: CalculateTaxesPayload) => Promise<void>;
  acceptCompanyTerms: () => Promise<void>;
  
  clearError: () => void;
  clearCurrentCompany: () => void;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  companyCount: null,
  currentCompany: null,
  companyTaxes: null,
  companyReserve: null,
  companyConfig: null,
  companyDocs: [],
  companyAcquirers: [],
  companyFinancialInfo: null,
  calculatedTaxes: null,
  isLoading: false,
  error: null,

  fetchCompanies: async (status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getAllCompanies(status);
      if (response.success) {
        set({ companies: response.data || [] });
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch companies' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCompanyCount: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getCompanyCount();
      if (response.success) {
        set({ companyCount: response.data });
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch company count' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCompanyById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getCompanyById(id);
      if (response.success) {
        set({ currentCompany: response.data });
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch company' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCompanyTaxes: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getCompanyTaxes(id);
      if (response.success) {
        set({ companyTaxes: response.data });
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch company taxes' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCompanyReserve: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getCompanyReserve(id);
      if (response.success) {
        set({ companyReserve: response.data });
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch company reserve' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCompanyConfig: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getCompanyConfig(id);
      if (response.success) {
        set({ companyConfig: response.data });
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch company config' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCompanyDocs: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getCompanyDocs(id);
      if (response.success) {
        set({ companyDocs: response.data || [] });
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch company documents' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCompanyAcquirers: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getCompanyAcquirers(id);
      if (response.success) {
        set({ companyAcquirers: response.data || [] });
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch company acquirers' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCompanyFinancialInfo: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getCompanyFinancialInfo(id);
      if (response.success) {
        set({ companyFinancialInfo: response.data });
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch company financial info' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTaxes: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateCompanyTaxes(id, payload);
      if (response.success) {
        set({ companyTaxes: response.data });
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update company taxes' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateInfo: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateCompanyInfo(id, payload);
      if (response.success) {
        set((state) => ({
          currentCompany: response.data,
          companies: state.companies.map((company) =>
            company.id === id ? { ...company, ...response.data } : company
          ),
        }));
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update company info' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateConfig: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateCompanyConfig(id, payload);
      if (response.success) {
        set({ companyConfig: response.data });
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update company config' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateConfigBulk: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateCompanyConfigBulk(id, payload);
      if (response.success && response.data && response.data.length > 0) {
        // Just update with the first config as we don't handle multiple configs in the state
        set({ companyConfig: response.data[0] });
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update company config in bulk' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateReserve: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateCompanyReserve(id, payload);
      if (response.success) {
        set({ companyReserve: response.data });
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update company reserve' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateAcquirer: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateCompanyAcquirer(id, payload);
      if (response.success) {
        set((state) => ({
          companyAcquirers: state.companyAcquirers.map((acquirer) =>
            acquirer.id === response.data?.id ? { ...acquirer, ...response.data } : acquirer
          ),
        }));
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update company acquirer' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateStatus: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateCompanyStatus(id, payload);
      if (response.success) {
        set((state) => ({
          currentCompany: response.data,
          companies: state.companies.map((company) =>
            company.id === id ? { ...company, ...response.data } : company
          ),
        }));
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update company status' });
    } finally {
      set({ isLoading: false });
    }
  },

  createNewCompany: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createCompany(payload);
      if (response.success) {
        set((state) => ({
          companies: [...state.companies, response.data as Company],
        }));
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create company' });
    } finally {
      set({ isLoading: false });
    }
  },

  calculateCompanyTaxes: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await calculateTaxes(payload);
      if (response.success) {
        set({ calculatedTaxes: response.data });
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to calculate taxes' });
    } finally {
      set({ isLoading: false });
    }
  },

  acceptCompanyTerms: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await acceptTerms();
      if (!response.success) {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to accept terms' });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentCompany: () => set({ currentCompany: null }),
})); 