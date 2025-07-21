/**
 * Interface para carteira baseada na tabela vb_cdz_gus_wallet_tb
 */
export interface Wallet {
  id: string;
  receiver: string; // UUID do usuário dono da carteira
  balance: number; // Saldo principal (convertido de bigint centavos para reais)
  financial_reserve: number; // Reserva financeira (convertido de bigint)
  balance_card: number; // Saldo de cartão (convertido de bigint)
  total_balance?: number; // Calculado: soma de todos os saldos
}

/**
 * Interface para extrato do usuário baseada na tabela vb_cdz_gus_extrato_user_tb
 */
export interface WalletExtract {
  id: string;
  created_at: string;
  tipo: string; // Tipo da movimentação
  value: number; // Valor em reais (convertido de bigint centavos)
  entrada: boolean; // true = entrada, false = saída
  wallet: string; // UUID da carteira
  user_id: string; // UUID do usuário
  creator: string; // UUID do criador da movimentação
  
  // IDs relacionados (opcionais)
  idtransaction?: string; // ID da transação relacionada
  idsaldoremovido?: string; // ID do saldo removido
  idantecipacao?: string; // ID da antecipação
  
  // Campos adicionais para compatibilidade com componentes
  transaction_type: string; // Alias para 'tipo'
  amount: number; // Alias para 'value'
  date: string; // Alias para 'created_at'
  description: string; // Descrição da movimentação (gerada a partir do tipo)
}

/**
 * Interface para chaves PIX baseada na tabela vb_cdz_gus_pix_keys_tb
 */
export interface PixKey {
  id: string;
  key: string; // A chave PIX
  type: string; // Tipo da chave (cpf, email, phone, random)
  description: string; // Descrição da chave
  creator: string; // UUID do criador
  createdat: string; // Data de criação
  updatedat: string; // Data de atualização
  v?: boolean; // Campo de validação
}

/**
 * Interface para saques baseada na tabela vb_cdz_gus_withdrawals_tb
 */
export interface Withdrawal {
  id: string;
  createdat: string;
  updatedat: string;
  requestedamount: number; // Valor solicitado em reais
  amounttotransfer: number; // Valor a transferir em reais
  fee: number; // Taxa em reais
  pixkeyid: string; // UUID da chave PIX
  companyid: string; // UUID da empresa
  creator: string; // UUID do criador
  status: string; // Status do saque
  description: string; // Descrição
  reason_for_denial?: string; // Motivo da negação
  pago_em?: string; // Data do pagamento
  isPix: boolean; // Se é saque via PIX
  end_to_end_id?: string; // ID end-to-end do PIX
  recipient_name?: string; // Nome do destinatário
  recipient_document?: string; // Documento do destinatário
  recipient_type?: string; // Tipo do destinatário
  negative_deducted?: number; // Valor negativo deduzido
  negative_column?: string; // Coluna negativa
  idBaas?: string; // ID do BaaS
}

/**
 * Interface para valores a receber baseada na tabela vb_cdz_gus_a_receber_tb
 */
export interface Receivable {
  id: string;
  created_at: string;
  amount: number; // Valor em reais (convertido de bigint)
  recebedor: string; // UUID do recebedor
  disponivel_para_antecipar: boolean; // Se está disponível para antecipação
  disponivel_para_antecipar_em: string; // Data quando ficará disponível
  analise: boolean; // Se está em análise
  valor_liquido_pos_antecipacao: number; // Valor líquido pós antecipação
  tipo_contagem_dias: string; // 'uteis' ou 'corridos'
}

/**
 * Interface para resumo financeiro (calculado)
 */
export interface FinancialSummary {
  current_balance: number;
  pending_amount: number;
  reserved_amount: number;
  available_for_withdrawal: number;
  total_received_this_month: number;
  total_fees_this_month: number;
  anticipation_available: number;
}

/**
 * Tipos para filtros de extrato
 */
export interface ExtractFilters {
  start_date?: string;
  end_date?: string;
  transaction_type?: string[];
  min_amount?: number;
  max_amount?: number;
  limit?: number;
  offset?: number;
} 