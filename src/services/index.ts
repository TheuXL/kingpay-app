// Exportando todos os serviços para facilitar o acesso
export { authService } from './authService';
export { securityCodeService } from './securityCodeService';
export { ticketService } from './ticketService';

// Export transactionService
export * as transactionService from './transactionService';

// Export withdrawalService as an object
export * as withdrawalService from './withdrawalService';

// Export companyService as an object
export * as companyService from './companyService';

// Export taxService
export { taxService } from './taxService';

// Export dashboardService as an object
export * as dashboardService from './dashboardService';

// Export walletService
export { walletService } from './walletService';

// Export billingService
export { billingService } from './billingService';

// Export webhookService
export { webhookService } from './webhookService';

// Export baasService
export { baasService } from './baasService';

// Export acquirersService as an object
export * as acquirersService from './acquirersService';

// Export userService as an object
export * as userService from './userService';

// Export financialService
export { financialService } from './financialService';

// Export anticipationService as an object
export * as anticipationService from './anticipationService';

// Export pixKeyService as an object
export * as pixKeyService from './pixKeyService';

// Re-export functions from dashboardService for backwards compatibility
export {
    getDashboardData,
    getGraficoData,
    getInfosAdicionais,
    getTopProdutos,
    getTopSellers,
    getTopSellersReport
} from './dashboardService';

