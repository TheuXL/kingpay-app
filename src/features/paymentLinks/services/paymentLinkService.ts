/**
 * Módulo: Links de Pagamento
 * Endpoints para criar e gerenciar links de pagamento.
 */
import { edgeFunctionsProxy } from "../../../services/api/EdgeFunctionsProxy";

export interface PaymentLink {
    id: string;
    nome: string;
    formas_de_pagamento: string[];
    valor: number;
    ativo: boolean;
    created_at: string; // Adicionado
    descricao?: string; // Adicionado como opcional
    // ... outros campos
}

export interface CreatePaymentLinkRequest {
    nome: string;
    valor: number;
    formas_de_pagamento: ('pix' | 'cartao' | 'boleto')[];
    descricao?: string; // Adicionado como opcional
    // ... outros campos
}

export class PaymentLinkService {
    async getPaymentLinks() {
        return edgeFunctionsProxy.get<PaymentLink[]>('link-pagamentos');
    }

    async getPaymentLinkById(id: string) {
        return edgeFunctionsProxy.get<PaymentLink>(`link-pagamentos?id=${id}`);
    }

    async createPaymentLink(payload: CreatePaymentLinkRequest) {
        return edgeFunctionsProxy.post<PaymentLink>('link-pagamentos', payload);
    }
}
