// src/store/userStore.ts
import create from 'zustand';
import {
    createUser,
    editUser,
    getUserApiKey,
    getUserPermissions,
    getUsers,
    registerUserAndCompany,
} from '../services/userService';
import {
    CreateUserPayload,
    EditUserPayload,
    RegisterUserAndCompanyPayload,
    User,
    UserApiKey,
    UserPermission,
} from '../types/users';

interface UserState {
  users: User[];
  selectedUser: User | null;
  selectedUserApiKey: UserApiKey | null;
  selectedUserPermissions: UserPermission[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  fetchUserApiKey: (userId: string) => Promise<void>;
  fetchUserPermissions: (userId: string) => Promise<void>;
  createUser: (payload: CreateUserPayload) => Promise<void>;
  editUser: (userId: string, payload: EditUserPayload) => Promise<void>;
  registerUserAndCompany: (payload: RegisterUserAndCompanyPayload) => Promise<void>;
  selectUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  selectedUser: null,
  selectedUserApiKey: null,
  selectedUserPermissions: [],
  loading: false,
  error: null,
  fetchUsers: async () => {
    set({ loading: true, error: null });
    const response = await getUsers();
    if (response.success && response.data) {
      set({ users: response.data, loading: false });
    } else {
      set({ error: response.error?.message || 'Failed to fetch users', loading: false });
    }
  },
  fetchUserApiKey: async (userId: string) => {
    set({ loading: true, error: null });
    const response = await getUserApiKey(userId);
    if (response.success && response.data) {
      set({ selectedUserApiKey: response.data, loading: false });
    } else {
      set({ error: response.error?.message || 'Failed to fetch API key', loading: false });
    }
  },
  fetchUserPermissions: async (userId: string) => {
    set({ loading: true, error: null });
    const response = await getUserPermissions(userId);
    if (response.success && response.data) {
      set({ selectedUserPermissions: response.data, loading: false });
    } else {
      set({ error: response.error?.message || 'Failed to fetch permissions', loading: false });
    }
  },
  createUser: async (payload: CreateUserPayload) => {
    set({ loading: true, error: null });
    const response = await createUser(payload);
    if (response.success) {
      set((state) => ({ users: [...state.users, response.data as User], loading: false }));
    } else {
      set({ error: response.error?.message || 'Failed to create user', loading: false });
    }
  },
  editUser: async (userId: string, payload: EditUserPayload) => {
    set({ loading: true, error: null });
    const response = await editUser(userId, payload);
    if (response.success && response.data) {
      set((state) => ({
        users: state.users.map((user) => (user.id === userId ? response.data! : user)),
        selectedUser: state.selectedUser?.id === userId ? response.data : state.selectedUser,
        loading: false,
      }));
    } else {
      set({ error: response.error?.message || 'Failed to edit user', loading: false });
    }
  },
  registerUserAndCompany: async (payload: RegisterUserAndCompanyPayload) => {
    set({ loading: true, error: null });
    const response = await registerUserAndCompany(payload);
    if (response.success) {
      // After registration, you might want to fetch the users list again
      // or add the new user to the state directly if the response returns it.
      set({ loading: false });
    } else {
      set({ error: response.error?.message || 'Failed to register user and company', loading: false });
    }
  },
  selectUser: (user: User | null) => {
    set({ selectedUser: user, selectedUserApiKey: null, selectedUserPermissions: [] });
  },
})); 