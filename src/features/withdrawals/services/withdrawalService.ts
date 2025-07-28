/**
 * 💸 WITHDRAWAL SERVICE - KINGPAY
 * ===============================
 * 
 * Serviço para saques e transferências conforme documentação REFATORACAO_COMPLETA.md
 */
import { edgeFunctionsProxy } from "../../../services/api/EdgeFunctionsProxy";
import { CreateWithdrawalPayload, UpdateWithdrawalPayload, Withdrawal, WithdrawalsAggregates } from "../types";

class WithdrawalService {
    async getWithdrawals(): Promise<Withdrawal[]> {
        const response = await edgeFunctionsProxy.invoke('saques', 'GET');
        return response.withdrawals;
    }

    async getWithdrawalAggregates(): Promise<WithdrawalsAggregates> {
        const response = await edgeFunctionsProxy.invoke('saques/aggregates', 'GET');
        return response.aggregates;
    }

    async updateWithdrawal(withdrawalId: string, payload: UpdateWithdrawalPayload): Promise<any> {
        return edgeFunctionsProxy.invoke(`withdrawals/${withdrawalId}`, 'PATCH', payload);
    }

    async createWithdrawal(payload: CreateWithdrawalPayload): Promise<any> {
        return edgeFunctionsProxy.invoke('withdrawals', 'POST', payload);
    }
}

export const withdrawalService = new WithdrawalService(); 