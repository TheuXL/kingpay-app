import { create } from 'zustand';
import { clientesService } from '../services/clientesService';
import {
    Cliente,
    ClienteFilterParams,
    CreateClienteRequest,
    UpdateClienteRequest
} from '../types/clientes';

interface ClientesState {
  clientes: Cliente[];
  clienteAtual: Cliente | null;
  isLoading: boolean;
  error: string | null;
  totalClientes: number;
  hasMore: boolean;
  limit: number;
  offset: number;
  
  // Ações
  fetchClientes: (params?: ClienteFilterParams) => Promise<void>;
  fetchClienteById: (id: string) => Promise<void>;
  createCliente: (clienteData: CreateClienteRequest) => Promise<boolean>;
  updateCliente: (clienteData: UpdateClienteRequest) => Promise<boolean>;
  clearClienteAtual: () => void;
  clearError: () => void;
  setOffset: (offset: number) => void;
  setLimit: (limit: number) => void;
}

export const useClientesStore = create<ClientesState>((set, get) => ({
  clientes: [],
  clienteAtual: null,
  isLoading: false,
  error: null,
  totalClientes: 0,
  hasMore: false,
  limit: 10,
  offset: 0,
  
  fetchClientes: async (params?: ClienteFilterParams) => {
    set({ isLoading: true, error: null });
    
    try {
      const { limit, offset } = get();
      const response = await clientesService.getClientes({
        ...params,
        limit,
        offset
      });
      
      if (response.success && response.data) {
        const listResponse = response.data as any;
        
        set({ 
          clientes: listResponse.items || [],
          totalClientes: listResponse.total || 0,
          hasMore: listResponse.hasMore || false,
          isLoading: false 
        });
      } else {
        set({ 
          error: response.error?.message || 'Erro ao buscar clientes', 
          isLoading: false 
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar clientes', 
        isLoading: false 
      });
    }
  },
  
  fetchClienteById: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await clientesService.getClienteById(id);
      
      if (response.success && response.data) {
        set({ 
          clienteAtual: response.data as Cliente,
          isLoading: false 
        });
      } else {
        set({ 
          error: response.error?.message || `Erro ao buscar cliente com ID ${id}`, 
          isLoading: false 
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : `Erro desconhecido ao buscar cliente com ID ${id}`, 
        isLoading: false 
      });
    }
  },
  
  createCliente: async (clienteData: CreateClienteRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await clientesService.createCliente(clienteData);
      
      if (response.success && response.data) {
        // Atualizar a lista de clientes
        const novoCliente = response.data as Cliente;
        set(state => ({ 
          clientes: [...state.clientes, novoCliente],
          clienteAtual: novoCliente,
          totalClientes: state.totalClientes + 1,
          isLoading: false 
        }));
        return true;
      } else {
        set({ 
          error: response.error?.message || 'Erro ao criar cliente', 
          isLoading: false 
        });
        return false;
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido ao criar cliente', 
        isLoading: false 
      });
      return false;
    }
  },
  
  updateCliente: async (clienteData: UpdateClienteRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await clientesService.updateCliente(clienteData);
      
      if (response.success && response.data) {
        const clienteAtualizado = response.data as Cliente;
        
        // Atualizar o cliente na lista
        set(state => ({ 
          clientes: state.clientes.map(c => 
            c.id === clienteAtualizado.id ? clienteAtualizado : c
          ),
          clienteAtual: clienteAtualizado,
          isLoading: false 
        }));
        return true;
      } else {
        set({ 
          error: response.error?.message || 'Erro ao atualizar cliente', 
          isLoading: false 
        });
        return false;
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar cliente', 
        isLoading: false 
      });
      return false;
    }
  },
  
  clearClienteAtual: () => set({ clienteAtual: null }),
  
  clearError: () => set({ error: null }),
  
  setOffset: (offset: number) => set({ offset }),
  
  setLimit: (limit: number) => set({ limit })
})); 