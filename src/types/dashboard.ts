export interface DashboardDateRange {
  start_date: string;
  end_date: string;
}

export interface DashboardData {
  total_vendas: number;
  taxa_aprovacao: number;
  ticket_medio: number;
  total_transacoes: number;
  projecoes_financeiras: {
    mes_atual: number;
    proximo_mes: number;
  };
}

export interface TopSeller {
  id: string;
  nome: string;
  email: string;
  total_vendas: number;
  quantidade_vendas: number;
}

export interface TopProduto {
  id: string;
  nome: string;
  preco: number;
  quantidade_vendida: number;
  total_vendido: number;
}

export interface GraficoData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}

export interface InfosAdicionais {
  fatura_atual: {
    valor: number;
    data_vencimento: string;
    status: string;
  };
  total_clientes: number;
  novos_clientes: number;
  taxa_retencao: number;
} 