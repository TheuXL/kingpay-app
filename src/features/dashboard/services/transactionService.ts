/**
 * Serviço para buscar dados de transações
 * Endpoints que estão funcionando conforme teste real
 */

import supabase from '../../../config/supabaseClient';

/**
 * Busca o resumo de transações
 * API Endpoint: GET /transacoes/resumo
 * Status: ✅ Funcionando
 */
export const getTransactionSummary = async () => {
  const { data, error } = await supabase.functions.invoke('transacoes/resumo');
  if (error) throw error;
  return data.summary;
};

/**
 * Busca o histórico de transações
 * API Endpoint: GET /transacoes
 * Status: ✅ Funcionando
 */
export const getTransactionHistory = async (page = 1, limit = 20) => {
  const { data, error } = await supabase.functions.invoke(
    `transacoes?page=${page}&limit=${limit}`
  );
  if (error) throw error;
  return data.transactions;
};

/**
 * Busca os dados da empresa
 * API Endpoint: GET /companies
 * Status: ✅ Funcionando
 */
export const getCompanyData = async () => {
  const { data, error } = await supabase.functions.invoke('companies');
  if (error) throw error;
  return data.companies?.[0]; // Retorna a primeira empresa
}; 