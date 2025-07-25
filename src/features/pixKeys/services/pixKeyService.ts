/**
 * Módulo: Chaves Pix (Cliente)
 * Endpoints para consulta e criação de chaves Pix pelo usuário.
 */
import { edgeFunctionsProxy } from "../../../services/api/EdgeFunctionsProxy";

export interface PixKey {
    id: string;
    key_type: 'cpf' | 'cnpj' | 'email' | 'telefone' | 'aleatoria';
    key_value: string;
    status: 'pending' | 'approved' | 'denied';
    createdat: string;
}

export interface CreatePixKeyRequest {
    key_type: 'cpf' | 'cnpj' | 'email' | 'telefone' | 'aleatoria';
    key_value: string;
}

export class PixKeyService {
    async getPixKeys() {
        return edgeFunctionsProxy.get<{ data: PixKey[] }>('pix-key');
    }

    async createPixKey(payload: CreatePixKeyRequest) {
        return edgeFunctionsProxy.post<PixKey>('pix-key', payload);
    }
} 