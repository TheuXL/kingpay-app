import supabase from '../../../config/supabaseClient';

/**
 * Módulo: Adquirentes - Admin
 * Endpoints para gerenciamento de adquirentes/gateways de pagamento.
 */

/**
 * GET /acquirers/:id - Busca detalhes de um adquirente.
 */
export const getAcquirer = async (acquirerId: string) => {
  const { data, error } = await supabase.functions.invoke(`acquirers/${acquirerId}`);
  if (error) throw error;
  return data;
};

/**
 * GET /acquirers/:id/taxas - Busca taxas de um adquirente.
 */
export const getAcquirerRates = async (acquirerId: string) => {
  const { data, error } = await supabase.functions.invoke(`acquirers/${acquirerId}/taxas`);
  if (error) throw error;
  return data;
};

/**
 * PATCH /acquirers/:id/active - Ativa ou desativa um adquirente.
 */
export const setAcquirerActive = async (acquirerId: string, isActive: boolean) => {
  const { data, error } = await supabase.functions.invoke(`acquirers/${acquirerId}/active`, {
    method: 'PATCH',
    body: { active: isActive },
  });
  if (error) throw error;
  return data;
};

/**
 * PATCH /acquirers/:id/taxas - Atualiza as taxas de um adquirente.
 */
export const updateAcquirerRates = async (acquirerId: string, ratesData: object) => {
  const { data, error } = await supabase.functions.invoke(`acquirers/${acquirerId}/taxas`, {
    method: 'PATCH',
    body: ratesData,
  });
  if (error) throw error;
  return data;
}; 