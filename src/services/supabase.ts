// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

// Armazenamento em memória para fallback
const inMemoryStorage = new Map<string, string>();

// Valores padrão para quando as variáveis de ambiente não estiverem disponíveis
const DEFAULT_SUPABASE_URL = 'https://ntswqzoftcvzsxwbmsef.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50c3dxem9mdGN2enN4d2Jtc2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MzkyODUsImV4cCI6MjA2NDExNTI4NX0.-UUHbgSHmEd86qgdcwgZ5p6sjBkBOPKNWls9dMaDsgs';

// Usar variáveis de ambiente ou valores padrão
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Implementação customizada de armazenamento para o Supabase
const customStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        const item = localStorage.getItem(key);
        return item;
      } else {
        return inMemoryStorage.get(key) || null;
      }
    } catch (error) {
      console.warn('Erro ao acessar armazenamento:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
      } else {
        inMemoryStorage.set(key, value);
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.warn('Erro ao salvar no armazenamento:', error);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
      } else {
        inMemoryStorage.delete(key);
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.warn('Erro ao remover do armazenamento:', error);
    }
  },
};

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;