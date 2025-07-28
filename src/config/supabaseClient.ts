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

// Verificar conectividade na inicialização
supabaseClient.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.warn('⚠️ Erro ao verificar sessão inicial:', error.message);
  } else if (data.session) {
    console.log('✅ Sessão ativa encontrada na inicialização:', {
      userId: data.session.user.id,
      email: data.session.user.email
    });
  } else {
    console.log('ℹ️ Nenhuma sessão ativa na inicialização');
  }
});

// Adiciona um listener para o estado do app para reconectar o Realtime
// Ajuda a evitar problemas de token expirado após o app ficar em segundo plano
AppState.addEventListener('change', (nextAppState) => {
  if (nextAppState === 'active') {
    supabaseClient.auth.getSession();
  }
});

// Export default para compatibilidade
export default supabaseClient;