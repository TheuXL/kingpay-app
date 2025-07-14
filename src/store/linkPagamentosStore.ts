import { create } from 'zustand';
import { linkPagamentosService } from '../services/linkPagamentosService';
import {
    CreateLinkPagamentoRequest,
    LinkPagamento,
    LinkPagamentoFilterParams,
    LinkPagamentoListResponse,
    LinkPagamentoView,
    UpdateLinkPagamentoRequest
} from '../types/linkPagamentos';

interface LinkPagamentosState {
  // Estado
  linkPagamentos: LinkPagamento[];
  linkPagamentoAtual: LinkPagamento | undefined;
  linkPagamentoView: LinkPagamentoView | undefined;
  loading: boolean;
  error: string | null;
  totalItems: number;
  hasMore: boolean;
  
  // Ações
  fetchLinkPagamentos: (params?: LinkPagamentoFilterParams) => Promise<void>;
  fetchLinkPagamentoById: (id: string) => Promise<void>;
  fetchLinkPagamentoView: (id: string) => Promise<void>;
  createLinkPagamento: (linkData: CreateLinkPagamentoRequest) => Promise<boolean>;
  updateLinkPagamento: (linkData: UpdateLinkPagamentoRequest) => Promise<boolean>;
  clearLinkPagamentoAtual: () => void;
  clearError: () => void;
}

export const useLinkPagamentosStore = create<LinkPagamentosState>((set, get) => ({
  // Estado inicial
  linkPagamentos: [],
  linkPagamentoAtual: undefined,
  linkPagamentoView: undefined,
  loading: false,
  error: null,
  totalItems: 0,
  hasMore: false,
  
  // Ações
  fetchLinkPagamentos: async (params?: LinkPagamentoFilterParams) => {
    set({ loading: true, error: null });
    
    try {
      const response = await linkPagamentosService.getLinkPagamentos(params);
      
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Erro ao buscar links de pagamento');
      }
      
      const data = response.data as LinkPagamentoListResponse;
      
      set({
        linkPagamentos: data.items,
        totalItems: data.total,
        hasMore: data.hasMore,
        loading: false
      });
    } catch (error) {
      console.error('Erro ao buscar links de pagamento:', error);
      set({
        error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar links de pagamento',
        loading: false
      });
    }
  },
  
  fetchLinkPagamentoById: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await linkPagamentosService.getLinkPagamentoById(id);
      
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || `Erro ao buscar link de pagamento com ID ${id}`);
      }
      
      set({
        linkPagamentoAtual: response.data as LinkPagamento,
        loading: false
      });
    } catch (error) {
      console.error(`Erro ao buscar link de pagamento com ID ${id}:`, error);
      set({
        error: error instanceof Error ? error.message : `Erro desconhecido ao buscar link de pagamento com ID ${id}`,
        loading: false
      });
    }
  },
  
  fetchLinkPagamentoView: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await linkPagamentosService.getLinkPagamentoView(id);
      
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || `Erro ao buscar visualização do link de pagamento com ID ${id}`);
      }
      
      set({
        linkPagamentoView: response.data as LinkPagamentoView,
        loading: false
      });
    } catch (error) {
      console.error(`Erro ao buscar visualização do link de pagamento com ID ${id}:`, error);
      set({
        error: error instanceof Error ? error.message : `Erro desconhecido ao buscar visualização do link de pagamento com ID ${id}`,
        loading: false
      });
    }
  },
  
  createLinkPagamento: async (linkData: CreateLinkPagamentoRequest) => {
    set({ loading: true, error: null });
    
    try {
      const response = await linkPagamentosService.createLinkPagamento(linkData);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Erro ao criar link de pagamento');
      }
      
      // Atualizar a lista de links após a criação
      await get().fetchLinkPagamentos({ company: linkData.company_id });
      
      set({ loading: false });
      return true;
    } catch (error) {
      console.error('Erro ao criar link de pagamento:', error);
      set({
        error: error instanceof Error ? error.message : 'Erro desconhecido ao criar link de pagamento',
        loading: false
      });
      return false;
    }
  },
  
  updateLinkPagamento: async (linkData: UpdateLinkPagamentoRequest) => {
    set({ loading: true, error: null });
    
    try {
      const response = await linkPagamentosService.updateLinkPagamento(linkData);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Erro ao atualizar link de pagamento');
      }
      
      // Atualizar o link atual após a edição
      if (get().linkPagamentoAtual?.id === linkData.id) {
        await get().fetchLinkPagamentoById(linkData.id);
      }
      
      // Atualizar a lista de links se estiver carregada
      if (get().linkPagamentos.length > 0) {
        const companyId = get().linkPagamentos[0]?.company_id;
        if (companyId) {
          await get().fetchLinkPagamentos({ company: companyId });
        }
      }
      
      set({ loading: false });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar link de pagamento:', error);
      set({
        error: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar link de pagamento',
        loading: false
      });
      return false;
    }
  },
  
  clearLinkPagamentoAtual: () => {
    set({ linkPagamentoAtual: undefined });
  },
  
  clearError: () => {
    set({ error: null });
  }
})); 