import { supabase } from '../../../lib/supabase';
import { CreatePaymentLinkData, PaymentLink } from '../types';

// Re-export PaymentLink for the screen to use
export type { PaymentLink } from '../types';

/**
 * Módulo: Link de Pagamento
 * Endpoints 41-44 da documentação INTEGRACAO.md
 */
export class PaymentLinkService {

  /**
   * Endpoint 41: Listar Links de Pagamento (GET /functions/v1/link-pagamentos)
   * Propósito: Obter a lista de links criados pelo vendedor.
   */
  async getPaymentLinks(): Promise<PaymentLink[]> {
    try {
      const { data, error } = await supabase.functions.invoke('link-pagamentos', {
        method: 'GET',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar links:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Endpoint 42: Criar Link de Pagamento (POST /functions/v1/link-pagamentos)
   * Propósito: Gerar um novo link de pagamento.
   * linkPayload contém nome, valor, formas_de_pagamento, etc.
   */
  async createPaymentLink(linkPayload: CreatePaymentLinkData): Promise<PaymentLink> {
    try {
      const { data, error } = await supabase.functions.invoke('link-pagamentos', {
        body: linkPayload,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar link:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Endpoint 43: Editar Link de Pagamento (PATCH /functions/v1/link-pagamentos/:id)
   * Propósito: Atualizar um link de pagamento existente.
   */
  async updatePaymentLink(linkId: string, updatedPayload: Partial<CreatePaymentLinkData>): Promise<PaymentLink> {
    try {
      const { data, error } = await supabase.functions.invoke(`link-pagamentos/${linkId}`, {
        method: 'PATCH',
        body: updatedPayload,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao editar link:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Endpoint 44: Visualizar Link de Pagamento (Público) (GET /functions/v1/link-pagamento-view/:id)
   * Propósito: Buscar os dados para renderizar a página de checkout.
   */
  async getPaymentLinkView(linkId: string): Promise<PaymentLink> {
    try {
      // Esta função pode ser chamada sem autenticação se a política de RLS permitir
      const { data, error } = await supabase.functions.invoke(`link-pagamento-view/${linkId}`, {
        method: 'GET',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao carregar link:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Buscar link por ID específico
   * Usando query parameter conforme documentação: GET /functions/v1/link-pagamentos?id=:id
   */
  async getPaymentLinkById(id: string): Promise<PaymentLink> {
    try {
      const { data, error } = await supabase.functions.invoke(`link-pagamentos?id=${id}`, {
        method: 'GET',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar link por ID:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }
}

export const paymentLinkService = new PaymentLinkService();
