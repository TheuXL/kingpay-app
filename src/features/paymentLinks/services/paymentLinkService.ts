/**
 * Módulo: Links de Pagamento
 */
import { supabase } from '@/lib/supabase';
import { getAuthHeaders } from '@/utils/auth';

// Endpoint: /link-pagamentos (Listar)
export const getPaymentLinks = async () => {
    const headers = await getAuthHeaders();
    const { data, error } = await supabase.functions.invoke('link-pagamentos', {
        method: 'GET',
        headers
    });
    if (error) {
        console.error('Erro ao invocar a Edge Function: link-pagamentos', 'Detalhes:', error);
        throw error;
    }
    return data;
};

// Endpoint: /link-pagamentos (Criar)
export const createPaymentLink = async (linkData: any) => {
    const headers = await getAuthHeaders();
    const { data, error } = await supabase.functions.invoke('link-pagamentos', {
        method: 'POST',
        headers,
        body: linkData,
    });
    if (error) {
        console.error('Erro ao invocar a Edge Function: link-pagamentos (POST)', 'Detalhes:', error);
        throw error;
    }
    return data;
};
