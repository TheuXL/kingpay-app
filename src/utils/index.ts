// Utils exports
export { centavosParaReais, reaisParaCentavos } from './currency';

// Re-export tipos centrais
export type { ApiResponse, PaginatedResponse } from '../types/api';

// Interface de ServiceResponse que não existe em api.ts
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
