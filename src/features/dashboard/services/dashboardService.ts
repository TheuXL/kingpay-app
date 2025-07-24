/**
 * Módulo: Dashboard e Relatórios
 */
import { supabase } from '@/lib/supabase';
import { getAuthHeaders } from '@/utils/auth';
import { formatDateForApi } from '@/utils/formatters';

// Endpoint: /whitelabel-financeiro (Usado na Home e Carteira)
export const getFinancialSummary = async () => {
    const headers = await getAuthHeaders();
    const { data, error } = await supabase.functions.invoke('whitelabel-financeiro', { 
        method: 'POST', 
        headers 
    });
    if (error) {
        console.error('Erro na chamada de getFinancialSummary:', error);
        throw error;
    }
    return data;
};

// Endpoint: /dados-dashboard (Usado no Dashboard de Métricas)
export const getDashboardData = async (startDate: Date, endDate: Date) => {
    const headers = await getAuthHeaders();
    const url = `dados-dashboard?start_date=${formatDateForApi(startDate)}&end_date=${formatDateForApi(endDate)}`;
    
    const { data, error } = await supabase.functions.invoke(url, {
        method: 'POST',
        headers,
    });

    if (error) {
        console.error('Erro na chamada de getDashboardData:', error);
        throw error;
    }
    return data;
};

// Endpoint: /dados-dashboard/grafico (Usado na Home)
export const getChartData = async (startDate: Date, endDate: Date) => {
    const headers = await getAuthHeaders();
    const url = `dados-dashboard/grafico?start_date=${formatDateForApi(startDate)}&end_date=${formatDateForApi(endDate)}`;
    
    const { data, error } = await supabase.functions.invoke(url, {
        method: 'POST',
        headers,
    });

    if (error) {
        console.error('Erro na chamada de getChartData:', error);
        throw error;
    }
    return data;
};

// Endpoint: /dados-dashboard/infos-adicionais (Usado no Dashboard de Métricas)
export const getAdditionalInfo = async (startDate: Date, endDate: Date) => {
    const headers = await getAuthHeaders();
    const url = `dados-dashboard/infos-adicionais?start_date=${formatDateForApi(startDate)}&end_date=${formatDateForApi(endDate)}`;

    const { data, error } = await supabase.functions.invoke(url, {
        method: 'POST',
        headers,
    });

    if (error) {
        console.error('Erro na chamada de getAdditionalInfo:', error);
        throw error;
    }
    return data;
};

// Endpoint: /transactions/summary (Usado na Home para Análise de Vendas)
export const getTransactionSummary = async (startDate: Date, endDate: Date) => {
    const headers = await getAuthHeaders();
    const url = `transactions/summary?start_date=${formatDateForApi(startDate)}&end_date=${formatDateForApi(endDate)}`;

    const { data, error } = await supabase.functions.invoke(url, {
        method: 'GET', // Alterado de POST para GET
        headers,
    });

    if (error) {
        console.error('Erro na chamada de getTransactionSummary:', error);
        throw error;
    }
    return data;
}; 