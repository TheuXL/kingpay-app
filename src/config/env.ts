/**
 * 🌐 CONFIGURAÇÕES DE AMBIENTE - KINGPAY
 * =====================================
 * 
 * Utilitário que funciona tanto para web quanto mobile
 * com fallbacks apropriados para cada plataforma
 * 
 * Configuração baseada na documentação oficial dos endpoints
 */

import { Platform } from 'react-native';

// Tentar importar Constants de forma segura
let Constants: any = null;
try {
  if (Platform.OS !== 'web') {
    Constants = require('expo-constants').default;
  }
} catch (error) {
  console.log('⚠️ expo-constants não disponível, usando fallbacks');
}

/**
 * Obter variável de ambiente de forma segura
 */
function getEnvVar(key: string, defaultValue: string = ''): string {
  // 1. Tentar expo-constants (mobile)
  if (Constants?.expoConfig?.extra?.[key]) {
    return Constants.expoConfig.extra[key];
  }

  // 2. Tentar process.env (web/development)
  if (typeof process !== 'undefined' && process.env) {
    const webKey = `EXPO_PUBLIC_${key}`;
    if (process.env[webKey]) {
      return process.env[webKey] || '';
    }
    
    const nextKey = `NEXT_PUBLIC_${key}`;
    if (process.env[nextKey]) {
      return process.env[nextKey] || '';
    }
    
    const reactKey = `REACT_APP_${key}`;
    if (process.env[reactKey]) {
      return process.env[reactKey] || '';
    }

    if (process.env[key]) {
      return process.env[key] || '';
    }
  }

  // 3. Tentar window.env (web runtime)
  if (typeof window !== 'undefined' && (window as any).env?.[key]) {
    return (window as any).env[key];
  }

  // 4. Fallback para valores padrão
  return defaultValue;
}

/**
 * Configurações do ambiente - Baseadas na documentação dos endpoints
 */
export const ENV = {
  // URLs do Supabase - Base URL conforme documentação
  SUPABASE_URL: getEnvVar('SUPABASE_URL', 'https://slsikrvjbpblioyinsxu.supabase.co'),
  SUPABASE_ANON_KEY: getEnvVar('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsc2lrcnZqYnBibGlveWluc3h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNjgwNjksImV4cCI6MjA2Mzg0NDA2OX0.WqkSEVq2FgPXupHKbXcm04H3CJ2VHj7M8a7EUELw7OQ'),
  
  // Edge Functions - URL das funções edge conforme documentação
  EDGE_FUNCTIONS_URL: getEnvVar('SUPABASE_URL', 'https://slsikrvjbpblioyinsxu.supabase.co'),
  
  // Configurações do app
  APP_NAME: getEnvVar('APP_NAME', 'KingPay'),
  APP_DESCRIPTION: getEnvVar('APP_DESCRIPTION', 'Sistema de Pagamentos KingPay'),
  
  // Service Key para operações administrativas (conforme documentação)
  SUPABASE_SERVICE_KEY: getEnvVar('SUPABASE_SERVICE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsc2lrcnZqYnBibGlveWluc3h1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI2ODA2OSwiZXhwIjoyMDYzODQ0MDY5fQ.fZm0obbKCjZbB6sPzHdAv2j0cUkx2vaQZW96-zAB5rc'),
  
  // Informações de debug
  get platform() {
    return Platform.OS;
  },
  
  get isWeb() {
    return Platform.OS === 'web';
  },
  
  get isMobile() {
    return Platform.OS !== 'web';
  },
  
  // URLs calculadas (sempre iguais ao Supabase)
  get AUTH_URL() {
    return this.SUPABASE_URL;
  },
  
  get API_URL() {
    return this.SUPABASE_URL;
  }
};

/**
 * Log das configurações para debug
 */
export function logEnvConfig() {
  console.log('🔧 ENV Configurações:');
  console.log(`   📱 Platform: ${ENV.platform}`);
  console.log(`   🌐 Supabase URL: ${ENV.SUPABASE_URL}`);
  console.log(`   🚀 Edge Functions URL: ${ENV.EDGE_FUNCTIONS_URL}`);
  console.log(`   🔑 Anon Key: ${ENV.SUPABASE_ANON_KEY ? 'DEFINIDA' : 'NÃO DEFINIDA'}`);
  console.log(`   🔒 Service Key: ${ENV.SUPABASE_SERVICE_KEY ? 'DEFINIDA' : 'NÃO DEFINIDA'}`);
  
  // Validar configurações críticas
  if (!ENV.SUPABASE_URL.includes('supabase.co')) {
    console.warn('⚠️ AVISO: SUPABASE_URL pode estar incorreta');
  }
  
  if (!ENV.SUPABASE_ANON_KEY || ENV.SUPABASE_ANON_KEY.length < 100) {
    console.warn('⚠️ AVISO: SUPABASE_ANON_KEY pode estar incorreta');
  }
  
  // Confirmar que Edge Functions usam o mesmo domínio
  if (ENV.EDGE_FUNCTIONS_URL !== ENV.SUPABASE_URL) {
    console.warn('⚠️ AVISO: Edge Functions URL difere do Supabase URL');
  } else {
    console.log('✅ Edge Functions e Supabase usando mesmo domínio (correto)');
  }
} 