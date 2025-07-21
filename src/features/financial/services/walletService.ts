import { supabase } from '../../../lib/supabase';

/**
 * Módulo: Carteira, Saques e Antecipações
 * Endpoints 57-64 da documentação INTEGRACAO.md
 */
export class WalletService {

  /**
   * Endpoint 57: Solicitar Saque (POST /functions/v1/withdrawals)
   * Propósito: Iniciar uma solicitação de retirada de saldo.
   */
  async requestWithdrawal(pixKeyId: string, amountInCents: number, description: string) {
    try {
      const { data, error } = await supabase.functions.invoke('withdrawals', {
        body: {
          pixkeyid: pixKeyId,
          requestedamount: amountInCents,
          description: description,
          isPix: true,
        },
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao solicitar saque:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Endpoint 58: Gerenciar Saques (Admin) (PATCH /functions/v1/withdrawals/:id)
   * Propósito: Aprovar, negar ou marcar um saque como pago manualmente.
   * status pode ser 'approved', 'cancelled', 'done_manual'
   */
  async manageWithdrawal(withdrawalId: string, status: string, reason: string = '') {
    try {
      const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawalId}`, {
        method: 'PATCH',
        body: { status, reason_for_denial: reason },
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao gerenciar saque:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Endpoint 59: Solicitar Antecipação (POST /functions/v1/antecipacoes/create)
   * Propósito: Solicitar a antecipação de todos os recebíveis de cartão.
   */
  async requestAnticipation() {
    try {
      const { data, error } = await supabase.functions.invoke('antecipacoes/create');
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao solicitar antecipação:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * GET /functions/v1/antecipacoes/anticipations
   * Propósito: Listar solicitações de antecipação (Admin).
   */
  async getAnticipations(filters?: { limit?: number; offset?: number; status?: string; }) {
    try {
      const params = new URLSearchParams();
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());
      if (filters?.status) params.append('status', filters.status);

      const { data, error } = await supabase.functions.invoke(`antecipacoes/anticipations?${params.toString()}`, {
        method: 'GET',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao listar antecipações:', error);
      throw error;
    }
  }

  /**
   * Endpoint 60: Aprovar Antecipação (Admin) (POST /functions/v1/antecipacoes/approve)
   * Propósito: Aprovar uma solicitação de antecipação.
   */
  async approveAnticipation(anticipationId: string) {
    try {
      await supabase.functions.invoke('antecipacoes/approve', {
        body: { anticipationId },
      });
    } catch (error) {
      console.error('Erro ao aprovar antecipação:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Endpoint 61: Negar Antecipação (Admin) (PATCH /functions/v1/antecipacoes/deny)
   * Propósito: Recusar uma solicitação de antecipação com um motivo.
   */
  async denyAnticipation(anticipationId: string, reason: string) {
    try {
      await supabase.functions.invoke('antecipacoes/deny', {
        method: 'PATCH',
        body: { anticipationId, reason },
      });
    } catch (error) {
      console.error('Erro ao negar antecipação:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Endpoint 62: Gerenciar Saldo Manualmente (Admin) (POST /functions/v1/wallet/balance-management)
   * Propósito: Adicionar ou remover saldo da carteira de um usuário.
   * operation pode ser 'add' ou 'remove'
   */
  async manageBalance(userId: string, amount: number, type: string, reason: string, operation: 'add' | 'remove') {
    try {
      await supabase.functions.invoke('wallet/balance-management', {
        body: {
          userId,
          amount,
          type, // 'pix', 'card', etc.
          motivo: reason,
          operation,
        },
      });
    } catch (error) {
      console.error('Erro ao gerenciar saldo:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Endpoint 63: Consultar Carteira (Wallet) (GET /functions/v1/wallet)
   * Propósito: Obter o resumo financeiro da carteira de um usuário.
   */
  async getWalletSummary(userId?: string) {
    try {
      // userId é opcional, a função de backend deve pegar o do usuário logado se não for admin
      const { data, error } = await supabase.functions.invoke(
        `wallet${userId ? `?userId=${userId}` : ''}`,
        { method: 'GET' } // Garantir que seja GET
      );
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar carteira:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Endpoint 64: Consultar Extrato (GET /functions/v1/extrato/:userId)
   * Propósito: Obter o histórico de movimentações da carteira.
   */
  async getStatement(userId: string, page: number = 1, limit: number = 20) {
    try {
      const { data, error } = await supabase.functions.invoke(
        `extrato/${userId}?limit=${limit}&offset=${(page - 1) * limit}`,
        { method: 'GET' } // Garantir que seja GET
      );
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar extrato:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * POST /functions/v1/wallet/remove-balance (Admin)
   * Propósito: Permitir que um administrador remova saldo manualmente.
   */
  async removeBalance(userId: string, amount: number, reason: string) {
    try {
      const { data, error } = await supabase.functions.invoke('wallet/remove-balance', {
        method: 'POST',
        body: { userId, amount, motivo: reason },
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao remover saldo:', error);
      throw error;
    }
  }

  // Métodos de compatibilidade com a interface existente
  async getWalletData() {
    return await this.getWalletSummary();
  }

  /**
   * Método getWallet que está sendo chamado pelo WalletScreen
   * Este é um alias para getWalletSummary
   */
  async getWallet(userId?: string) {
    return await this.getWalletSummary(userId);
  }

  async getTransactionHistory() {
    // Implementar usando getStatement se necessário
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      return await this.getStatement(userId);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw error;
    }
  }
}

export const walletService = new WalletService(); 