/**
 * 💰 Módulo: Financeiro (Carteira, Extrato)
 * =========================================
 * 
 * Endpoints para dados financeiros conforme documentação REFATORACAO_COMPLETA.md
 */
import { edgeFunctionsProxy } from "../../../services/api/EdgeFunctionsProxy";
import type { WhitelabelFinancial } from "../../../types/dashboard";

export interface FinancialSummary {
  balance: number;
  balance_card: number;
  a_receber: number;
  reserva: number;
  total: number;
}

export interface WalletTransaction {
  id: string;
  tipo: string;
  created_at: string;
  valor: number;
  entrada: boolean;
  descricao?: string;
  status?: string;
}

export class WalletService {
    /**
     * 🏦 DADOS DA CARTEIRA
     * Endpoint: GET /functions/v1/wallet
     * 
     * Retorna dados da carteira:
     * - balance: saldo disponível (Pix)
     * - balance_card: saldo disponível (Cartão)
     * - a_receber: valor a receber
     * - reserva: reserva financeira
     * - total: saldo total
     */
    getWalletData(userId?: string) {
        const params = userId ? `?userId=${userId}` : '';
        return edgeFunctionsProxy.get<FinancialSummary>(`wallet${params}`);
    }

    /**
     * 📊 EXTRATO DETALHADO
     * Endpoint: GET /functions/v1/extrato/:userId
     * 
     * Retorna lista de transações do usuário:
     * - id: identificador da transação
     * - tipo: tipo da transação
     * - created_at: data/hora
     * - valor: valor da transação
     * - entrada: se é entrada ou saída
     * - descricao: descrição da transação
     * - status: status da transação
     */
    getWalletStatement(userId: string) {
        return edgeFunctionsProxy.get<WalletTransaction[]>(`extrato/${userId}`);
    }

    /**
     * 💳 DADOS FINANCEIROS WHITELABEL
     * Endpoint: POST /functions/v1/whitelabel-financeiro
     * 
     * Retorna dados financeiros do whitelabel:
     * - total_balances: saldos totais
     * - pending_withdrawals: saques pendentes
     * - pending_anticipations: antecipações pendentes
     */
    getWhitelabelFinancial(startDate: string, endDate: string) {
        const params = `?start_date=${startDate}&end_date=${endDate}`;
        return edgeFunctionsProxy.post<WhitelabelFinancial>(`whitelabel-financeiro${params}`, {});
    }
}

export const walletService = new WalletService(); 