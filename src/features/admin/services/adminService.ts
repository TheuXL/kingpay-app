import api from '../../../services/api';

// Interfaces para os parâmetros de listagem, para manter a consistência
interface ListParams {
  limit?: number;
  offset?: number;
  [key: string]: any; // Permite outros filtros
}

// =================================
// OPERAÇÕES GERAIS DE ADMIN
// =================================

export const getWithdrawals = (params: ListParams) => api.get('/functions/v1/saques', { params });
export const getAnticipations = (params: ListParams) => api.get('/functions/v1/antecipacoes/anticipations', { params });
export const getUsers = (params: ListParams) => api.get('/functions/v1/users', { params });
export const getBillings = (params: ListParams) => api.get('/functions/v1/billings', { params });
export const getAuditLog = (params: ListParams) => api.get('/functions/v1/audit-log', { params });
export const getStandardConfigs = () => api.get('/functions/v1/standard');
export const getCompanies = (params: ListParams) => api.get('/functions/v1/companies', { params });
export const getClients = (params: ListParams) => api.get('/functions/v1/clientes', { params });
export const getPaymentLinks = (params: ListParams) => api.get('/functions/v1/link-pagamentos', { params });
export const getPixKeys = (params: ListParams) => api.get('/functions/v1/pix-key', { params });
export const getAlerts = (params: ListParams) => api.get('/functions/v1/alerts', { params });
export const getSupportTickets = () => api.post('/functions/v1/support-tickets', { action: 'list_tickets', payload: {} });


// =================================
// MÓDULO BAAS (ADMIN)
// =================================

export const getBaaSProviders = (params: ListParams) => api.get('/functions/v1/baas', { params });
export const getBaaSProviderDetails = (baasId: string) => api.get(`/functions/v1/baas/${baasId}`);
export const getBaaSFees = (baasId: string) => api.get(`/functions/v1/baas/${baasId}/taxas`);
export const setBaaSProviderStatus = (baasId: string, isActive: boolean) => api.patch(`/functions/v1/baas/${baasId}/active`, { active: isActive });

// =================================
// MÓDULO ADQUIRENTES (ADMIN)
// =================================

export const getAcquirers = (params: ListParams) => api.get('/functions/v1/acquirers', { params });
export const getAcquirerDetails = (acquirerId: string) => api.get(`/functions/v1/acquirers/${acquirerId}`);
export const getAcquirerFees = (acquirerId: string) => api.get(`/functions/v1/acquirers/${acquirerId}/taxas`);
export const setAcquirerStatus = (acquirerId: string, isActive: boolean) => api.patch(`/functions/v1/acquirers/${acquirerId}/active`, { active: isActive }); 