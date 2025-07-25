/**
 * Módulo: Alertas
 * Endpoints para buscar e gerenciar alertas do sistema.
 */
import { edgeFunctionsProxy } from "../../../services/api/EdgeFunctionsProxy";

export interface Alert {
    id: string;
    created_at: string;
    title: string;
    body: string;
    viewed: boolean;
}

/**
 * Busca a lista de alertas para o usuário.
 * Endpoint: GET /alerts
 */
export const getAlerts = async () => {
    return edgeFunctionsProxy.get<Alert[]>('alerts');
};

/**
 * Marca um alerta como visualizado.
 * Endpoint: POST /alerts/mark-viewed
 */
export const markAlertAsViewed = async (alertId: string) => {
    return edgeFunctionsProxy.post('alerts/mark-viewed', { alert_id: alertId });
}; 