import {
    getDashboardData,
    getGraficoData,
    getInfosAdicionais,
    getTopProdutos,
    getTopSellers,
    getTopSellersReport
} from '@/services';
import { create } from 'zustand';
import { DashboardData, DashboardDateRange, GraficoData, InfosAdicionais, TopProduto, TopSeller } from '../types';

interface DashboardStore {
  // Estados
  isLoading: boolean;
  error: string | null;
  dateRange: DashboardDateRange;
  dashboardData: DashboardData | null;
  topSellers: TopSeller[];
  topProdutos: TopProduto[];
  graficoData: GraficoData | null;
  infosAdicionais: InfosAdicionais | null;

  // Ações
  setDateRange: (dateRange: DashboardDateRange) => void;
  fetchDashboardData: () => Promise<void>;
  fetchTopSellers: () => Promise<void>;
  fetchTopSellersReport: () => Promise<void>;
  fetchTopProdutos: () => Promise<void>;
  fetchGraficoData: () => Promise<void>;
  fetchInfosAdicionais: () => Promise<void>;
  fetchAllDashboardData: () => Promise<void>;
  clearError: () => void;
}

// Obter data atual e data de 30 dias atrás formatadas como YYYY-MM-DD
const today = new Date();
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(today.getDate() - 30);

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  isLoading: false,
  error: null,
  dateRange: {
    start_date: formatDate(thirtyDaysAgo),
    end_date: formatDate(today),
  },
  dashboardData: null,
  topSellers: [],
  topProdutos: [],
  graficoData: null,
  infosAdicionais: null,

  setDateRange: (dateRange) => set({ dateRange }),

  fetchDashboardData: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await getDashboardData(get().dateRange);
      set({ dashboardData: data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro ao buscar dados do dashboard' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTopSellers: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await getTopSellers(get().dateRange);
      set({ topSellers: data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro ao buscar top sellers' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTopSellersReport: async () => {
    try {
      set({ isLoading: true, error: null });
      const { start_date, end_date } = get().dateRange;
      const data = await getTopSellersReport(start_date, end_date);
      set({ topSellers: data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro ao buscar relatório de top sellers' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTopProdutos: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await getTopProdutos(get().dateRange);
      set({ topProdutos: data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro ao buscar top produtos' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchGraficoData: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await getGraficoData(get().dateRange);
      set({ graficoData: data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro ao buscar dados do gráfico' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchInfosAdicionais: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await getInfosAdicionais(get().dateRange);
      set({ infosAdicionais: data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro ao buscar informações adicionais' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAllDashboardData: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Executar todas as requisições em paralelo
      await Promise.all([
        get().fetchDashboardData(),
        get().fetchTopSellers(),
        get().fetchTopProdutos(),
        get().fetchGraficoData(),
        get().fetchInfosAdicionais(),
      ]);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro ao buscar dados do dashboard' });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
})); 