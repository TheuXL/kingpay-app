/**
 * Módulo: Empresas
 * Endpoints relacionados ao gerenciamento de empresas
 */

import supabase from '../../../config/supabaseClient';

export interface Company {
  id: string;
  name: string;
  taxid: string;
  status: 'pending' | 'approved' | 'rejected';
  createdat: string;
  invoicename?: string;
  invoiceemail?: string;
  invoicedocument?: string;
  invoicephone?: string;
  invoiceaddress?: string;
  responsiblename?: string;
  responsibleemail?: string;
  responsiblephone?: string;
  responsiblecpf?: string;
  responsiblebirthdate?: string;
}

/**
 * Get companies list
 * API Endpoint: GET /companies
 */
export const getCompanies = async () => {
  const { data, error } = await supabase.functions.invoke('companies');
  if (error) throw error;
  return data;
};

/**
 * Get company by ID
 * API Endpoint: GET /companies/:id
 */
export const getCompanyById = async (companyId: string) => {
  const { data, error } = await supabase.functions.invoke(`companies/${companyId}`);
  if (error) throw error;
  return data;
};

/**
 * Update company
 * API Endpoint: PUT /companies/:id
 */
export const updateCompany = async (companyId: string, companyData: Partial<Company>) => {
  const { data, error } = await supabase.functions.invoke(`companies/${companyId}`, {
    method: 'PUT',
    body: companyData
  });
  if (error) throw error;
  return data;
}; 