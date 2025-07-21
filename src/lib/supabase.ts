/**
 * 🌐 SUPABASE CLIENT - KINGPAY LIB
 * ================================
 * 
 * Re-export do cliente Supabase para compatibilidade
 * com imports existentes nos serviços
 */

import { supabaseClient } from '../config/supabaseClient';

// Export padrão como 'supabase' para compatibilidade com imports existentes
export const supabase = supabaseClient;

// Export default também
export default supabaseClient; 