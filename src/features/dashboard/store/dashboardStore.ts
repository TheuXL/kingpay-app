import { create } from 'zustand';
import { DashboardData, DashboardService } from '../services/dashboardService';

const dashboardService = new DashboardService();

/**
 * Interface para dados de gráfico - compatível com charts
 */
interface GraficoData {
  labels: string[];
  datasets: Array<{
    data: number[];
    label: string;
  }>;
}

/**
 * Interface para top sellers
 */
interface TopSeller {
  id: string;
  nome: string;
  total_vendas: number;
  total_transacoes: number;
}

/**
 * Interface para top produtos
 */
interface TopProduto {
  id: string;
  nome: string;
  quantidade_vendida: number;
  receita_total: number;
}

/**
 * Interface para informações adicionais
 */
interface InfosAdicionais {
  faturamento_total: number;
  clientes_ativos: number;
  crescimento_mensal: number;
}

/**
 * Interface para o estado do dashboard
 */
interface DashboardState {
  // Estados dos dados
  dashboardData: DashboardData | null;
  graficoData: GraficoData | null;
  topSellers: TopSeller[];
  topProdutos: TopProduto[];
  infosAdicionais: InfosAdicionais | null;

  // Estados de loading
  isLoadingDashboard: boolean;
  isLoadingGrafico: boolean;
  isLoadingTopSellers: boolean;
  isLoadingTopProdutos: boolean;
  isLoadingInfosAdicionais: boolean;

  // Estados de erro
  dashboardError: string | null;
  graficoError: string | null;
  topSellersError: string | null;
  topProdutosError: string | null;
  infosAdicionaisError: string | null;

  // Ações
  loadDashboardData: (startDate: string, endDate: string) => Promise<void>;
  loadGraficoData: (startDate: string, endDate: string) => Promise<void>;
  loadTopSellers: (startDate: string, endDate: string) => Promise<void>;
  loadTopProdutos: (startDate: string, endDate: string) => Promise<void>;
  loadInfosAdicionais: (startDate: string, endDate: string) => Promise<void>;
  loadAllData: (startDate: string, endDate: string) => Promise<void>;
  clearErrors: () => void;
  clearData: () => void;
}

/**
 * Store do dashboard usando Zustand
 */
export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Estados iniciais dos dados
  dashboardData: null,
  graficoData: null,
  topSellers: [],
  topProdutos: [],
  infosAdicionais: null,

  // Estados iniciais de loading
  isLoadingDashboard: false,
  isLoadingGrafico: false,
  isLoadingTopSellers: false,
  isLoadingTopProdutos: false,
  isLoadingInfosAdicionais: false,

  // Estados iniciais de erro
  dashboardError: null,
  graficoError: null,
  topSellersError: null,
  topProdutosError: null,
  infosAdicionaisError: null,

  // Ação para carregar dados do dashboard
  loadDashboardData: async (startDate: string, endDate: string) => {
    set({ isLoadingDashboard: true, dashboardError: null });
    
    try {
      const data = await dashboardService.getDashboardData(startDate, endDate);

      set({ 
        dashboardData: data,
        isLoadingDashboard: false,
        dashboardError: null 
      });
    } catch (error) {
      set({ 
        dashboardError: 'Erro inesperado ao carregar dados do dashboard',
        isLoadingDashboard: false 
      });
    }
  },

  // Ação para carregar dados do gráfico (REMOVIDA)
  loadGraficoData: async (startDate: string, endDate: string) => {
    // Lógica removida pois getChartData não existe
  },

  // Ação para carregar top sellers (REMOVIDA)
  loadTopSellers: async (startDate: string, endDate: string) => {
    // Lógica removida pois getTopSellers não existe
  },

  // Ação para carregar top produtos (REMOVIDA)
  loadTopProdutos: async (startDate: string, endDate: string) => {
    // Lógica removida pois getTopProducts não existe
  },

  // Ação para carregar informações adicionais (REMOVIDA)
  loadInfosAdicionais: async (startDate: string, endDate: string) => {
    // Lógica removida pois getAdditionalInfo não existe
  },

  // Ação para carregar todos os dados de uma vez
  loadAllData: async (startDate: string, endDate: string) => {
    const { 
      loadDashboardData, 
      loadGraficoData, 
      loadTopSellers, 
      loadTopProdutos, 
      loadInfosAdicionais 
    } = get();

    // Carregar todos os dados em paralelo
    await Promise.all([
      loadDashboardData(startDate, endDate),
      loadGraficoData(startDate, endDate),
      loadTopSellers(startDate, endDate),
      loadTopProdutos(startDate, endDate),
      loadInfosAdicionais(startDate, endDate),
    ]);
  },

  // Ação para limpar erros
  clearErrors: () => {
    set({
      dashboardError: null,
      graficoError: null,
      topSellersError: null,
      topProdutosError: null,
      infosAdicionaisError: null,
    });
  },

  // Ação para limpar dados
  clearData: () => {
    set({
      dashboardData: null,
      graficoData: null,
      topSellers: [],
      topProdutos: [],
      infosAdicionais: null,
      dashboardError: null,
      graficoError: null,
      topSellersError: null,
      topProdutosError: null,
      infosAdicionaisError: null,
    });
  },
})); 