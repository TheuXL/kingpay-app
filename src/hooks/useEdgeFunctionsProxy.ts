import { edgeFunctionsProxy } from '../services/api/EdgeFunctionsProxy';

/**
 * Hook para acessar a instância singleton do EdgeFunctionsProxy.
 * Garante que a mesma instância configurada no contexto seja usada em toda a aplicação.
 */
export const useEdgeFunctionsProxy = () => {
  return edgeFunctionsProxy;
}; 