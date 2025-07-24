/**
 * Módulo: Transações
 */
import { supabase } from '@/lib/supabase';
import { getAuthHeaders } from '@/utils/auth';

/**
 * Endpoint: /resumo-transacoes
 */
export const getTransactionsSummary = async () => {
    const headers = await getAuthHeaders();
    const { data, error } = await supabase.functions.invoke('resumo-transacoes', {
        method: 'POST',
        headers,
    });
    if (error) {
        console.error('Erro ao invocar a Edge Function: resumo-transacoes', 'Detalhes:', error);
        throw error;
    }
    return data;
};

/**
 * Endpoint: /historico-transacoes
 */
export const getTransactionHistory = async (filters: { [key: string]: any } = {}) => {
    const headers = await getAuthHeaders();
    const queryString = new URLSearchParams(filters).toString();
    const { data, error } = await supabase.functions.invoke(`historico-transacoes?${queryString}`, {
        method: 'GET',
        headers,
    });
    if (error) {
        console.error('Erro ao invocar a Edge Function: historico-transacoes', 'Detalhes:', error);
        throw error;
    }
    return data;
};