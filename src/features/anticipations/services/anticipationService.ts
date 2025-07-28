/**
 * Módulo: Antecipações
 * Endpoints para consulta e criação de antecipações de recebíveis.
 */
import { edgeFunctionsProxy } from "../../../services/api/EdgeFunctionsProxy";
import { Anticipation } from "../types";

class AnticipationService {
    async getAnticipations(): Promise<Anticipation[]> {
        const response = await edgeFunctionsProxy.invoke('antecipacoes/anticipations', 'GET');
        if (response.success && response.data) {
            return response.data as Anticipation[];
        }
        throw new Error(response.error || 'Erro ao buscar antecipações.');
    }

    async createAnticipation(payload: { userId: string }): Promise<any> {
        const response = await edgeFunctionsProxy.invoke('antecipacoes/create', 'POST', payload);
        if (response.success) {
            return response.data;
        }
        throw new Error(response.error || 'Erro ao criar antecipação.');
    }

    async approveAnticipation(anticipationId: string): Promise<any> {
        const response = await edgeFunctionsProxy.invoke('antecipacoes/approve', 'POST', { anticipation_id: anticipationId });
        if (response.success) {
            return response.data;
        }
        throw new Error(response.error || 'Erro ao aprovar antecipação.');
    }

    async denyAnticipation(anticipationId: string): Promise<any> {
        const response = await edgeFunctionsProxy.invoke(`antecipacoes/deny`, 'PATCH', { anticipation_id: anticipationId });
        if (response.success) {
            return response.data;
        }
        throw new Error(response.error || 'Erro ao negar antecipação.');
    }
}

export const anticipationService = new AnticipationService(); 