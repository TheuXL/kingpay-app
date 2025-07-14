import { DashboardData, DashboardDateRange, GraficoData, InfosAdicionais, TopProduto, TopSeller } from '../types';
import { supabase } from './supabase';

/**
 * Obtém os dados consolidados para o dashboard
 */
export const getDashboardData = async (params: DashboardDateRange): Promise<DashboardData> => {
  const { data, error } = await supabase.functions.invoke('dados-dashboard', {
    method: 'POST',
    body: params,
  });

  if (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    throw new Error('Erro ao buscar dados do dashboard');
  }

  return data;
};

/**
 * Obtém os dados de top sellers para o dashboard
 */
export const getTopSellers = async (params: DashboardDateRange): Promise<TopSeller[]> => {
  // Usando o endpoint POST
  const { data, error } = await supabase.functions.invoke('dados-dashboard/top-sellers', {
    method: 'POST',
    body: params,
  });

  if (error) {
    console.error('Erro ao buscar top sellers:', error);
    throw new Error('Erro ao buscar top sellers');
  }

  return data;
};

/**
 * Obtém os dados de top produtos para o dashboard
 */
export const getTopProdutos = async (params: DashboardDateRange): Promise<TopProduto[]> => {
  const { data, error } = await supabase.functions.invoke('dados-dashboard/top-produtos', {
    method: 'POST',
    body: params,
  });

  if (error) {
    console.error('Erro ao buscar top produtos:', error);
    throw new Error('Erro ao buscar top produtos');
  }

  return data;
};

/**
 * Obtém os dados para gráficos do dashboard
 */
export const getGraficoData = async (params: DashboardDateRange): Promise<GraficoData> => {
  const { data, error } = await supabase.functions.invoke('dados-dashboard/grafico', {
    method: 'POST',
    body: params,
  });

  if (error) {
    console.error('Erro ao buscar dados do gráfico:', error);
    throw new Error('Erro ao buscar dados do gráfico');
  }

  return data;
};

/**
 * Obtém informações adicionais para o dashboard
 */
export const getInfosAdicionais = async (params: DashboardDateRange): Promise<InfosAdicionais> => {
  const { data, error } = await supabase.functions.invoke('dados-dashboard/infos-adicionais', {
    method: 'POST',
    body: params,
  });

  if (error) {
    console.error('Erro ao buscar informações adicionais:', error);
    throw new Error('Erro ao buscar informações adicionais');
  }

  return data;
};

/**
 * Obtém os dados de top sellers usando o endpoint GET alternativo
 */
export const getTopSellersReport = async (startDate: string, endDate: string): Promise<TopSeller[]> => {
  const { data, error } = await supabase.functions.invoke(`analytics-reports/top-sellers/${startDate}/${endDate}`, {
    method: 'GET',
  });

  if (error) {
    console.error('Erro ao buscar relatório de top sellers:', error);
    throw new Error('Erro ao buscar relatório de top sellers');
  }

  return data;
}; 