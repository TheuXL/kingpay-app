import { clientesService } from '@/services/clientesService';
import { create } from 'zustand';
import { Cliente, ClienteFilterParams, CreateClienteRequest, UpdateClienteRequest } from '../types/clientes';

type ClientesState = {
  clientes: Cliente[];
  selectedCliente: Cliente | null;
  loading: boolean;
  loadingDetails: boolean;
  error: string | null;
  filters: ClienteFilterParams;
  totalCount: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  
  // Ações
  fetchClientes: (params?: ClienteFilterParams) => Promise<void>;
  fetchClienteById: (id: string) => Promise<void>;
  createCliente: (clienteData: CreateClienteRequest) => Promise<boolean>;
  updateCliente: (clienteData: UpdateClienteRequest) => Promise<boolean>;
  setFilters: (filters: ClienteFilterParams) => void;
  clearError: () => void;
  clearSelectedCliente: () => void;
};

export const useClientesStore = create<ClientesState>((set, get) => ({
  clientes: [],
  selectedCliente: null,
  loading: false,
  loadingDetails: false,
  error: null,
  filters: {},
  totalCount: 0,
  limit: 10,
  offset: 0,
  hasMore: false,
  
  fetchClientes: async (params?: ClienteFilterParams) => {
    set({ loading: true, error: null });
    try {
      const currentFilters = params || get().filters;
      const response = await clientesService.getClientes(currentFilters);
      
      if (response.success && response.data) {
        const data = response.data as any;
        set({ 
          clientes: data.items || [], 
          totalCount: data.total || 0,
          limit: data.limit || 10,
          offset: data.offset || 0,
          hasMore: data.hasMore || false,
          loading: false 
        });
      } else {
        set({ 
          error: response.error?.message || 'Erro ao buscar clientes',
          loading: false 
        });
      }
    } catch (error) {
      console.error('Falha ao carregar clientes no store:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar clientes',
        loading: false 
      });
    }
  },
  
  fetchClienteById: async (id: string) => {
    set({ loadingDetails: true, error: null });
    try {
      const response = await clientesService.getClienteById(id);
      
      if (response.success && response.data) {
        set({ selectedCliente: response.data as Cliente, loadingDetails: false });
      } else {
        set({ 
          error: response.error?.message || `Erro ao buscar cliente com ID ${id}`,
          loadingDetails: false 
        });
      }
    } catch (error) {
      console.error(`Falha ao carregar detalhes do cliente no store:`, error);
      set({ 
        error: error instanceof Error ? error.message : `Erro desconhecido ao buscar cliente com ID ${id}`,
        loadingDetails: false 
      });
    }
  },
  
  createCliente: async (clienteData) => {
    set({ loading: true, error: null });
    try {
      const response = await clientesService.createCliente(clienteData);
      
      if (response.success) {
        // Atualizar a lista de clientes
        await get().fetchClientes();
        set({ loading: false });
        return true;
      } else {
        set({ 
          error: response.error?.message || 'Erro ao criar cliente',
          loading: false 
        });
        return false;
      }
    } catch (error) {
      console.error('Falha ao criar cliente no store:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido ao criar cliente',
        loading: false 
      });
      return false;
    }
  },
  
  updateCliente: async (clienteData) => {
    set({ loading: true, error: null });
    try {
      const response = await clientesService.updateCliente(clienteData);
      
      if (response.success) {
        // Atualizar o cliente selecionado se estiver visualizando ele
        if (get().selectedCliente?.id === clienteData.id) {
          await get().fetchClienteById(clienteData.id);
        }
        // Atualizar a lista de clientes
        await get().fetchClientes();
        set({ loading: false });
        return true;
      } else {
        set({ 
          error: response.error?.message || 'Erro ao atualizar cliente',
          loading: false 
        });
        return false;
      }
    } catch (error) {
      console.error('Falha ao atualizar cliente no store:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar cliente',
        loading: false 
      });
      return false;
    }
  },
  
  setFilters: (filters: ClienteFilterParams) => {
    set({ filters });
    get().fetchClientes(filters);
  },
  
  clearError: () => set({ error: null }),
  
  clearSelectedCliente: () => set({ selectedCliente: null })
})); 