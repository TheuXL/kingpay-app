/**
 * Módulo: Antecipações
 * Endpoints para consulta e criação de antecipações de recebíveis.
 */
import { edgeFunctionsProxy } from "../../../services/api/EdgeFunctionsProxy";

/**
 * Busca o histórico de antecipações.
 * Endpoint: GET /antecipacoes/anticipations
 */
export const getAnticipations = async () => {
    return edgeFunctionsProxy.get('antecipacoes/anticipations');
};

/**
 * Cria uma nova solicitação de antecipação.
 * API Endpoint: POST /antecipacoes/create
 */
export const createAnticipation = async (body: { amount: number }) => {
  return edgeFunctionsProxy.post('antecipacoes/create', body);
}; 