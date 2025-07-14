export interface Company {
  id: string;
  name: string;
  cnpj: string;
  email?: string;
  phone?: string;
  address?: CompanyAddress;
  city?: string;
  state?: string;
  postal_code?: string;
  logo?: string;
  logo_url?: string;
  tax_id?: string;
  website?: string;
  legal_representative?: CompanyLegalRepresentative;
  status: CompanyStatus;
  created_at: string;
  updated_at: string;
}

export interface CompanyAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface CompanyLegalRepresentative {
  name: string;
  email: string;
  phone: string;
  tax_id: string;
  birth_date: string;
}

export type CompanyStatus = 'active' | 'pending' | 'suspended' | 'inactive' | 'approved' | 'rejected' | 'blocked';

export interface CompanyTax {
  id: string;
  company_id: string;
  name: string;
  percentage: number;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyTaxes {
  id: string;
  company_id: string;
  pix_fee_percentage: number;
  pix_fee_fixed: number;
  boleto_fee_percentage: number;
  boleto_fee_fixed: number;
  card_fee_percentage: number;
  card_fee_fixed: number;
  mdr_1x: number;
  mdr_2x: number;
  mdr_3x: number;
  mdr_4x: number;
  mdr_5x: number;
  mdr_6x: number;
  mdr_7x: number;
  mdr_8x: number;
  mdr_9x: number;
  mdr_10x: number;
  mdr_11x: number;
  mdr_12x: number;
  created_at: string;
  updated_at: string;
}

export interface CompanyReserve {
  id: string;
  company_id: string;
  reserve_percentage: number;
  reserve_days: number;
  created_at: string;
  updated_at: string;
}

export interface CompanyConfig {
  id: string;
  company_id: string;
  allow_pix: boolean;
  allow_boleto: boolean;
  allow_credit_card: boolean;
  allow_split: boolean;
  allow_marketplace: boolean;
  allow_subscription: boolean;
  allow_link_payment: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyDocument {
  id: string;
  company_id: string;
  document_type: string;
  document_url: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyAcquirer {
  id: string;
  company_id: string;
  acquirer_id: string;
  acquirer_name: string;
  acquirers_pix: boolean;
  acquirers_boleto: boolean;
  acquirers_card: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyFinancialInfo {
  id: string;
  company_id: string;
  bank_code: string;
  bank_name: string;
  agency: string;
  account: string;
  account_type: string;
  account_holder_name: string;
  account_holder_tax_id: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyCount {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  blocked: number;
}

export interface CreateCompanyPayload {
  name: string;
  cnpj: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  logo?: string;
}

export interface UpdateCompanyPayload {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  logo?: string;
  status?: CompanyStatus;
}

export interface UpdateCompanyStatusPayload {
  status: CompanyStatus;
  reason?: string;
}

export interface CreateCompanyTaxPayload {
  company_id: string;
  name: string;
  percentage: number;
  description?: string;
  active?: boolean;
}

export interface UpdateCompanyTaxPayload {
  name?: string;
  percentage?: number;
  description?: string;
  active?: boolean;
}

export interface UpdateCompanyTaxesPayload {
  pix_fee_percentage?: number;
  pix_fee_fixed?: number;
  boleto_fee_percentage?: number;
  boleto_fee_fixed?: number;
  card_fee_percentage?: number;
  card_fee_fixed?: number;
  mdr_1x?: number;
  mdr_2x?: number;
  mdr_3x?: number;
  mdr_4x?: number;
  mdr_5x?: number;
  mdr_6x?: number;
  mdr_7x?: number;
  mdr_8x?: number;
  mdr_9x?: number;
  mdr_10x?: number;
  mdr_11x?: number;
  mdr_12x?: number;
} 