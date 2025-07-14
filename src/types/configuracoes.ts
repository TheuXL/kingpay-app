export interface TermosDeUso {
  id?: string;
  conteudo: string;
  versao?: string;
  data_atualizacao?: string;
}

export interface ConfiguracoesGerais {
  id?: string;
  descontarChargebackSaldoDisponivel: boolean;
  reservaFinanceiraHabilitada: boolean;
  percentualReservaFinanceira?: number;
  diasRetencaoReservaFinanceira?: number;
  limiteTransacaoPix?: number;
  limiteTransacaoTed?: number;
  limiteValorDiario?: number;
  [key: string]: any; // Para propriedades adicionais
}

export interface Personalizacao {
  id?: string;
  primary_color: string;
  secondary_color?: string;
  logo_url?: string;
  app_name?: string;
  favicon_url?: string;
  empresa_id?: string;
  [key: string]: any; // Para propriedades adicionais
}

export interface ConfiguracaoEmpresa {
  id?: string;
  nome: string;
  logo_url?: string;
  cnpj?: string;
  website?: string;
  telefone?: string;
  email_suporte?: string;
  endereco?: string;
  personalizacao?: Personalizacao;
  configuracoes?: ConfiguracoesGerais;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
} 