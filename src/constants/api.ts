/**
 * Constantes para os endpoints da API
 * Organizados por categoria conforme a documentação fornecida
 */

// Auth (Endpoints 1-4)
export const AUTH_ENDPOINTS = {
  TOKEN: '/auth/v1/token',
  SIGNUP: '/auth/v1/signup',
};

// Códigos de Segurança (Endpoints 5-6)
export const SECURITY_CODE_ENDPOINTS = {
  GENERATE: 'validation-codes/generate',
  VALIDATE: 'validation-codes/validate',
};

// Tickets (Endpoints 7-15)
export const TICKET_ENDPOINTS = {
  MAIN: 'support-tickets',
  // Todas as ações são feitas no mesmo endpoint com diferentes actions
  ACTIONS: {
    CREATE: 'create_ticket',
    LIST: 'list_tickets',
    SEND_MESSAGE: 'send_message',
    GET_MESSAGES: 'get_messages',
    CHECK_UNREAD: 'check_unread_messages',
    MARK_READ: 'mark_messages_as_read',
    GET_TICKET: 'get_ticket',
    GET_METRICS: 'get_metrics',
    UPDATE_STATUS: 'update_status',
  },
};

// Transações (Endpoints 16-23)
export const TRANSACTION_ENDPOINTS = {
  MAIN: 'transactions',
  WEBHOOK: 'webhookfx',
  CREDENTIALS: 'credentials',
};

// Subcontas (Endpoints 24-28)
export const SUBACCOUNT_ENDPOINTS = {
  PROXY: 'proxy',
  REQUEST_VERIFICATION: 'request_verification',
  WEBHOOKS: '/v1/web_hooks',
  SUBCONTA: 'subconta',
  RESEND_DOCUMENTS: 'subconta/resend_documents',
  CHECK_STATUS: 'subconta/checkstatus',
  CHECK_KYC: 'subconta/check_kyc',
};

// Logs (Endpoint 34)
export const LOGS_ENDPOINTS = {
  AUDIT_LOG: 'audit-log',
};

// Taxas (Endpoint 35)
export const TAX_ENDPOINTS = {
  CALCULATE: 'taxas',
};

// Chaves Pix (Endpoints 36-37)
export const PIX_KEY_ENDPOINTS = {
  MAIN: 'pix-key',
  APPROVE: (id: string) => `pix-key/${id}/approve`,
};

// Configurações (Endpoints 44-50)
export const CONFIG_ENDPOINTS = {
  TERMS: 'configuracoes/termos',
  UPDATE_CONFIG: 'configuracoes',
  PERSONALIZATION: 'personalization',
  COMPANY_VIEW: 'config-companie-view',
  ACCEPT_TERMS: 'configuracoes/acecitar-termos',
  EMAIL_TEMPLATES: 'configuracoes/emails',
};

// UtmFy (Endpoints 51-53)
export const UTMFY_ENDPOINTS = {
  MAIN: 'pixelTracker',
};

// Análise de Risco (Endpoint 54)
export const RISK_ENDPOINTS = {
  ANALYZE: 'risk',
};

// Clientes (Endpoints 55-59)
export const CLIENT_ENDPOINTS = {
  MAIN: 'clientes',
  BY_ID: (id: string) => `clientes/${id}`,
  ROUTES: '',
};

// Link de Pagamento (Endpoints 60-64)
export const PAYMENT_LINK_ENDPOINTS = {
  MAIN: 'link-pagamentos',
  VIEW: (id: string) => `link-pagamento-view/${id}`,
  UPDATE: (id: string) => `link-pagamentos/${id}`,
};

// Padrões (Endpoints 65-66)
export const STANDARD_ENDPOINTS = {
  MAIN: 'standard',
  UPDATE: 'standard/last',
};

// Alertas (Endpoints 70-74)
export const ALERTS_ENDPOINTS = {
  MAIN: 'alerts',
  MARK_VIEWED: 'alerts/mark-viewed',
};

// Dashboard (Endpoints 78-83)
export const DASHBOARD_ENDPOINTS = {
  MAIN: 'dados-dashboard',
  TOP_PRODUTOS: 'dados-dashboard/top-produtos',
  GRAFICO: 'dados-dashboard/grafico',
  INFOS_ADICIONAIS: 'dados-dashboard/infos-adicionais',
  TOP_SELLERS: 'dados-dashboard/top-sellers',
  ANALYTICS: 'analytics-reports',
};

// Saques (Endpoints 84-89)
export const WITHDRAWAL_ENDPOINTS = {
  LIST: 'saques',
  CREATE: 'withdrawals',
  UPDATE: (id: string) => `withdrawals/${id}`,
  AGGREGATES: 'saques/aggregates',
};

// Antecipações (Endpoints 90-92)
export const ANTICIPATION_ENDPOINTS = {
  LIST: 'antecipacoes/anticipations',
  DENY: 'antecipacoes/deny',
  APPROVE: 'antecipacoes/approve',
  CREATE: 'antecipacoes/create',
};

// User (Endpoints 93-98)
export const USER_ENDPOINTS = {
  LIST: 'users',
  API_KEY: (id: string) => `users/${id}/apikey`,
  PERMISSIONS: (id: string) => `users/${id}/permissions`,
  CREATE: 'users/create',
  EDIT: (id: string) => `users/${id}/edit`,
  REGISTER: 'users/register',
};

// Transações (Endpoints 99-101)
export const TRANSACTION_LIST_ENDPOINTS = {
  LIST: 'transacoes',
  SUMMARY: 'transacoes/resumo',
  BY_ID: (id: string) => `transacoes/${id}`,
};

// Carteira (Endpoints 102-108)
export const WALLET_ENDPOINTS = {
  ANTICIPATE: 'antecipacoes/create',
  REMOVE_BALANCE: 'wallet/remove-balance',
  MANAGE_BALANCE: 'wallet/balance-management',
  GET_WALLET: 'wallet',
  STATEMENT: (userId: string) => `extrato/${userId}`,
};

// Webhooks (Endpoints 109-112)
export const WEBHOOK_ENDPOINTS = {
  MAIN: 'webhook',
  BY_ID: (id: string) => `webhook/${id}`,
};

// Faturas (Endpoints 113-114)
export const BILLING_ENDPOINTS = {
  MAIN: 'billings',
  PAY: 'billings/pay',
};

// Baas (Endpoints 115-119)
export const BAAS_ENDPOINTS = {
  MAIN: 'baas',
  BY_ID: (id: string) => `baas/${id}`,
  FEES: (id: string) => `baas/${id}/taxas`,
  ACTIVE: (id: string) => `baas/${id}/active`,
  TAXA: (id: string) => `baas/${id}/taxa`,
};

// Adquirentes (Endpoints 120-124)
export const ACQUIRER_ENDPOINTS = {
  MAIN: 'acquirers',
  BY_ID: (id: string) => `acquirers/${id}`,
  FEES: (id: string) => `acquirers/${id}/taxas`,
  ACTIVE: (id: string) => `acquirers/${id}/active`,
};

// Empresas (Endpoints 125-144)
export const COMPANY_ENDPOINTS = {
  MAIN: 'companies',
  COUNT: 'companies/contagem',
  BY_ID: (id: string) => `companies/${id}`,
  TAXES: (id: string) => `companies/${id}/taxas`,
  RESERVE: (id: string) => `companies/${id}/reserva`,
  CONFIG: (id: string) => `companies/${id}/config`,
  DOCS: (id: string) => `companies/${id}/docs`,
  ACQUIRERS: (id: string) => `companies/${id}/adq`,
  FINANCIAL_INFO: (id: string) => `companies/${id}/financial-info`,
  CONFIG_BULK: (id: string) => `companies/${id}/config-bulk`,
  STATUS: (id: string) => `companies/${id}/status`,
}; 