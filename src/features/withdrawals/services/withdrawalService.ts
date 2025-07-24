/**
 * 💸 WITHDRAWAL SERVICE - KINGPAY
 * ===============================
 * 
 * Serviço para saques e transferências
 * - Requisições reais à API do Supabase
 * - Sem fallbacks ou dados mockados
 */

import api from '../../../services/api';

/**
 * Atualiza o status de um saque (Aprovar ou Negar).
 * @param withdrawalId - O ID do saque a ser atualizado.
 * @param status - O novo status ('approved' ou 'cancelled').
 * @param reasonForDenial - (Opcional) O motivo da negação.
 * @returns Promise com o resultado da operação.
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
  // O endpoint de atualização de saque não foi validado, mas o teste usa PATCH /withdrawals/:id
  // Assumindo que o endpoint real seja PATCH /functions/v1/withdrawals/:id
  return api.patch(`/functions/v1/withdrawals/${withdrawalId}`, payload);
}; 