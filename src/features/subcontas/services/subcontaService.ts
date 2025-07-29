/**
 * Módulo: Subcontas (Marketplace)
 * Endpoints relacionados a criação e gerenciamento de subcontas
 */

import supabase from '../../../config/supabaseClient';

export interface SubcontaData {
  companyId: string;
  subconta_nome: string;
  banco: string;
  agencia: string;
  conta: string;
  tipo_conta: 'Corrente' | 'Poupança';
  adquirente_nome?: string;
}

/**
 * Create a new subconta
 * API Endpoint: POST /subconta
 */
export const createSubconta = async (subcontaData: SubcontaData) => {
  const { data, error } = await supabase.functions.invoke('subconta', {
    body: {
      ...subcontaData,
      adquirente_nome: subcontaData.adquirente_nome || 'IUGU_SUBCONTA'
    }
  });
  if (error) throw error;
  return data;
};

/**
 * Check subconta status
 * API Endpoint: POST /subconta/checkstatus
 */
export const checkSubcontaStatus = async (statusData: {
  sub_account_id: string;
  sub_account_live_token: string;
  adquirente_nome?: string;
}) => {
  const { data, error } = await supabase.functions.invoke('subconta/checkstatus', {
    body: {
      ...statusData,
      adquirente_nome: statusData.adquirente_nome || 'IUGU_SUBCONTA'
    }
  });
  if (error) throw error;
  return data;
};

/**
 * Resend KYC documents
 * API Endpoint: PUT /subconta/resend_documents
 */
export const resendKycDocument = async (documentData: {
  sub_account_id: string;
  sub_account_live_token: string;
  identification?: string;
  activity?: string;
  billing?: string;
  person_type?: 'PF' | 'PJ';
}) => {
  const { data, error } = await supabase.functions.invoke('subconta/resend_documents', {
    method: 'PUT',
    body: documentData
  });
  if (error) throw error;
  return data;
};

/**
 * Check KYC status
 * API Endpoint: POST /subconta/check_kyc
 */
export const checkKycStatus = async (subAccountToken: string) => {
  const { data, error } = await supabase.functions.invoke('subconta/check_kyc', {
    body: { sub_account_live_token: subAccountToken }
  });
  if (error) throw error;
  return data;
}; 