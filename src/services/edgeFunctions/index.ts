/**
 * 🌐 EDGE FUNCTIONS SERVICE - INSTÂNCIA SINGLETON
 * ===============================================
 * 
 * Instância única do EdgeFunctionsService para uso em todo o app
 */

import { EdgeFunctionsService } from './EdgeFunctionsService';

// Criar instância singleton
export const edgeFunctionsService = new EdgeFunctionsService();

// Exportar classe para outros usos
export { EdgeFunctionsService } from './EdgeFunctionsService';

