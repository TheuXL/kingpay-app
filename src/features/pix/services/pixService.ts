/**
 * Módulo: Chaves PIX
 * Endpoints relacionados ao gerenciamento de chaves PIX
 */

import supabase from '../../../config/supabaseClient';

export interface PixKey {
  id: string;
  key: string;
  type: 'EMAIL' | 'PHONE' | 'CPF' | 'CNPJ' | 'EVP';
  description: string;
  v: boolean; // verificado/aprovado
  createdAt?: string;
  updatedAt?: string;
}

/**
 * List all PIX keys for the user
 * API Endpoint: GET /pix-key
 */
export const getPixKeys = async (page = 1, limit = 20) => {
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  params.append('offset', ((page - 1) * limit).toString());
  
  const url = params.toString() ? `pix-key?${params.toString()}` : 'pix-key';
  
  const { data, error } = await supabase.functions.invoke(url);
  if (error) throw error;
  return data;
};

/**
 * Create a new PIX key
 * API Endpoint: POST /pix-key
 */
export const createPixKey = async (keyData: {
  key: string;
  type: 'EMAIL' | 'PHONE' | 'CPF' | 'CNPJ' | 'EVP';
  description: string;
}) => {
  const { data, error } = await supabase.functions.invoke('pix-key', {
    body: keyData
  });
  if (error) throw error;
  return data;
};

/**
 * Update an existing PIX key
 * API Endpoint: PUT /pix-key/:id
 */
export const updatePixKey = async (keyId: string, keyData: {
  key: string;
  type: 'EMAIL' | 'PHONE' | 'CPF' | 'CNPJ' | 'EVP';
  description: string;
}) => {
  const { data, error } = await supabase.functions.invoke(`pix-key/${keyId}`, {
    method: 'PUT',
    body: keyData
  });
  if (error) throw error;
  return data;
};

/**
 * Approve or reject a PIX key (Admin only)
 * API Endpoint: PATCH /pix-key/:id/approve
 */
export const approvePixKey = async (keyId: string, approve: boolean, financialPassword: string) => {
  const { data, error } = await supabase.functions.invoke(`pix-key/${keyId}/approve`, {
    method: 'PATCH',
    body: { v: approve },
    headers: {
      'financial-password': financialPassword
    }
  });
  if (error) throw error;
  return data;
}; 