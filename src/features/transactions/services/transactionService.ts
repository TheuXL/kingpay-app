/**
 * 💳 SERVIÇO DE TRANSAÇÕES - KINGPAY
 * ==================================
 * 
 * Módulo: Transações Financeiras
 * Endpoints 6-8 da documentação INTEGRACAO.md
 * 
 * Implementação dos fluxos de criação de transações,
 * consulta de credenciais e webhooks
 */

import { supabase } from '../../../lib/supabase';

export interface Customer {
  name: string;
  email: string;
  document: string;
  phone?: string;
}

export interface ShippingAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface CardData {
  number?: string;
  holder_name?: string;
  exp_month?: string;
  exp_year?: string;
  cvv?: string;
  hash?: string; // Para pagamentos tokenizados
}

export interface PixConfig {
  expires_in_days?: number;
}

export interface TransactionItem {
  id: string;
  title: string;
  unit_price: number;
  quantity: number;
  tangible: boolean;
}

export interface CreateTransactionRequest {
  customer: Customer;
  shipping?: ShippingAddress;
  paymentMethod: 'PIX' | 'CARD' | 'BOLETO';
  card?: CardData;
  pix?: PixConfig;
  items: TransactionItem[];
  amount: number; // Valor em centavos
  installments?: number;
  postbackUrl?: string;
  metadata?: Record<string, any>;
}

export interface Transaction {
  id: string;
  status: 'pending' | 'paid' | 'refused' | 'chargedback' | 'refunded';
  amount: number;
  paymentMethod: string;
  customer: Customer;
  items: TransactionItem[];
  createdAt: Date;
  updatedAt: Date;
  paymentUrl?: string;
  qrCode?: string;
  barcode?: string;
}

export interface Credentials {
  publicKey: string;
  encryptionKey?: string;
  webhookUrl?: string;
  isActive: boolean;
}

export class TransactionService {

  /**
   * Endpoint 6: Criar Transação
   * POST /functions/v1/transactions
   * 
   * Propósito: Processar pagamentos (PIX, Cartão de Crédito, Boleto)
   */
  async createTransaction(transactionData: CreateTransactionRequest): Promise<Transaction> {
    try {
      console.log('💳 Criando transação:', transactionData.paymentMethod);

      const { data, error } = await supabase.functions.invoke('transactions', {
        body: transactionData,
      });

      if (error) {
        console.error('❌ Erro ao criar transação:', error.message);
        throw error;
      }

      console.log('✅ Transação criada:', data.id);
      return data;

    } catch (error) {
      console.error('❌ Erro inesperado na criação de transação:', error);
      throw error;
    }
  }

  /**
   * Endpoint 7: Obter Credenciais
   * GET /functions/v1/credentials
   * 
   * Propósito: Buscar chaves de API para integração com gateway de pagamento
   */
  async getCredentials(): Promise<Credentials> {
    try {
      console.log('🔑 Obtendo credenciais...');

      const { data, error } = await supabase.functions.invoke('credentials', {
        method: 'GET',
      });

      if (error) {
        console.error('❌ Erro ao obter credenciais:', error.message);
        throw error;
      }

      console.log('✅ Credenciais obtidas');
      return data;

    } catch (error) {
      console.error('❌ Erro inesperado ao obter credenciais:', error);
      throw error;
    }
  }

  /**
   * Buscar transações com filtros e paginação
   */
  async getTransactions(
    limit: number = 20,
    offset: number = 0,
    filters?: {
      status?: string;
      paymentMethod?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<{ transactions: Transaction[]; total: number }> {
    try {
      console.log('📋 Buscando transações...');

      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      params.append('offset', offset.toString());

      if (filters?.status) params.append('status', filters.status);
      if (filters?.paymentMethod) params.append('payment_method', filters.paymentMethod);
      if (filters?.startDate) params.append('start_date', filters.startDate);
      if (filters?.endDate) params.append('end_date', filters.endDate);

      const { data, error } = await supabase.functions.invoke(`transactions?${params.toString()}`, {
        method: 'GET',
      });

      if (error) {
        console.error('❌ Erro ao buscar transações:', error.message);
        throw error;
      }

      return {
        transactions: data.transactions || [],
        total: data.total || 0
      };

    } catch (error) {
      console.error('❌ Erro inesperado ao buscar transações:', error);
      throw error;
    }
  }

  /**
   * Buscar transação por ID
   */
  async getTransactionById(transactionId: string): Promise<Transaction> {
    try {
      console.log('🔍 Buscando transação:', transactionId);

      const { data, error } = await supabase.functions.invoke(`transactions/${transactionId}`, {
        method: 'GET',
      });

      if (error) {
        console.error('❌ Erro ao buscar transação:', error.message);
        throw error;
      }

      return data;

    } catch (error) {
      console.error('❌ Erro inesperado ao buscar transação:', error);
      throw error;
    }
  }

  /**
   * Cancelar transação
   */
  async cancelTransaction(transactionId: string): Promise<boolean> {
    try {
      console.log('❌ Cancelando transação:', transactionId);

      const { error } = await supabase.functions.invoke(`transactions/${transactionId}/cancel`, {
        method: 'PATCH',
      });

      if (error) {
        console.error('❌ Erro ao cancelar transação:', error.message);
        throw error;
      }

      console.log('✅ Transação cancelada');
      return true;

    } catch (error) {
      console.error('❌ Erro inesperado ao cancelar transação:', error);
      throw error;
    }
  }

  /**
   * Estornar transação
   */
  async refundTransaction(
    transactionId: string,
    amount?: number,
    reason?: string
  ): Promise<boolean> {
    try {
      console.log('↩️ Estornando transação:', transactionId);

      const { error } = await supabase.functions.invoke(`transactions/${transactionId}/refund`, {
        method: 'POST',
        body: {
          amount: amount || undefined, // Estorno total se não especificado
          reason: reason || 'Solicitação do cliente'
        },
      });

      if (error) {
        console.error('❌ Erro ao estornar transação:', error.message);
        throw error;
      }

      console.log('✅ Transação estornada');
      return true;

    } catch (error) {
      console.error('❌ Erro inesperado ao estornar transação:', error);
      throw error;
    }
  }

  /**
   * Buscar Resumo de Transações
   * GET /functions/v1/transacoes/resumo
   * 
   * Propósito: Obter dados agregados sobre transações.
   */
  async getTransactionSummary(): Promise<any> {
    try {
      console.log('📊 Buscando resumo de transações...');

      const { data, error } = await supabase.functions.invoke('transacoes/resumo', {
        method: 'GET',
      });

      if (error) {
        console.error('❌ Erro ao buscar resumo de transações:', error.message);
        throw error;
      }

      console.log('✅ Resumo de transações obtido');
      return data.summary;

    } catch (error) {
      console.error('❌ Erro inesperado ao buscar resumo de transações:', error);
      throw error;
    }
  }

  /**
   * Capturar transação pré-autorizada (cartão)
   */
  async captureTransaction(transactionId: string, amount?: number): Promise<boolean> {
    try {
      console.log('✅ Capturando transação:', transactionId);

      const { error } = await supabase.functions.invoke(`transactions/${transactionId}/capture`, {
        method: 'POST',
        body: {
          amount: amount || undefined // Captura total se não especificado
        },
      });

      if (error) {
        console.error('❌ Erro ao capturar transação:', error.message);
        throw error;
      }

      console.log('✅ Transação capturada');
      return true;

    } catch (error) {
      console.error('❌ Erro inesperado ao capturar transação:', error);
      throw error;
    }
  }

  /**
   * Método compatível com a interface existente para getTransactions simples
   */
  async getTransactionsList(limit?: number): Promise<Transaction[]> {
    const result = await this.getTransactions(limit || 20, 0);
    return result.transactions;
  }
}

export const transactionService = new TransactionService(); 