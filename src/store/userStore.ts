import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { userService, UserFilters, UserData } from '@/services/userService';

type UserState = {
  users: UserData[];
  selectedUser: UserData | null;
  loading: boolean;
  loadingDetails: boolean;
  filters: UserFilters;
  fetchUsers: (filters?: UserFilters) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  createUser: (userData: { email: string, password: string, fullName: string, role: string }) => Promise<void>;
  updateUser: (userId: string, userData: { fullName?: string, role?: string }) => Promise<void>;
  deactivateUser: (userId: string) => Promise<void>;
  reactivateUser: (userId: string) => Promise<void>;
  setFilters: (filters: UserFilters) => void;
};

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  selectedUser: null,
  loading: false,
  loadingDetails: false,
  filters: {},
  
  fetchUsers: async (filters?: UserFilters) => {
    set({ loading: true });
    try {
      const currentFilters = filters || get().filters;
      const data = await userService.getUsers(currentFilters);
      set({ users: data || [], loading: false });
    } catch (error) {
      console.error('Falha ao carregar usuários no store:', error);
      set({ loading: false });
    }
  },
  
  fetchUserById: async (id: string) => {
    set({ loadingDetails: true });
    try {
      const data = await userService.getUserById(id);
      set({ selectedUser: data || null, loadingDetails: false });
    } catch (error) {
      console.error('Falha ao carregar detalhes do usuário no store:', error);
      set({ loadingDetails: false });
    }
  },
  
  createUser: async (userData: { email: string, password: string, fullName: string, role: string }) => {
    set({ loading: true });
    try {
      await userService.createUser(userData);
      // Atualizar a lista de usuários
      await get().fetchUsers();
      set({ loading: false });
    } catch (error) {
      console.error('Falha ao criar usuário no store:', error);
      set({ loading: false });
      throw error; // Propagar erro para tratamento na UI
    }
  },
  
  updateUser: async (userId: string, userData: { fullName?: string, role?: string }) => {
    set({ loadingDetails: true });
    try {
      await userService.updateUser(userId, userData);
      // Atualizar o usuário selecionado se estiver visualizando ele
      if (get().selectedUser?.id === userId) {
        const updatedUser = await userService.getUserById(userId);
        set({ selectedUser: updatedUser });
      }
      // Atualizar a lista de usuários
      await get().fetchUsers();
      set({ loadingDetails: false });
    } catch (error) {
      console.error('Falha ao atualizar usuário no store:', error);
      set({ loadingDetails: false });
      throw error; // Propagar erro para tratamento na UI
    }
  },
  
  deactivateUser: async (userId: string) => {
    set({ loadingDetails: true });
    try {
      await userService.deactivateUser(userId);
      // Atualizar o usuário selecionado se estiver visualizando ele
      if (get().selectedUser?.id === userId) {
        const updatedUser = await userService.getUserById(userId);
        set({ selectedUser: updatedUser });
      }
      // Atualizar a lista de usuários
      await get().fetchUsers();
      set({ loadingDetails: false });
    } catch (error) {
      console.error('Falha ao desativar usuário no store:', error);
      set({ loadingDetails: false });
      throw error; // Propagar erro para tratamento na UI
    }
  },
  
  reactivateUser: async (userId: string) => {
    set({ loadingDetails: true });
    try {
      await userService.reactivateUser(userId);
      // Atualizar o usuário selecionado se estiver visualizando ele
      if (get().selectedUser?.id === userId) {
        const updatedUser = await userService.getUserById(userId);
        set({ selectedUser: updatedUser });
      }
      // Atualizar a lista de usuários
      await get().fetchUsers();
      set({ loadingDetails: false });
    } catch (error) {
      console.error('Falha ao reativar usuário no store:', error);
      set({ loadingDetails: false });
      throw error; // Propagar erro para tratamento na UI
    }
  },
  
  setFilters: (filters: UserFilters) => {
    set({ filters });
    get().fetchUsers(filters);
  },
})); 