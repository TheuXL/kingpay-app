/**
 * 💰 TRANSACTION SERVICE - KINGPAY
 * ================================
 * 
 * Serviço de transações baseado na documentação dos endpoints
 * - Criação de transações (PIX, Cartão, Boleto)
 * - Cálculo de taxas
 * - Consulta de transações
 */

import { supabase } from '../../lib/supabase';
import { ApiResponse } from '../../types/api';

export interface CustomerData {
  name: string;
  email: string;
  taxid: string; // CPF/CNPJ
  phone?: string;
}

export interface ShippingData {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
}

export interface CardData {
  number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
  name: string;
}

export interface ItemData {
  name: string;
  value: number;
  amount: number;
  description?: string;
}

export interface TransactionRequest {
  customer: CustomerData;
  shipping?: ShippingData;
  paymentMethod: 'PIX' | 'CARD' | 'BOLETO';
  card?: CardData;
  pix?: {
    expires_in_days?: number;
  };
  items: ItemData[];
  amount: number; // Valor em centavos
  postbackUrl?: string;
  metadata?: any;
}

export interface TransactionResponse {
  id: string;
  status: 'pending' | 'paid' | 'cancelled' | 'expired';
  amount: number;
  payment_method: string;
  pix_code?: string;
  pix_expires_at?: string;
  boleto_url?: string;
  boleto_barcode?: string;
  created_at: string;
}

export interface TaxCalculationRequest {
  company_id: string;
  valor: number;
  payment_method: 'PIX' | 'CARD' | 'BOLETO';
  parcelas: number;
}

export interface TaxCalculationResponse {
  valor_original: number;
  taxa_percentual: number;
  taxa_fixa: number;
  valor_taxa: number;
  valor_liquido: number;
  metodo_pagamento: string;
  parcelas: number;
}

class TransactionService {
  /**
   * Criar nova transação
   * Endpoint: POST /functions/v1/transactions
   */
  async createTransaction(transactionData: TransactionRequest): Promise<ApiResponse<TransactionResponse>> {
    try {
      console.log('💰 Criando transação...', transactionData.paymentMethod);

      const { data, error } = await supabase.functions.invoke('transactions', {
        body: transactionData
      });

      if (error) {
        console.error('❌ Erro ao criar transação:', error.message);
        return {
          success: false,
          error: error.message,
          data: null
        };
      }

      console.log('✅ Transação criada com sucesso!');
      return {
        success: true,
        data: data as TransactionResponse,
        error: null
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao criar transação';
      console.error('❌ Erro inesperado ao criar transação:', errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }
  }

  /**
   * Calcular taxas de transação
   * Endpoint: POST /functions/v1/taxas
   */
  async calculateTaxes(taxData: TaxCalculationRequest): Promise<ApiResponse<TaxCalculationResponse>> {
    try {
      console.log('🧮 Calculando taxas...', taxData);

      const { data, error } = await supabase.functions.invoke('taxas', {
        body: taxData
      });

      if (error) {
        console.error('❌ Erro ao calcular taxas:', error.message);
        return {
          success: false,
          error: error.message,
          data: null
        };
      }

      console.log('✅ Taxas calculadas!');
      return {
        success: true,
        data: data as TaxCalculationResponse,
        error: null
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao calcular taxas';
      console.error('❌ Erro inesperado ao calcular taxas:', errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }
  }

  /**
   * Buscar transação por ID
   */
  async getTransaction(transactionId: string): Promise<ApiResponse<TransactionResponse>> {
    try {
      console.log('🔍 Buscando transação:', transactionId);

      // Assumindo que há um endpoint para buscar transação específica
      const { data, error } = await supabase.functions.invoke('transactions/get', {
        body: { transaction_id: transactionId }
      });

      if (error) {
        console.error('❌ Erro ao buscar transação:', error.message);
        return {
          success: false,
          error: error.message,
          data: null
        };
      }

      return {
        success: true,
        data: data as TransactionResponse,
        error: null
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao buscar transação';
      console.error('❌ Erro inesperado ao buscar transação:', errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }
  }

  /**
   * Listar transações do usuário
   */
  async listTransactions(params?: {
    limit?: number;
    offset?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<TransactionResponse[]>> {
    try {
      console.log('📋 Listando transações...');

      const { data, error } = await supabase.functions.invoke('transactions/list', {
        body: params || {}
      });

      if (error) {
        console.error('❌ Erro ao listar transações:', error.message);
        return {
          success: false,
          error: error.message,
          data: null
        };
      }

      return {
        success: true,
        data: (data || []) as TransactionResponse[],
        error: null
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao listar transações';
      console.error('❌ Erro inesperado ao listar transações:', errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }
  }

  /**
   * Cancelar transação
   */
  async cancelTransaction(transactionId: string): Promise<ApiResponse<void>> {
    try {
      console.log('❌ Cancelando transação:', transactionId);

      const { data, error } = await supabase.functions.invoke('transactions/cancel', {
        body: { transaction_id: transactionId }
      });

      if (error) {
        console.error('❌ Erro ao cancelar transação:', error.message);
        return {
          success: false,
          error: error.message,
          data: null
        };
      }

      console.log('✅ Transação cancelada!');
      return {
        success: true,
        data: undefined,
        error: null
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao cancelar transação';
      console.error('❌ Erro inesperado ao cancelar transação:', errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }
  }
}

// Instância singleton
export const transactionService = new TransactionService();
export default transactionService; 