// =================== TIPOS GERAIS ===================
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T | null;
  error?: string | null;
  message?: string;
  status?: number;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
  page?: number;
  per_page?: number;
}

export interface DateRangeParams {
  start_date?: string;
  end_date?: string;
  startDate?: string;
  endDate?: string;
  createdatstart?: string;
  createdatend?: string;
}

// =================== AUTENTICAÇÃO ===================
export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  user: UserData;
}

export interface SignUpRequest {
  email: string;
  password: string;
}

export interface ValidationCodeRequest {
  code: string;
}

// =================== USUÁRIOS ===================
export interface UserData {
  id: string;
  email: string;
  name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  company_id?: string;
  permissions?: UserPermission[];
}

export interface UserPermission {
  id: string;
  name: string;
  description: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
  company_id?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
}

export interface UserRegistrationRequest extends CreateUserRequest {
  company: CompanyRegistrationData;
}

// =================== EMPRESAS ===================
export interface CompanyData {
  id: string;
  name: string;
  tax_id: string;
  email: string;
  phone?: string;
  website?: string;
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  created_at: string;
  updated_at: string;
  config?: CompanyConfig;
  financialInfo?: CompanyFinancialInfo;
}

export interface CompanyRegistrationData {
  name: string;
  tax_id: string;
  email: string;
  phone?: string;
  website?: string;
}

export interface CompanyConfig {
  pix_enabled?: boolean;
  card_enabled?: boolean;
  boleto_enabled?: boolean;
  withdrawals_enabled?: boolean;
  anticipations_enabled?: boolean;
}

export interface CompanyFinancialInfo {
  available_balance: number;
  pending_balance: number;
  total_balance: number;
  reserve_percentage?: number;
}

export interface CompanyTaxes {
  mdr_1x?: number;
  mdr_2x?: number;
  mdr_3x?: number;
  mdr_4x?: number;
  mdr_5x?: number;
  mdr_6x?: number;
  mdr_7x?: number;
  mdr_8x?: number;
  mdr_9x?: number;
  mdr_10x?: number;
  mdr_11x?: number;
  mdr_12x?: number;
  pix_fee_percentage?: number;
  pix_fee_fixed?: number;
  card_fee_percentage?: number;
  card_fee_fixed?: number;
  boleto_fee_percentage?: number;
  boleto_fee_fixed?: number;
  fee_type_pix?: 'percentage' | 'fixed' | 'both';
  fee_type_card?: 'percentage' | 'fixed' | 'both';
  fee_type_boleto?: 'percentage' | 'fixed' | 'both';
}

export interface CompanyStatusUpdate {
  status: 'approved' | 'rejected' | 'blocked';
  reason?: string;
}

// =================== TRANSAÇÕES ===================
export interface TransactionData {
  id: string;
  external_id?: string;
  company_id: string;
  customer_id?: string;
  amount: number;
  status: 'pending' | 'waiting_payment' | 'paid' | 'refused' | 'canceled' | 'expired' | 'chargedback' | 'refunded';
  payment_method: 'PIX' | 'CARD' | 'BOLETO';
  installments?: number;
  description?: string;
  customer_data?: CustomerData;
  product_data?: ProductData;
  shipping_data?: ShippingData;
  payment_data?: PaymentData;
  pix_data?: PixData;
  card_data?: CardData;
  boleto_data?: BoletoData;
  created_at: string;
  updated_at: string;
  paid_at?: string;
  expires_at?: string;
}

export interface CreateTransactionRequest {
  amount: number;
  payment_method: 'PIX' | 'CARD' | 'BOLETO';
  installments?: number;
  description?: string;
  customer: CustomerData;
  product?: ProductData;
  shipping?: ShippingData;
  payment_data?: PaymentData;
  external_id?: string;
}

export interface CustomerData {
  name: string;
  email: string;
  phone?: string;
  document: string;
  address?: AddressData;
}

export interface AddressData {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface ProductData {
  name: string;
  price: number;
  quantity: number;
  description?: string;
  sku?: string;
}

export interface ShippingData {
  amount: number;
  description?: string;
  delivery_date?: string;
}

export interface PaymentData {
  card?: CardData;
  pix?: PixData;
  boleto?: BoletoData;
}

export interface CardData {
  number?: string;
  holder_name?: string;
  expiry_month?: string;
  expiry_year?: string;
  cvv?: string;
  hash?: string;
}

export interface PixData {
  qr_code?: string;
  qr_code_url?: string;
  expires_at?: string;
}

export interface BoletoData {
  barcode?: string;
  url?: string;
  expires_at?: string;
}

export interface TransactionFilters extends PaginationParams, DateRangeParams {
  status?: string;
  payment_method?: string;
  company_id?: string;
}

export interface TransactionSummary {
  total_transactions: number;
  total_amount: number;
  paid_transactions: number;
  paid_amount: number;
  pending_transactions: number;
  pending_amount: number;
  approval_rate: number;
}

// =================== CARTEIRA ===================
export interface WalletData {
  user_id: string;
  available_balance: number;
  pending_balance: number;
  reserved_balance: number;
  total_balance: number;
  updated_at: string;
}

export interface BalanceManagementRequest {
  user_id: string;
  amount: number;
  type: string;
  motivo: string;
  operation: 'add' | 'subtract';
}

export interface RemoveBalanceRequest {
  user_id: string;
  amount: number;
  type: string;
  motivo: string;
}

export interface ExtractData {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  created_at: string;
  transaction_id?: string;
  withdrawal_id?: string;
  anticipation_id?: string;
}

export interface ExtractFilters extends PaginationParams, DateRangeParams {
  type?: 'credit' | 'debit';
}

// =================== SAQUES ===================
export interface WithdrawalData {
  id: string;
  user_id: string;
  pix_key_id?: string;
  requested_amount: number;
  final_amount?: number;
  fee_amount?: number;
  description?: string;
  status: 'pending' | 'approved' | 'done' | 'done_manual' | 'cancelled';
  is_pix: boolean;
  reason_for_denial?: string;
  created_at: string;
  updated_at: string;
  paid_at?: string;
}

export interface CreateWithdrawalRequest {
  pix_key_id?: string;
  requested_amount: number;
  description?: string;
  is_pix: boolean;
}

export interface UpdateWithdrawalRequest {
  status: 'approved' | 'done_manual' | 'cancelled';
  reason_for_denial?: string;
}

export interface WithdrawalFilters extends PaginationParams, DateRangeParams {
  status?: string;
}

export interface WithdrawalAggregates {
  total_requested: number;
  total_approved: number;
  total_paid: number;
  total_cancelled: number;
  count_total: number;
  count_approved: number;
  count_paid: number;
  count_cancelled: number;
}

// =================== ANTECIPAÇÕES ===================
export interface AnticipationData {
  id: string;
  user_id: string;
  requested_amount: number;
  final_amount?: number;
  fee_amount?: number;
  fee_percentage?: number;
  status: 'pending' | 'approved' | 'refused';
  reason_for_denial?: string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
}

export interface CreateAnticipationRequest {
  user_id: string;
}

export interface UpdateAnticipationRequest {
  id: string;
  status?: 'approved' | 'refused';
  reason_for_denial?: string;
}

export interface AnticipationFilters extends PaginationParams {
  status?: string;
}

// =================== CHAVES PIX ===================
export interface PixKeyData {
  id: string;
  user_id: string;
  type: 'email' | 'phone' | 'cpf' | 'cnpj' | 'random';
  key: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface CreatePixKeyRequest {
  type: 'email' | 'phone' | 'cpf' | 'cnpj' | 'random';
  key: string;
  description?: string;
}

export interface UpdatePixKeyRequest {
  description?: string;
}

export interface ApprovePixKeyRequest {
  approved: boolean;
}

export interface PixKeyFilters {
  user_id?: string;
}

// =================== SUPPORT TICKETS ===================
export interface SupportTicketData {
  id: string;
  user_id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'closed';
  created_at: string;
  updated_at: string;
  messages?: SupportMessageData[];
}

export interface CreateSupportTicketRequest {
  action: 'create_ticket';
  payload: {
    subject: string;
    message: string;
    attachment_url?: string;
  };
}

export interface ListSupportTicketsRequest {
  action: 'list_tickets';
  payload: {};
}

export interface SendSupportMessageRequest {
  action: 'send_message';
  payload: {
    ticket_id: string;
    message: string;
    attachment_url?: string;
  };
}

export interface GetSupportMessagesRequest {
  action: 'get_messages';
  payload: {
    ticket_id: string;
    page?: number;
    per_page?: number;
  };
}

export interface CheckUnreadMessagesRequest {
  action: 'check_unread_messages';
  payload: {};
}

export interface MarkMessageReadRequest {
  action: 'mark_message_read';
  payload: {
    ticket_id: string;
  };
}

export interface GetSupportTicketRequest {
  action: 'get_ticket';
  payload: {
    ticket_id: string;
  };
}

export interface GetSupportMetricsRequest {
  action: 'get_metrics';
  payload: {};
}

export interface UpdateSupportTicketStatusRequest {
  action: 'update_status';
  payload: {
    ticket_id: string;
    status: 'open' | 'in_progress' | 'closed';
  };
}

export interface SupportMessageData {
  id: string;
  ticket_id: string;
  user_id?: string;
  admin_id?: string;
  message: string;
  attachment_url?: string;
  is_read: boolean;
  created_at: string;
}

// =================== SUBCONTAS ===================
export interface SubaccountData {
  id: string;
  company_id: string;
  name: string;
  sub_account_id?: string;
  sub_account_live_token?: string;
  status: 'pending' | 'approved' | 'rejected';
  kyc_status?: 'pending' | 'approved' | 'rejected';
  bank_data?: BankData;
  created_at: string;
  updated_at: string;
}

export interface BankData {
  bank: string;
  agency: string;
  account: string;
  account_type: 'checking' | 'savings';
}

export interface CreateSubaccountRequest {
  company_id: string;
  subconta_nome: string;
  banco: string;
  agencia: string;
  conta: string;
  tipo_conta: 'checking' | 'savings';
  balance_sheet: string;
  adquirente_nome: string;
}

export interface ResendDocumentsRequest {
  sub_account_id: string;
  sub_account_live_token: string;
  identification: string;
}

export interface CheckSubaccountStatusRequest {
  sub_account_id: string;
  sub_account_live_token: string;
  adquirente_nome: string;
}

export interface CheckKYCRequest {
  sub_account_live_token: string;
}

// =================== CONFIGURAÇÕES ===================
export interface TermsOfService {
  content: string;
  updated_at: string;
}

export interface UpdateTermsRequest {
  termos: string;
}

export interface SystemConfigurations {
  descontarChargebackSaldoDisponivel?: boolean;
  reservaFinanceiraHabilitada?: boolean;
  [key: string]: any;
}

export interface PersonalizationConfig {
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  favicon_url?: string;
  company_name?: string;
  [key: string]: any;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: string;
}

// =================== UTMFY ===================
export interface UtmfyData {
  id: string;
  name: string;
  platform: 'Utmify';
  pixel_id: string;
  api_key: string;
  created_at: string;
}

export interface CreateUtmfyRequest {
  name: string;
  platform: 'Utmify';
  pixel_id: string;
  api_key: string;
}

export interface UpdateUtmfyRequest extends CreateUtmfyRequest {}

// =================== ANÁLISE DE RISCO ===================
export interface RiskAnalysisRequest {
  company_id: string;
  valor_saque: number;
}

export interface RiskAnalysisResponse {
  risk_score: number;
  decision: 'approve' | 'reject' | 'review';
  reasons?: string[];
}

// =================== CLIENTES ===================
export interface ClientData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  tax_id: string;
  address?: AddressData;
  created_at: string;
  updated_at: string;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phone?: string;
  tax_id: string;
  address?: AddressData;
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {}

export interface ClientFilters {
  taxid?: string;
}

// =================== LINKS DE PAGAMENTO ===================
export interface PaymentLinkData {
  id: string;
  company_id: string;
  name: string;
  amount?: number;
  description?: string;
  payment_methods: ('PIX' | 'CARD' | 'BOLETO')[];
  max_installments?: number;
  expires_at?: string;
  is_active: boolean;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentLinkRequest {
  name: string;
  amount?: number;
  description?: string;
  payment_methods: ('PIX' | 'CARD' | 'BOLETO')[];
  max_installments?: number;
  expires_at?: string;
}

export interface UpdatePaymentLinkRequest extends Partial<CreatePaymentLinkRequest> {}

export interface PaymentLinkFilters {
  company?: string;
  id?: string;
}

// =================== PADRÕES ===================
export interface StandardsData {
  payment_methods: ('PIX' | 'CARD' | 'BOLETO')[];
  reserve_percentage_anticipation: number;
  max_installments: number;
  [key: string]: any;
}

export interface UpdateStandardsRequest extends Partial<StandardsData> {}

// =================== ALERTAS ===================
export interface AlertData {
  id: string;
  title: string;
  body: string;
  checkout?: boolean;
  is_viewed: boolean;
  created_at: string;
}

export interface CreateAlertRequest {
  title: string;
  body: string;
  checkout?: boolean;
}

export interface MarkAlertViewedRequest {
  alert_id: string;
}

export interface DeleteAlertRequest {
  alert_id: string;
}

export interface AlertFilters extends PaginationParams {}

// =================== DASHBOARD ===================
export interface DashboardData {
  total_revenue: number;
  total_transactions: number;
  total_customers: number;
  approval_rate: number;
  period_revenue: number;
  period_transactions: number;
  top_products?: TopProductData[];
  top_sellers?: TopSellerData[];
  chart_data?: ChartData[];
  additional_info?: any;
}

export interface TopProductData {
  product_name: string;
  total_sales: number;
  total_revenue: number;
}

export interface TopSellerData {
  seller_name: string;
  total_sales: number;
  total_revenue: number;
}

export interface ChartData {
  date: string;
  revenue: number;
  transactions: number;
}

export interface DashboardFilters extends DateRangeParams {}

// =================== AUDIT LOG ===================
export interface AuditLogData {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// =================== TAXAS ===================
export interface TaxCalculationRequest {
  company_id: string;
  valor: number;
  payment_method: 'PIX' | 'CARD' | 'BOLETO';
  parcelas?: number;
}

export interface TaxCalculationResponse {
  original_amount: number;
  fee_amount: number;
  final_amount: number;
  fee_percentage: number;
  installments?: number;
}

// =================== ADQUIRENTES ===================
export interface AcquirerData {
  id: string;
  name: string;
  is_active: boolean;
  acquirers_pix: boolean;
  acquirers_boleto: boolean;
  acquirers_card: boolean;
  taxes: AcquirerTaxes;
  created_at: string;
  updated_at: string;
}

export interface AcquirerTaxes extends CompanyTaxes {}

export interface UpdateAcquirerStatusRequest {
  acquirers_pix: boolean;
  acquirers_boleto: boolean;
  acquirers_card: boolean;
}

export interface UpdateAcquirerTaxesRequest extends AcquirerTaxes {}

// =================== BAAS ===================
export interface BaasData {
  id: string;
  name: string;
  is_active: boolean;
  fee: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateBaasRequest {
  fee: number;
  id: string;
}

// =================== WEBHOOKS ===================
export interface WebhookData {
  id: string;
  user_id: string;
  url: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateWebhookRequest {
  url: string;
  ativa: boolean;
  admin: boolean;
}

export interface UpdateWebhookRequest extends CreateWebhookRequest {}

export interface WebhookFilters extends PaginationParams {
  user_id?: string;
}

// =================== FATURAS ===================
export interface BillingData {
  id: string;
  company_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  due_date: string;
  paid_at?: string;
  created_at: string;
}

export interface PayBillingRequest {
  billing_id: string;
}

// =================== CREDENCIAIS ===================
export interface CredentialsData {
  api_key: string;
  environment: 'development' | 'production';
  webhook_secret?: string;
} 