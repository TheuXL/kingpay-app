import {
  Company,
  CompanyAcquirer,
  CompanyConfig,
  CompanyCount,
  CompanyDocument,
  CompanyFinancialInfo,
  CompanyReserve,
  CompanyTaxes
} from '../../../src/types/company';

// Mock company data
export const mockCompany: Company = {
  id: 'd94f8d44-5ae6-4a29-8d7c-f9b394c56490',
  name: 'Test Company',
  cnpj: '12345678901234',
  email: 'contact@testcompany.com',
  phone: '+5511999999999',
  address: {
    street: 'Test Street',
    number: '123',
    complement: 'Suite 456',
    neighborhood: 'Test Neighborhood',
    city: 'Test City',
    state: 'TS',
    postal_code: '12345-678',
    country: 'Brazil'
  },
  city: 'Test City',
  state: 'TS',
  postal_code: '12345-678',
  logo: 'https://testcompany.com/logo.png',
  status: 'approved',
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
};

// Mock company taxes
export const mockCompanyTaxes: CompanyTaxes = {
  id: 'tax-123',
  company_id: 'd94f8d44-5ae6-4a29-8d7c-f9b394c56490',
  pix_fee_percentage: 0.99,
  pix_fee_fixed: 0.5,
  boleto_fee_percentage: 1.5,
  boleto_fee_fixed: 2.0,
  card_fee_percentage: 2.5,
  card_fee_fixed: 0.3,
  mdr_1x: 1.99,
  mdr_2x: 2.99,
  mdr_3x: 3.99,
  mdr_4x: 4.99,
  mdr_5x: 5.99,
  mdr_6x: 6.99,
  mdr_7x: 7.99,
  mdr_8x: 8.99,
  mdr_9x: 9.99,
  mdr_10x: 10.99,
  mdr_11x: 11.99,
  mdr_12x: 12.99,
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
};

// Mock company reserve
export const mockCompanyReserve: CompanyReserve = {
  id: 'reserve-123',
  company_id: 'd94f8d44-5ae6-4a29-8d7c-f9b394c56490',
  reserve_percentage: 10,
  reserve_days: 30,
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
};

// Mock company config
export const mockCompanyConfig: CompanyConfig = {
  id: 'config-123',
  company_id: 'd94f8d44-5ae6-4a29-8d7c-f9b394c56490',
  allow_pix: true,
  allow_boleto: true,
  allow_credit_card: true,
  allow_split: false,
  allow_marketplace: false,
  allow_subscription: true,
  allow_link_payment: true,
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
};

// Mock company documents
export const mockCompanyDocuments: CompanyDocument[] = [
  {
    id: 'doc-123',
    company_id: 'd94f8d44-5ae6-4a29-8d7c-f9b394c56490',
    document_type: 'cnpj',
    document_url: 'https://testcompany.com/docs/cnpj.pdf',
    status: 'approved',
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 'doc-456',
    company_id: 'd94f8d44-5ae6-4a29-8d7c-f9b394c56490',
    document_type: 'contract',
    document_url: 'https://testcompany.com/docs/contract.pdf',
    status: 'pending',
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
];

// Mock company acquirers
export const mockCompanyAcquirers: CompanyAcquirer[] = [
  {
    id: 'acq-123',
    company_id: 'd94f8d44-5ae6-4a29-8d7c-f9b394c56490',
    acquirer_id: 'a22e8e59-1fcf-431a-8b85-e88a26f61113',
    acquirer_name: 'Test Acquirer',
    acquirers_pix: true,
    acquirers_boleto: true,
    acquirers_card: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
];

// Mock company financial info
export const mockCompanyFinancialInfo: CompanyFinancialInfo = {
  id: 'fin-123',
  company_id: 'd94f8d44-5ae6-4a29-8d7c-f9b394c56490',
  bank_code: '001',
  bank_name: 'Banco do Brasil',
  agency: '1234',
  account: '56789-0',
  account_type: 'checking',
  account_holder_name: 'Test Company',
  account_holder_tax_id: '12345678901234',
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
};

// Mock company count
export const mockCompanyCount: CompanyCount = {
  total: 100,
  pending: 20,
  approved: 70,
  rejected: 5,
  blocked: 5,
};

// Mock companies list
export const mockCompaniesList: Company[] = [
  mockCompany,
  {
    ...mockCompany,
    id: '6d68e2a7-d7fd-491e-9381-40bf449ac634',
    name: 'Another Company',
    cnpj: '98765432109876',
    email: 'contact@anothercompany.com',
    status: 'pending',
  },
  {
    ...mockCompany,
    id: 'ba2e4c35-4df7-43d2-9c9a-d8e605f0caee',
    name: 'Third Company',
    cnpj: '45678901234567',
    email: 'contact@thirdcompany.com',
    status: 'rejected',
  },
];

// Mock calculated taxes
export const mockCalculatedTaxes = {
  valor_original: 100.0,
  valor_taxa: 2.5,
  valor_liquido: 97.5,
  taxa_percentual: 2.5,
  taxa_fixa: 0.0,
}; 