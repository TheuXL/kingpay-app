/**
 * 💸 WITHDRAWAL SERVICE - KINGPAY
 * ===============================
 * 
 * Serviço para saques e transferências conforme documentação REFATORACAO_COMPLETA.md
 */
import { edgeFunctionsProxy } from "../../../services/api/EdgeFunctionsProxy";

export interface Withdrawal {
  id: string;
  createdat: string;
  updatedat: string;
  status: 'done' | 'pending' | 'failed' | 'cancelled' | 'approved';
  type: string;
  amount: number;
  company_name?: string;
  company_taxid?: string;
  pix_key_id?: string;
  pix_key?: string;
  pix_key_type?: string;
  description?: string;
  reason_for_denial?: string;
}

export interface WithdrawalsResponse {
  withdrawals: Withdrawal[];
}

export interface WithdrawalsAggregates {
  aggregates: {
    done: number;
    failed: number;
    cancelled: number;
    approved: number;
    pending: number;
    total: number;
  };
}

/**
 * 📊 LISTAR TODOS OS SAQUES
 * Endpoint: GET /functions/v1/saques
 * 
 * Retorna lista de saques com:
 * - id: identificador do saque
 * - createdat: data de criação
 * - updatedat: data de atualização
 * - status: done, pending, failed, cancelled, approved
 * - type: tipo do saque
 * - amount: valor do saque
 * - company_name: nome da empresa
 * - company_taxid: CNPJ/CPF da empresa
 * - pix_key_id: ID da chave PIX
 * - pix_key: chave PIX
 * - pix_key_type: tipo da chave PIX
 * - description: descrição do saque
 * - reason_for_denial: motivo da negação
 */
export const getWithdrawals = async () => {
  return edgeFunctionsProxy.get<WithdrawalsResponse>('saques');
};

/**
 * 📈 DADOS AGREGADOS DE SAQUES
 * Endpoint: GET /functions/v1/saques/aggregates
 * 
 * Retorna contagem de saques por status:
 * - done: concluídos
 * - failed: falharam
 * - cancelled: cancelados
 * - approved: aprovados
 * - pending: pendentes
 * - total: total geral
 */
export const getWithdrawalsAggregates = async () => {
  return edgeFunctionsProxy.get<WithdrawalsAggregates>('saques/aggregates');
};

/**
 * ✅ APROVAR/NEGAR SAQUE
 * Endpoint: PATCH /functions/v1/withdrawals/:id
 * 
 * Atualiza o status de um saque:
 * - status: 'approved' ou 'cancelled'
 * - reason_for_denial: motivo da negação (opcional)
 */
export const updateWithdrawalStatus = (
  withdrawalId: string,
  status: 'approved' | 'cancelled',
  reasonForDenial?: string
) => {
  const payload = {
    status,
    reason_for_denial: reasonForDenial,
  };
  return edgeFunctionsProxy.patch(`withdrawals/${withdrawalId}`, payload);
};

/**
 * 💰 CRIAR NOVO SAQUE
 * Endpoint: POST /functions/v1/withdrawals
 * 
 * Cria um novo saque:
 * - amount: valor do saque
 * - pix_key_id: ID da chave PIX
 * - description: descrição (opcional)
 */
export const createWithdrawal = async (amount: number, pixKeyId: string, description?: string) => {
  const payload = {
    amount,
    pix_key_id: pixKeyId,
    description,
  };
  return edgeFunctionsProxy.post('withdrawals', payload);
}; 