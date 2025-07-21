/**
 * Módulo: Dashboard e Relatórios
 * Endpoints 53-56 da documentação INTEGRACAO.md
 */

import { supabase } from '../../../lib/supabase';

/**
 * Tipos de dados do Dashboard
 */
export interface DashboardData {
  totalRevenue: number;
  totalTransactions: number;
  pendingAmount: number;
  growthPercentage: number;
  chartData: ChartDataPoint[];
  topSellers: TopSeller[];
  topProducts: TopProduct[];
}

export interface ChartDataPoint {
  date: string;
  amount: number;
  transactions: number;
}

export interface TopSeller {
  companyId: string;
  companyName: string;
  totalAmount: number;
  totalTransactions: number;
}

export interface TopProduct {
  productName: string;
  quantity: number;
  totalAmount: number;
}

/**
 * Módulo: Dashboard e Relatórios
 * Endpoints 53-56 da documentação INTEGRACAO.md
 */
export class DashboardService {

  /**
   * Endpoint 53: Obter Dados do Dashboard (POST /functions/v1/dados-dashboard)
   * Propósito: Buscar todos os KPIs e métricas para a tela principal.
   */
  async getDashboardData(startDate: string, endDate: string) {
    try {
      const { data, error } = await supabase.functions.invoke(
        `dados-dashboard?start_date=${startDate}&end_date=${endDate}`,
        { method: 'POST' } // Método POST mesmo sem corpo, conforme documentação
      );
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Endpoint 54: Obter Relatório de Top Sellers (GET /functions/v1/analytics-reports/top-sellers/...)
   * Propósito: Listar as empresas que mais venderam em um período.
   */
  async getTopSellers(startDate: string, endDate: string) {
    try {
      const { data, error } = await supabase.functions.invoke(
        `analytics-reports/top-sellers/${startDate}/${endDate}`,
        { method: 'GET' } // Confirmado como GET
      );
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro no relatório de top sellers:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Endpoint 55: Obter Relatório de Top Produtos (POST /functions/v1/dados-dashboard/top-produtos)
   * Propósito: Listar os produtos mais vendidos.
   */
  async getTopProducts(startDate: string, endDate: string) {
    try {
      const { data, error } = await supabase.functions.invoke(
        `dados-dashboard/top-produtos?start_date=${startDate}&end_date=${endDate}`,
        { method: 'POST' }
      );
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro no relatório de top produtos:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Endpoint 56: Obter Dados para Gráfico de Faturamento (POST /functions/v1/dados-dashboard/grafico)
   * Propósito: Buscar dados agregados por período (dia/mês) para plotar um gráfico.
   */
  async getChartData(startDate: string, endDate: string) {
    try {
      const { data, error } = await supabase.functions.invoke(
        `dados-dashboard/grafico?start_date=${startDate}&end_date=${endDate}`,
        { method: 'POST' }
      );
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados do gráfico:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * POST /functions/v1/dados-dashboard/infos-adicionais
   */
  async getAdditionalInfo(payload: any) {
    try {
      const { data, error } = await supabase.functions.invoke('dados-dashboard/infos-adicionais', {
        method: 'POST',
        body: payload,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar informações adicionais:', error);
      throw error;
    }
  }

  /**
   * POST /functions/v1/dados-dashboard/top-sellers
   */
  async getTopSellersDashboard(payload: any) {
    try {
      const { data, error } = await supabase.functions.invoke('dados-dashboard/top-sellers', {
        method: 'POST',
        body: payload,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar top sellers do dashboard:', error);
      throw error;
    }
  }

  /**
   * POST /functions/v1/dados-dashboard/providers
   */
  async getProvidersDashboard(payload: any) {
    try {
      const { data, error } = await supabase.functions.invoke('dados-dashboard/providers', {
        method: 'POST',
        body: payload,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar providers do dashboard:', error);
      throw error;
    }
  }

  /**
   * POST /functions/v1/dados-dashboard/acquirer
   */
  async getAcquirerDashboard(payload: any) {
    try {
      const { data, error } = await supabase.functions.invoke('dados-dashboard/acquirer', {
        method: 'POST',
        body: payload,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar acquirer do dashboard:', error);
      throw error;
    }
  }

  /**
   * POST /functions/v1/faturamento-whitelabel
   */
  async getWhitelabelRevenue(payload: any) {
    try {
      const { data, error } = await supabase.functions.invoke('faturamento-whitelabel', {
        method: 'POST',
        body: payload,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar faturamento whitelabel:', error);
      throw error;
    }
  }

  /**
   * POST /functions/v1/whitelabel-financeiro
   */
  async getWhitelabelFinancial(payload: any) {
    try {
      const { data, error } = await supabase.functions.invoke('whitelabel-financeiro', {
        method: 'POST',
        body: payload,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar financeiro whitelabel:', error);
      throw error;
    }
  }

  /**
   * GET /analytics-reports/top-sellers/:startDate/:endDate
   * Propósito: Obter um relatório de mais vendidos dentro de um período.
   */
  async getTopSellersReport(startDate: string, endDate: string) {
    try {
      const { data, error } = await supabase.functions.invoke(`analytics-reports/top-sellers/${startDate}/${endDate}`, {
        method: 'GET',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar relatório de top sellers:', error);
      throw error;
    }
  }

  /**
   * Método para obter dados do gráfico de vendas (alias para getChartData)
   * Este método está sendo chamado pelo componente DashboardMain
   */
  async getSalesChart(startDate: string, endDate: string): Promise<ChartDataPoint[]> {
    return await this.getChartData(startDate, endDate);
  }

  // Métodos de compatibilidade com a interface existente
  async getDashboardSummary() {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    return await this.getDashboardData(
      lastMonth.toISOString().split('T')[0],
      today.toISOString().split('T')[0]
    );
  }

  async getMetrics(startDate?: string, endDate?: string) {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const end = endDate || new Date().toISOString().split('T')[0];
    
    return await this.getDashboardData(start, end);
  }
}

export const dashboardService = new DashboardService(); 