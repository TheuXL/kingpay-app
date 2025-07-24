import supabase from '../../../config/supabaseClient';

/**
 * Módulo: BaaS (Banking as a Service) - Admin
 * Endpoints para gerenciamento de provedores BaaS.
 */

/**
 * GET /baas/:id - Busca detalhes de um provedor BaaS.
 */
export const getBaaSProvider = async (providerId: string) => {
  const { data, error } = await supabase.functions.invoke(`baas/${providerId}`);
  if (error) throw error;
  return data;
};

/**
 * GET /baas/:id/taxas - Busca taxas de um provedor BaaS.
 */
export const getBaaSRates = async (providerId: string) => {
  const { data, error } = await supabase.functions.invoke(`baas/${providerId}/taxas`);
  if (error) throw error;
  return data;
};

/**
 * PATCH /baas/:id/active - Ativa ou desativa um provedor BaaS.
 */
export const setBaaSProviderActive = async (providerId: string, isActive: boolean) => {
  const { data, error } = await supabase.functions.invoke(`baas/${providerId}/active`, {
    method: 'PATCH',
    body: { active: isActive },
  });
  if (error) throw error;
  return data;
};

/**
 * PATCH /baas/:id/taxa - Atualiza uma taxa específica de um provedor BaaS.
 */
export const updateBaaSRate = async (providerId: string, rateData: { rateName: string; rateValue: number }) => {
  const { data, error } = await supabase.functions.invoke(`baas/${providerId}/taxa`, {
    method: 'PATCH',
    body: rateData,
  });
  if (error) throw error;
  return data;
}; 