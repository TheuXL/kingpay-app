/**
 * Configuração das variáveis de ambiente
 * As variáveis são obtidas do .env através do Expo Config
 */

// Credenciais do Supabase
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://slsikrvjbpblioyinsxu.supabase.co';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsc2lrcnZqYnBibGlveWluc3h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNjgwNjksImV4cCI6MjA2Mzg0NDA2OX0.WqkSEVq2FgPXupHKbXcm04H3CJ2VHj7M8a7EUELw7OQ';

// Configurações de aplicativo
export const APP_NAME = process.env.EXPO_PUBLIC_APP_NAME || 'KINGPAY';
export const APP_DESCRIPTION = process.env.EXPO_PUBLIC_APP_DESCRIPTION || 'Gerencie suas finanças com facilidade'; 