import { create } from 'zustand';
import { companyService, CompanyFilters } from '@/services/companyService';

export type Company = {
  id: string;
  name: string;
  cnpj: string;
  status: 'approved' | 'pending' | 'rejected';
  created_at: string;
  documents?: any[];
};

export type CompanyDetails = Company & {
  documents: any[];
  approved_at?: string;
  approved_by?: string;
  approval_notes?: string;
  rejected_at?: string;
  rejected_by?: string;
  rejection_reason?: string;
};

type CompanyStats = {
  pendingCount: number | null;
  approvedCount: number | null;
  rejectedCount: number | null;
  totalCount: number | null;
};

type CompanyState = {
  companies: Company[];
  selectedCompany: CompanyDetails | null;
  stats: CompanyStats;
  loading: boolean;
  loadingDetails: boolean;
  filters: CompanyFilters;
  fetchCompanies: (filters?: CompanyFilters) => Promise<void>;
  fetchCompanyById: (id: string) => Promise<void>;
  fetchCompanyStats: () => Promise<void>;
  approveCompany: (id: string, approvalData: { userId: string, notes?: string }) => Promise<void>;
  rejectCompany: (id: string, rejectionData: { userId: string, reason: string }) => Promise<void>;
  setFilters: (filters: CompanyFilters) => void;
};

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  selectedCompany: null,
  stats: { pendingCount: null, approvedCount: null, rejectedCount: null, totalCount: null },
  loading: false,
  loadingDetails: false,
  filters: {},
  
  fetchCompanies: async (filters?: CompanyFilters) => {
    set({ loading: true });
    try {
      const currentFilters = filters || get().filters;
      const data = await companyService.getCompanies(currentFilters);
      set({ companies: data || [], loading: false });
    } catch (error) {
      console.error('Falha ao carregar empresas no store:', error);
      set({ loading: false });
    }
  },
  
  fetchCompanyById: async (id: string) => {
    set({ loadingDetails: true });
    try {
      const data = await companyService.getCompanyById(id);
      set({ selectedCompany: data || null, loadingDetails: false });
    } catch (error) {
      console.error('Falha ao carregar detalhes da empresa no store:', error);
      set({ loadingDetails: false });
    }
  },
  
  fetchCompanyStats: async () => {
    set({ loading: true });
    try {
      const data = await companyService.getCompanyStats();
      set({ stats: data, loading: false });
    } catch (error) {
      console.error('Falha ao carregar estatísticas no store:', error);
      set({ loading: false });
    }
  },
  
  approveCompany: async (id: string, approvalData: { userId: string, notes?: string }) => {
    set({ loadingDetails: true });
    try {
      await companyService.approveCompany(id, approvalData);
      // Atualizar a empresa selecionada se estiver visualizando ela
      if (get().selectedCompany?.id === id) {
        const updatedCompany = await companyService.getCompanyById(id);
        set({ selectedCompany: updatedCompany });
      }
      // Atualizar a lista de empresas e estatísticas
      await get().fetchCompanies();
      await get().fetchCompanyStats();
      set({ loadingDetails: false });
    } catch (error) {
      console.error('Falha ao aprovar empresa no store:', error);
      set({ loadingDetails: false });
    }
  },
  
  rejectCompany: async (id: string, rejectionData: { userId: string, reason: string }) => {
    set({ loadingDetails: true });
    try {
      await companyService.rejectCompany(id, rejectionData);
      // Atualizar a empresa selecionada se estiver visualizando ela
      if (get().selectedCompany?.id === id) {
        const updatedCompany = await companyService.getCompanyById(id);
        set({ selectedCompany: updatedCompany });
      }
      // Atualizar a lista de empresas e estatísticas
      await get().fetchCompanies();
      await get().fetchCompanyStats();
      set({ loadingDetails: false });
    } catch (error) {
      console.error('Falha ao rejeitar empresa no store:', error);
      set({ loadingDetails: false });
    }
  },
  
  setFilters: (filters: CompanyFilters) => {
    set({ filters });
    get().fetchCompanies(filters);
  },
})); 