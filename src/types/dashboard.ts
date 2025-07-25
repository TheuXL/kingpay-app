/**
 * 📊 TIPOS DO DASHBOARD - KINGPAY
 * ===============================
 * 
 * Tipos baseados nas respostas reais dos endpoints
 * conforme documentação e testes
 */

// ===== DADOS PRINCIPAIS DO DASHBOARD =====
export interface DashboardData {
  countTotal: number;
  countPaid: number;
  sumPaid: number;
  sumValorLiquido: number;
  valorLiquidoAdmin: number;
  countPending: number;
  sumPending: number;
  countRefused: number;
  sumRefused: number;
  countCancelled: number;
  sumCancelled: number;
  countChargeback: number;
  sumChargeback: number;
  countPreChargeback: number;
  sumPreChargeback: number;
  countRefunded: number;
  sumRefunded: number;
  countAntecipacao: number;
  sumAntecipacao: number;
  countAntecipacaoChargeback: number;
  sumAntecipacaoChargeback: number;
  countAntecipacaoPreChargeback: number;
  sumAntecipacaoPreChargeback: number;
  countAntecipacaoRefunded: number;
  sumAntecipacaoRefunded: number;
  countAntecipacaoRefused: number;
  sumAntecipacaoRefused: number;
  countAntecipacaoCancelled: number;
  sumAntecipacaoCancelled: number;
  countAntecipacaoPending: number;
  sumAntecipacaoPending: number;
  countAntecipacaoPaid: number;
  sumAntecipacaoPaid: number;
  countAntecipacaoTotal: number;
  sumAntecipacaoTotal: number;
  countAntecipacaoLiquido: number;
  sumAntecipacaoLiquido: number;
  countAntecipacaoLiquidoAdmin: number;
  sumAntecipacaoLiquidoAdmin: number;
  countAntecipacaoChargebackTotal: number;
  sumAntecipacaoChargebackTotal: number;
  countAntecipacaoPreChargebackTotal: number;
  sumAntecipacaoPreChargebackTotal: number;
  countAntecipacaoRefundedTotal: number;
  sumAntecipacaoRefundedTotal: number;
  countAntecipacaoRefusedTotal: number;
  sumAntecipacaoRefusedTotal: number;
  countAntecipacaoCancelledTotal: number;
  sumAntecipacaoCancelledTotal: number;
  countAntecipacaoPendingTotal: number;
  sumAntecipacaoPendingTotal: number;
  countAntecipacaoPaidTotal: number;
  sumAntecipacaoPaidTotal: number;
  countAntecipacaoTotalTotal: number;
  sumAntecipacaoTotalTotal: number;
  countAntecipacaoLiquidoTotal: number;
  sumAntecipacaoLiquidoTotal: number;
  countAntecipacaoLiquidoAdminTotal: number;
  sumAntecipacaoLiquidoAdminTotal: number;
  countAntecipacaoChargebackLiquido: number;
  sumAntecipacaoChargebackLiquido: number;
  countAntecipacaoPreChargebackLiquido: number;
  sumAntecipacaoPreChargebackLiquido: number;
  countAntecipacaoRefundedLiquido: number;
  sumAntecipacaoRefundedLiquido: number;
  countAntecipacaoRefusedLiquido: number;
  sumAntecipacaoRefusedLiquido: number;
  countAntecipacaoCancelledLiquido: number;
  sumAntecipacaoCancelledLiquido: number;
  countAntecipacaoPendingLiquido: number;
  sumAntecipacaoPendingLiquido: number;
  countAntecipacaoPaidLiquido: number;
  sumAntecipacaoPaidLiquido: number;
  countAntecipacaoTotalLiquido: number;
  sumAntecipacaoTotalLiquido: number;
  countAntecipacaoLiquidoLiquido: number;
  sumAntecipacaoLiquidoLiquido: number;
  countAntecipacaoLiquidoAdminLiquido: number;
  sumAntecipacaoLiquidoAdminLiquido: number;
  countAntecipacaoChargebackLiquidoAdmin: number;
  sumAntecipacaoChargebackLiquidoAdmin: number;
  countAntecipacaoPreChargebackLiquidoAdmin: number;
  sumAntecipacaoPreChargebackLiquidoAdmin: number;
  countAntecipacaoRefundedLiquidoAdmin: number;
  sumAntecipacaoRefundedLiquidoAdmin: number;
  countAntecipacaoRefusedLiquidoAdmin: number;
  sumAntecipacaoRefusedLiquidoAdmin: number;
  countAntecipacaoCancelledLiquidoAdmin: number;
  sumAntecipacaoCancelledLiquidoAdmin: number;
  countAntecipacaoPendingLiquidoAdmin: number;
  sumAntecipacaoPendingLiquidoAdmin: number;
  countAntecipacaoPaidLiquidoAdmin: number;
  sumAntecipacaoPaidLiquidoAdmin: number;
  countAntecipacaoTotalLiquidoAdmin: number;
  sumAntecipacaoTotalLiquidoAdmin: number;
  countAntecipacaoLiquidoLiquidoAdmin: number;
  sumAntecipacaoLiquidoLiquidoAdmin: number;
  countAntecipacaoLiquidoAdminLiquidoAdmin: number;
  sumAntecipacaoLiquidoAdminLiquidoAdmin: number;
}

// ===== DADOS DO GRÁFICO =====
export interface ChartDataPoint {
  data: string; // Ex: "06/2025", "07/2025"
  total_paid_amount: number;
  total_pending_amount: number;
  total_refunded_amount: number;
}

// ===== DADOS DE INFORMAÇÕES ADICIONAIS =====
export interface PaymentMethodInfo {
  metodo: string; // "PIX", "CARD", "BOLETO"
  vendas: number;
  valorTotal: number;
}

export interface AdditionalInfo {
  paymentMethods: PaymentMethodInfo[];
}

// ===== DADOS DE TOP PRODUTOS =====
export interface TopProduct {
  product_name: string;
  total_revenue: number;
  total_sales: number;
}

// ===== DADOS DE TOP VENDEDORES =====
export interface TopSeller {
  seller_name: string;
  total_revenue: number;
  total_sales: number;
}

// ===== DADOS DE FATURAMENTO WHITELABEL =====
export interface WhitelabelBilling {
  faturamentoTotal: number;
  entradasTransacoes: number;
  entradasSaque: number;
  estornos: number;
  entradasAntecipacao: number;
  entradasPreChargeback: number;
  chargeback: number;
  taxasDeAdquirente: number;
  taxasDeBaaS: number;
  taxasDeIntermediacao: number;
  taxasDeAntecipacao: number;
  taxasDeSaque: number;
  taxasDeEstorno: number;
  taxasDeChargeback: number;
  taxasDePreChargeback: number;
  taxasDeAntecipacaoChargeback: number;
  taxasDeAntecipacaoPreChargeback: number;
  taxasDeAntecipacaoRefunded: number;
  taxasDeAntecipacaoRefused: number;
  taxasDeAntecipacaoCancelled: number;
  taxasDeAntecipacaoPending: number;
  taxasDeAntecipacaoPaid: number;
  taxasDeAntecipacaoTotal: number;
  taxasDeAntecipacaoLiquido: number;
  taxasDeAntecipacaoLiquidoAdmin: number;
  taxasDeAntecipacaoChargebackTotal: number;
  taxasDeAntecipacaoPreChargebackTotal: number;
  taxasDeAntecipacaoRefundedTotal: number;
  taxasDeAntecipacaoRefusedTotal: number;
  taxasDeAntecipacaoCancelledTotal: number;
  taxasDeAntecipacaoPendingTotal: number;
  taxasDeAntecipacaoPaidTotal: number;
  taxasDeAntecipacaoTotalTotal: number;
  taxasDeAntecipacaoLiquidoTotal: number;
  taxasDeAntecipacaoLiquidoAdminTotal: number;
  taxasDeAntecipacaoChargebackLiquido: number;
  taxasDeAntecipacaoPreChargebackLiquido: number;
  taxasDeAntecipacaoRefundedLiquido: number;
  taxasDeAntecipacaoRefusedLiquido: number;
  taxasDeAntecipacaoCancelledLiquido: number;
  taxasDeAntecipacaoPendingLiquido: number;
  taxasDeAntecipacaoPaidLiquido: number;
  taxasDeAntecipacaoTotalLiquido: number;
  taxasDeAntecipacaoLiquidoLiquido: number;
  taxasDeAntecipacaoLiquidoAdminLiquido: number;
  taxasDeAntecipacaoChargebackLiquidoAdmin: number;
  taxasDeAntecipacaoPreChargebackLiquidoAdmin: number;
  taxasDeAntecipacaoRefundedLiquidoAdmin: number;
  taxasDeAntecipacaoRefusedLiquidoAdmin: number;
  taxasDeAntecipacaoCancelledLiquidoAdmin: number;
  taxasDeAntecipacaoPendingLiquidoAdmin: number;
  taxasDeAntecipacaoPaidLiquidoAdmin: number;
  taxasDeAntecipacaoTotalLiquidoAdmin: number;
  taxasDeAntecipacaoLiquidoLiquidoAdmin: number;
  taxasDeAntecipacaoLiquidoAdminLiquidoAdmin: number;
}

// ===== DADOS FINANCEIROS WHITELABEL =====
export interface WhitelabelFinancial {
  total_balances: {
    total_balance: number;
    total_balance_card: number;
    total_financial_reserve: number;
  };
  pending_withdrawals: {
    pending_withdrawals_count: number;
    pending_withdrawals_amount: number;
  };
  pending_anticipations: {
    pending_anticipations_count: number;
    pending_anticipations_amount: number;
  };
}

// ===== DADOS DE PROVEDORES =====
export interface Provider {
  provider_name: string;
  total_revenue: number;
  total_sales: number;
}

// ===== DADOS DE ADQUIRENTES =====
export interface Acquirer {
  acquirer_name: string;
  total_revenue: number;
  total_sales: number;
}

// ===== RESPOSTAS DOS ENDPOINTS (Compatíveis com ApiResponse) =====
export interface DashboardResponse {
  success: boolean;
  data?: DashboardData | null;
  error?: string | null;
  status?: number;
}

export interface ChartResponse {
  success: boolean;
  data?: ChartDataPoint[] | null;
  error?: string | null;
  status?: number;
}

export interface AdditionalInfoResponse {
  success: boolean;
  data?: AdditionalInfo | null;
  error?: string | null;
  status?: number;
}

export interface TopProductsResponse {
  success: boolean;
  data?: TopProduct[] | null;
  error?: string | null;
  status?: number;
}

export interface TopSellersResponse {
  success: boolean;
  data?: TopSeller[] | null;
  error?: string | null;
  status?: number;
}

export interface WhitelabelBillingResponse {
  success: boolean;
  data?: WhitelabelBilling | null;
  error?: string | null;
  status?: number;
}

export interface WhitelabelFinancialResponse {
  success: boolean;
  data?: WhitelabelFinancial | null;
  error?: string | null;
  status?: number;
}

export interface ProvidersResponse {
  success: boolean;
  data?: Provider[] | null;
  error?: string | null;
  status?: number;
}

export interface AcquirersResponse {
  success: boolean;
  data?: Acquirer[] | null;
  error?: string | null;
  status?: number;
} 