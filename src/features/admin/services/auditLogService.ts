/**
 * Módulo: Logs de Auditoria
 * Endpoints para consulta de logs de atividades.
 */
import { edgeFunctionsProxy } from "../../../services/api/EdgeFunctionsProxy";

export interface AuditLog {
    id: string;
    created_at: string;
    actor: string; // email do usuário
    action: string;
    details: Record<string, any>;
}

/**
 * Busca os logs de auditoria com paginação.
 * Endpoint: GET /audit-log
 */
export const getAuditLogs = async (params?: { limit?: number; offset?: number }) => {
    const queryParams: Record<string, string> = {};
    if (params?.limit) queryParams['limit'] = String(params.limit);
    if (params?.offset) queryParams['offset'] = String(params.offset);
    
    return edgeFunctionsProxy.get<{ data: AuditLog[], pagination: any }>('audit-log', queryParams);
}; 