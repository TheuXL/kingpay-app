/**
 * 💳 WALLET SERVICE - KINGPAY
 * ===========================
 * 
 * Serviço de carteira baseado na documentação dos endpoints
 * - Consulta de saldo
 * - Extrato de movimentações
 * - Saques e antecipações
 */

import { supabase } from '../../lib/supabase';
import { ApiResponse } from '../../types/api';

export interface WalletData {
  id: string;
  user_id: string;
  company_id: string;
  balance: number; // Saldo disponível
  available_balance: number; // Saldo disponível para saque
  pending_balance: number; // Saldo pendente
  reserved_balance?: number; // Reserva financeira
  currency: 'BRL';
  status: 'active' | 'blocked' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface ExtractEntry {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'cancelled';
  reference_id?: string;
  created_at: string;
  metadata?: any;
}

export interface WithdrawalRequest {
  amount: number;
  pix_key: string;
  description?: string;
}

export interface WithdrawalResponse {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'done' | 'cancelled';
  pix_key: string;
  description?: string;
  reason_for_denial?: string;
  created_at: string;
  updated_at?: string;
}

export interface AnticipationRequest {
  amount?: number; // Se não informado, antecipa tudo disponível
}

export interface AnticipationResponse {
  id: string;
  amount: number;
  fee: number;
  net_amount: number;
  status: 'pending' | 'approved' | 'done' | 'denied';
  created_at: string;
}

class WalletService {
  /**
   * Consultar carteira do usuário
   * Endpoint: GET /functions/v1/wallet
   */
  async getWallet(userId?: string): Promise<ApiResponse<WalletData>> {
    try {
      console.log('💳 Consultando carteira...');

      const params = userId ? `?userId=${userId}` : '';
      const { data, error } = await supabase.functions.invoke(`wallet${params}`);

      if (error) {
        console.error('❌ Erro ao consultar carteira:', error.message);
        return {
          success: false,
          error: error.message,
          data: null
        };
      }

      console.log('✅ Carteira consultada!');
      return {
        success: true,
        data: data as WalletData,
        error: null
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao consultar carteira';
      console.error('❌ Erro inesperado ao consultar carteira:', errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }
  }

  /**
   * Consultar extrato
   * Endpoint: GET /functions/v1/extrato/:userId
   */
  async getExtract(userId: string, params?: {
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<ExtractEntry[]>> {
    try {
      console.log('📋 Consultando extrato...');

      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      const { data, error } = await supabase.functions.invoke(`extrato/${userId}${queryString}`);

      if (error) {
        console.error('❌ Erro ao consultar extrato:', error.message);
        return {
          success: false,
          error: error.message,
          data: null
        };
      }

      return {
        success: true,
        data: (data || []) as ExtractEntry[],
        error: null
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao consultar extrato';
      console.error('❌ Erro inesperado ao consultar extrato:', errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }
  }

  /**
   * Solicitar saque
   * Endpoint: POST /functions/v1/withdrawals
   */
  async requestWithdrawal(withdrawalData: WithdrawalRequest): Promise<ApiResponse<WithdrawalResponse>> {
    try {
      console.log('💸 Solicitando saque...', withdrawalData.amount);

      const { data, error } = await supabase.functions.invoke('withdrawals', {
        body: {
          requestedamount: withdrawalData.amount,
          pix_key: withdrawalData.pix_key,
          description: withdrawalData.description || 'Saque solicitado',
          isPix: true
        }
      });

      if (error) {
        console.error('❌ Erro ao solicitar saque:', error.message);
        return {
          success: false,
          error: error.message,
          data: null
        };
      }

      console.log('✅ Saque solicitado com sucesso!');
      return {
        success: true,
        data: data as WithdrawalResponse,
        error: null
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao solicitar saque';
      console.error('❌ Erro inesperado ao solicitar saque:', errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }
  }

  /**
   * Listar saques do usuário
   * Endpoint: GET /functions/v1/saques (filtrado por usuário)
   */
  async getWithdrawals(params?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<ApiResponse<WithdrawalResponse[]>> {
    try {
      console.log('📋 Listando saques...');

      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());
      if (params?.status) queryParams.append('status', params.status);

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

      const { data, error } = await supabase.functions.invoke(`saques${queryString}`);

      if (error) {
        console.error('❌ Erro ao listar saques:', error.message);
        return {
          success: false,
          error: error.message,
          data: null
        };
      }

      return {
        success: true,
        data: (data || []) as WithdrawalResponse[],
        error: null
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao listar saques';
      console.error('❌ Erro inesperado ao listar saques:', errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }
  }

  /**
   * Solicitar antecipação de recebíveis
   * Endpoint: POST /functions/v1/antecipacoes/create
   */
  async requestAnticipation(anticipationData: AnticipationRequest): Promise<ApiResponse<AnticipationResponse>> {
    try {
      console.log('⚡ Solicitando antecipação...');

      const { data, error } = await supabase.functions.invoke('antecipacoes/create', {
        body: anticipationData
      });

      if (error) {
        console.error('❌ Erro ao solicitar antecipação:', error.message);
        return {
          success: false,
          error: error.message,
          data: null
        };
      }

      console.log('✅ Antecipação solicitada com sucesso!');
      return {
        success: true,
        data: data as AnticipationResponse,
        error: null
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao solicitar antecipação';
      console.error('❌ Erro inesperado ao solicitar antecipação:', errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }
  }

  /**
   * Listar antecipações
   * Endpoint: GET /functions/v1/antecipacoes/anticipations
   */
  async getAnticipations(params?: {
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<AnticipationResponse[]>> {
    try {
      console.log('📋 Listando antecipações...');

      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

      const { data, error } = await supabase.functions.invoke(`antecipacoes/anticipations${queryString}`);

      if (error) {
        console.error('❌ Erro ao listar antecipações:', error.message);
        return {
          success: false,
          error: error.message,
          data: null
        };
      }

      return {
        success: true,
        data: (data || []) as AnticipationResponse[],
        error: null
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao listar antecipações';
      console.error('❌ Erro inesperado ao listar antecipações:', errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }
  }
}

// Instância singleton
export const walletService = new WalletService();
export default walletService; 