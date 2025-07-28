/**
 * Módulo: Chaves Pix (Cliente)
 * Endpoints para consulta e criação de chaves Pix pelo usuário.
 */
import { edgeFunctionsProxy } from "../../../services/api/EdgeFunctionsProxy";
import { PixKey } from "../types";

class PixKeyService {
    async getPixKeys(): Promise<{ data: PixKey[] }> {
        return edgeFunctionsProxy.invoke('pix-key', 'GET');
    }

    async createPixKey(payload: { key: string; type: string; description?: string }): Promise<PixKey> {
        return edgeFunctionsProxy.invoke('pix-key', 'POST', payload);
    }
    
    async deletePixKey(id: string): Promise<void> {
        return edgeFunctionsProxy.invoke(`pix-key/${id}`, 'DELETE');
    }
}

export const pixKeyService = new PixKeyService(); 