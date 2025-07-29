/**
 * 🔗 SERVIÇO DE LINKS DE PAGAMENTO - KINGPAY
 * ========================================= 
 * 
 * Endpoints funcionais testados:
 * - GET /functions/v1/link-pagamentos ✅
 * - GET /functions/v1/link-pagamentos?id=:id ✅
 * - GET /functions/v1/link-pagamento-view/:id ✅
 * - POST /functions/v1/link-pagamentos ✅
 * - PUT /functions/v1/link-pagamentos?id=:id ✅
 */

import { logger } from '@/utils/logger';
import { edgeFunctionsProxy } from "../../../services/api/EdgeFunctionsProxy";

export interface PaymentLink {
    id: string;
    nome: string;
    formas_de_pagamento: string[];
    valor: number; // em centavos
    ativo: boolean;
    cor?: string;
    descricao_cobranca?: string;
    created_at?: string;
    updated_at?: string;
}

export interface CreatePaymentLinkRequest {
    nome: string;
    valor: number; // em centavos
    formas_de_pagamento: string[];
    descricao_cobranca?: string;
    cor?: string;
    ativo?: boolean;
}

export interface UpdatePaymentLinkRequest {
    nome?: string;
    valor?: number;
    formas_de_pagamento?: string[];
    descricao_cobranca?: string;
    cor?: string;
    ativo?: boolean;
}

export class PaymentLinkService {
    
    /**
     * Listar todos os links de pagamento
     * GET /functions/v1/link-pagamentos
     */
    async getPaymentLinks(): Promise<PaymentLink[]> {
        try {
            logger.dashboard('Buscando links de pagamento');
            
            const response = await edgeFunctionsProxy.invoke('link-pagamentos', 'GET');
            
            if (response.success && response.data) {
                let linksData = response.data;
                
                // A resposta pode vir como JSON string
                if (typeof linksData === 'string') {
                    linksData = JSON.parse(linksData);
                }
                
                // Os dados podem estar em data.data
                const links = linksData.data || linksData;
                
                if (Array.isArray(links)) {
                    logger.success('Links de pagamento carregados', { count: links.length });
                    return links;
                } else {
                    logger.warn('Formato inesperado na resposta de links', linksData);
                    return [];
                }
            } else {
                throw new Error(response.error || 'Erro ao buscar links de pagamento');
            }
        } catch (error: any) {
            logger.error('Erro ao buscar links de pagamento', error);
            throw error;
        }
    }

    /**
     * Buscar link específico por ID
     * GET /functions/v1/link-pagamentos?id=:id
     */
    async getPaymentLinkById(id: string): Promise<PaymentLink> {
        try {
            logger.dashboard('Buscando link de pagamento por ID', { linkId: id });
            
            const response = await edgeFunctionsProxy.invoke(`link-pagamentos?id=${id}`, 'GET');
            
            if (response.success && response.data) {
                let linkData = response.data;
                
                if (typeof linkData === 'string') {
                    linkData = JSON.parse(linkData);
                }
                
                logger.success('Link de pagamento encontrado', { linkId: id });
                return linkData;
            } else {
                throw new Error(response.error || 'Link de pagamento não encontrado');
            }
        } catch (error: any) {
            logger.error('Erro ao buscar link por ID', error);
            throw error;
        }
    }

    /**
     * Visualizar link de pagamento (versão pública)
     * GET /functions/v1/link-pagamento-view/:id
     */
    async getPaymentLinkView(id: string): Promise<PaymentLink> {
        try {
            const response = await edgeFunctionsProxy.invoke(`link-pagamento-view/${id}`, 'GET');
            
            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.error || 'Erro ao visualizar link de pagamento');
            }
        } catch (error: any) {
            logger.error('Erro ao visualizar link de pagamento', error);
            throw error;
        }
    }

    /**
     * Criar novo link de pagamento
     * POST /functions/v1/link-pagamentos
     */
    async createPaymentLink(payload: CreatePaymentLinkRequest): Promise<PaymentLink> {
        try {
            logger.dashboard('Criando novo link de pagamento', { nome: payload.nome });
            
            const response = await edgeFunctionsProxy.invoke('link-pagamentos', 'POST', payload);
            
            if (response.success && response.data) {
                let linkData = response.data;
                
                if (typeof linkData === 'string') {
                    linkData = JSON.parse(linkData);
                }
                
                logger.success('Link de pagamento criado com sucesso', { linkId: linkData.id });
                return linkData;
            } else {
                throw new Error(response.error || 'Erro ao criar link de pagamento');
            }
        } catch (error: any) {
            logger.error('Erro ao criar link de pagamento', error);
            throw error;
        }
    }

    /**
     * Atualizar link de pagamento
     * PUT /functions/v1/link-pagamentos?id=:id
     */
    async updatePaymentLink(id: string, payload: UpdatePaymentLinkRequest): Promise<PaymentLink> {
        try {
            logger.dashboard('Atualizando link de pagamento', { linkId: id });
            
            const response = await edgeFunctionsProxy.invoke(`link-pagamentos?id=${id}`, 'PUT', payload);
            
            if (response.success && response.data) {
                let linkData = response.data;
                
                if (typeof linkData === 'string') {
                    linkData = JSON.parse(linkData);
                }
                
                logger.success('Link de pagamento atualizado com sucesso', { linkId: id });
                return linkData;
            } else {
                throw new Error(response.error || 'Erro ao atualizar link de pagamento');
            }
        } catch (error: any) {
            logger.error('Erro ao atualizar link de pagamento', error);
            throw error;
        }
    }

    /**
     * Ativar/Desativar link de pagamento
     */
    async togglePaymentLink(id: string, ativo: boolean): Promise<PaymentLink> {
        return this.updatePaymentLink(id, { ativo });
    }

    /**
     * Formatar valor em centavos para exibição
     */
    formatCurrency(valueInCents: number): string {
        return (valueInCents / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    }

    /**
     * Converter valor em reais para centavos
     */
    convertToCents(valueInReais: number): number {
        return Math.round(valueInReais * 100);
    }
}

export const paymentLinkService = new PaymentLinkService();
