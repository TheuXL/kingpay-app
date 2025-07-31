/**
 * 🌐 SUPABASE CLIENT - KINGPAY
 * ============================
 * 
 * Cliente Supabase configurado para requisições reais
 * - Apenas comunicação direta com API
 * - Sem fallbacks ou mocks
 * - Configuração otimizada para Edge Functions
 */

import { AuthFlowType, SupabaseClientOptions, createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';
import { SecureStoreAdapter } from './SecureStoreAdapter';
import { ENV } from './env';

// Configuração do cliente Supabase
const supabaseUrl = ENV.SUPABASE_URL;
const supabaseAnonKey = ENV.SUPABASE_ANON_KEY;

// Opções otimizadas para Edge Functions
const supabaseOptions: SupabaseClientOptions<'public'> = {
  auth: {
    storage: SecureStoreAdapter, // Usa o armazenamento seguro
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce' as AuthFlowType,
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
  global: {
    headers: {
      'X-Client-Info': 'kingpay-app/js-realtime',
    },
  },
};

// Validação das variáveis de ambiente
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 'As variáveis de ambiente SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórias.';
  console.error('CRITICAL ERROR:', errorMessage);
  // Em um app real, você poderia lançar um erro ou mostrar uma tela de erro para o usuário
  throw new Error(errorMessage);
}

// Criar cliente Supabase
export const supabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  supabaseOptions
);

// Export também como 'supabase' para compatibilidade
export const supabase = supabaseClient;

console.log('🚀 Supabase Client inicializado:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  platform: ENV.platform
});

// A verificação da sessão agora é centralizada no AppContext para evitar redundância.

// Adiciona um listener para o estado do app para reconectar o Realtime
// Ajuda a evitar problemas de token expirado após o app ficar em segundo plano
AppState.addEventListener('change', (nextAppState) => {
  if (nextAppState === 'active') {
    supabaseClient.auth.getSession();
  }
});

// Export default para compatibilidade
export default supabaseClient;