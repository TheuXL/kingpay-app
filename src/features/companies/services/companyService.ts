/**
 * 🏢 SERVIÇO DE GESTÃO DE EMPRESAS - KINGPAY
 * =========================================
 * 
 * Módulo: Empresa
 * Endpoints 56-65 da documentação INTEGRACAO.md
 * 
 * Implementação completa da gestão de empresas/vendedores
 * na plataforma com CRUD e configurações avançadas
 */

import { supabase } from '../../../lib/supabase';
import { edgeFunctionsProxy } from '../../../services/api/EdgeFunctionsProxy';

export interface Company {
  id: string;
  name: string;
  taxid: string; // CNPJ
  website?: string;
  postalcode: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone?: string;
  email?: string;
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
}

export interface CompanyTaxes {
  pixFee: number;
  boletoFee: number;
  creditCardFee: number;
  debitCardFee: number;
  pixFixedFee: number;
  boletoFixedFee: number;
  withdrawalFee: number;
  mdrCreditCard1x: number;
  mdrCreditCard2x: number;
  mdrCreditCard3x: number;
  mdrCreditCard4x: number;
  mdrCreditCard5x: number;
  mdrCreditCard6x: number;
  mdrCreditCard7x: number;
  mdrCreditCard8x: number;
  mdrCreditCard9x: number;
  mdrCreditCard10x: number;
  mdrCreditCard11x: number;
  mdrCreditCard12x: number;
}

export interface CompanyConfig {
  canAnticipate: boolean;
  canWithdraw: boolean;
  hasMultipleAccounts: boolean;
  requiresDocumentValidation: boolean;
  allowsPixPayment: boolean;
  allowsBoletoPayment: boolean;
  allowsCardPayment: boolean;
  maxWithdrawalAmount: number;
  maxDailyTransactions: number;
  notificationEmail?: string;
}

export interface CompanyReserve {
  reserveDaysAnticipation: number;
  reserveDaysBoleto: number;
  reserveDaysPix: number;
  reservePercentageAnticipation: number;
  reservePercentageBoleto: number;
  reservePercentagePix: number;
}

export interface CompanyDocuments {
  cnpjDocument?: string;
  identificationDocument?: string;
  selfieDocument?: string;
  socialContractDocument?: string;
  proofOfAddressDocument?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface CompanyFinancialInfo {
  totalRevenue: number;
  monthlyRevenue: number;
  totalTransactions: number;
  monthlyTransactions: number;
  availableBalance: number;
  pendingBalance: number;
  reserveBalance: number;
  lastTransactionDate?: Date;
}

export interface CreateCompanyRequest {
  name: string;
  taxid: string;
  website?: string;
  postalcode: string;
  address: string;
  city: string;
  state: string;
  country?: string;
  phone?: string;
  email?: string;
  creator: string; // ID do usuário criador
}

export class CompanyService {

  /**
   * Endpoint 56: Listar Todas as Empresas (Admin)
   * GET /functions/v1/companies
   */
  async getAllCompanies(filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ companies: Company[]; total: number }> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    
    const response = await edgeFunctionsProxy.invoke<{ companies: Company[]; total: number }>(`companies?${params.toString()}`, 'GET');
    if (response.success && response.data) return response.data;
    throw new Error(response.error || 'Erro ao listar empresas.');
  }

  /**
   * Endpoint 57: Obter Contagem de Empresas
   * GET /functions/v1/companies/contagem
   */
  async getCompaniesCount(): Promise<any> {
    const response = await edgeFunctionsProxy.invoke<any>('companies/contagem', 'GET');
    if (response.success && response.data) return response.data;
    throw new Error(response.error || 'Erro ao obter contagem de empresas.');
  }

  /**
   * Endpoint 58: Buscar Detalhes de uma Empresa
   * GET /functions/v1/companies/:id
   */
  async getCompanyById(companyId: string): Promise<Company> {
    const response = await edgeFunctionsProxy.invoke<any>(`companies/${companyId}`, 'GET');
    if (response.success && response.data.company) return response.data.company;
    throw new Error(response.error || 'Erro ao buscar empresa.');
  }

  /**
   * Endpoint 62: Criar Nova Empresa
   * POST /functions/v1/companies
   */
  async createCompany(companyData: CreateCompanyRequest): Promise<Company> {
    const response = await edgeFunctionsProxy.invoke<Company>('companies', 'POST', companyData);
    if (response.success && response.data) return response.data;
    throw new Error(response.error || 'Erro ao criar empresa.');
  }

  /**
   * Endpoint 61: Alterar Status da Empresa
   * PATCH /functions/v1/companies/:id/status
   */
  async updateCompanyStatus(
    companyId: string,
    status: 'approved' | 'rejected' | 'blocked',
    reason?: string
  ): Promise<Company> {
    const response = await edgeFunctionsProxy.invoke<Company>(`companies/${companyId}/status`, 'PATCH', { status, reason });
    if (response.success && response.data) return response.data;
    throw new Error(response.error || 'Erro ao atualizar status da empresa.');
  }

  /**
   * Buscar Taxas da Empresa
   * GET /functions/v1/companies/:id/taxas
   */
  async getCompanyTaxes(companyId: string): Promise<CompanyTaxes> {
    const response = await edgeFunctionsProxy.invoke<any>(`companies/${companyId}/taxas`, 'GET');
    if (response.success && response.data) {
      // A API retorna as taxas dentro de um objeto { taxas: ... }
      return response.data.taxas;
    }
    throw new Error(response.error || 'Erro ao buscar taxas da empresa');
  }

  /**
   * Atualizar Taxas da Empresa
   * PATCH /functions/v1/companies/:id/taxas
   */
  async updateCompanyTaxes(companyId: string, taxes: Partial<CompanyTaxes>): Promise<CompanyTaxes> {
    const response = await edgeFunctionsProxy.invoke<CompanyTaxes>(`companies/${companyId}/taxas`, 'PATCH', taxes);
    if (response.success && response.data) return response.data;
    throw new Error(response.error || 'Erro ao atualizar taxas da empresa.');
  }

  /**
   * Buscar Configurações da Empresa
   * GET /functions/v1/companies/:id/config
   */
  async getCompanyConfig(companyId: string): Promise<CompanyConfig> {
    const response = await edgeFunctionsProxy.invoke<any>(`companies/${companyId}/config`, 'GET');
    if (response.success && response.data.config) return response.data.config;
    throw new Error(response.error || 'Erro ao buscar config da empresa.');
  }

  /**
   * Atualizar Configurações da Empresa
   * PATCH /functions/v1/companies/:id/config
   */
  async updateCompanyConfig(companyId: string, config: Partial<CompanyConfig>): Promise<CompanyConfig> {
    const response = await edgeFunctionsProxy.invoke<CompanyConfig>(`companies/${companyId}/config`, 'PATCH', config);
    if (response.success && response.data) return response.data;
    throw new Error(response.error || 'Erro ao atualizar configurações da empresa.');
  }

  /**
   * Buscar Reserva Financeira da Empresa
   * GET /functions/v1/companies/:id/reserva
   */
  async getCompanyReserve(companyId: string): Promise<CompanyReserve> {
    const response = await edgeFunctionsProxy.invoke<any>(`companies/${companyId}/reserva`, 'GET');
    if (response.success && response.data.reserva) return response.data.reserva;
    throw new Error(response.error || 'Erro ao buscar reserva da empresa.');
  }

  /**
   * Atualizar Reserva Financeira da Empresa
   * PATCH /functions/v1/companies/:id/reserva
   */
  async updateCompanyReserve(companyId: string, reserve: Partial<CompanyReserve>): Promise<CompanyReserve> {
    const response = await edgeFunctionsProxy.invoke<CompanyReserve>(`companies/${companyId}/reserva`, 'PATCH', reserve);
    if (response.success && response.data) return response.data;
    throw new Error(response.error || 'Erro ao atualizar reserva da empresa.');
  }

  /**
   * Buscar Documentos da Empresa
   * GET /functions/v1/companies/:id/docs
   */
  async getCompanyDocuments(companyId: string): Promise<CompanyDocuments> {
    const response = await edgeFunctionsProxy.invoke<any>(`companies/${companyId}/docs`, 'GET');
    if (response.success && response.data.docs) return response.data.docs;
    throw new Error(response.error || 'Erro ao buscar documentos da empresa.');
  }

  /**
   * Atualizar Documentos da Empresa
   * PATCH /functions/v1/companies/:id/docs
   */
  async updateCompanyDocuments(companyId: string, documents: Partial<CompanyDocuments>): Promise<CompanyDocuments> {
    const response = await edgeFunctionsProxy.invoke<CompanyDocuments>(`companies/${companyId}/docs`, 'PATCH', documents);
    if (response.success && response.data) return response.data;
    throw new Error(response.error || 'Erro ao atualizar documentos da empresa.');
  }

  /**
   * Buscar Informações Financeiras da Empresa
   * GET /functions/v1/companies/:id/financial-info
   */
  async getCompanyFinancialInfo(companyId: string): Promise<CompanyFinancialInfo> {
    const response = await edgeFunctionsProxy.invoke<CompanyFinancialInfo>(`companies/${companyId}/financial-info`, 'GET');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Erro ao buscar informações financeiras da empresa.');
  }

  /**
   * GET /functions/v1/companies/:id/adq
   */
  async getCompanyAcquirers(companyId: string) {
    const response = await edgeFunctionsProxy.invoke<any>(`companies/${companyId}/adq`, 'GET');
    if (response.success && response.data) return response.data;
    throw new Error(response.error || 'Erro ao buscar adquirentes da empresa.');
  }

  /**
   * PATCH /functions/v1/companies/:id/adq
   */
  async updateCompanyAcquirers(companyId: string, acquirersData: any) {
    const response = await edgeFunctionsProxy.invoke<any>(`companies/${companyId}/adq`, 'PATCH', acquirersData);
    if (response.success && response.data) return response.data;
    throw new Error(response.error || 'Erro ao atualizar adquirentes da empresa.');
  }

  /**
   * Atualizar Taxas em Massa
   * PATCH /functions/v1/companies/:id/taxas-bulk
   */
  async updateTaxesBulk(taxes: Partial<CompanyTaxes>): Promise<{ updatedCount: number }> {
    // Usamos um ID placeholder como '0' ou 'bulk' que a API ignora
    const response = await edgeFunctionsProxy.invoke<{ updatedCount: number }>('companies/0/taxas-bulk', 'PATCH', taxes);
    if (response.success && response.data) return response.data;
    throw new Error(response.error || 'Erro ao atualizar taxas em massa.');
  }

  /**
   * Atualizar Configurações em Massa
   * PATCH /functions/v1/companies/:id/config-bulk
   */
  async updateConfigBulk(config: Partial<CompanyConfig>): Promise<{ updatedCount: number }> {
    const response = await edgeFunctionsProxy.invoke<{ updatedCount: number }>('companies/0/config-bulk', 'PATCH', config);
    if (response.success && response.data) return response.data;
    throw new Error(response.error || 'Erro ao atualizar configurações em massa.');
  }

  /**
   * Endpoint 65: Atualizar Reservas em Massa
   * PATCH /functions/v1/companies/:id/reserva-bulk
   */
  async updateReserveBulk(reserve: Partial<CompanyReserve>): Promise<{ updatedCount: number }> {
    const response = await edgeFunctionsProxy.invoke<{ updatedCount: number }>('companies/0/reserva-bulk', 'PATCH', reserve);
    if (response.success && response.data) return response.data;
    throw new Error(response.error || 'Erro ao atualizar reservas em massa.');
  }

  /**
   * Aprovar empresa
   */
  async approveCompany(companyId: string): Promise<Company> {
    return await this.updateCompanyStatus(companyId, 'approved');
  }

  /**
   * Rejeitar empresa
   */
  async rejectCompany(companyId: string, reason: string): Promise<Company> {
    return await this.updateCompanyStatus(companyId, 'rejected', reason);
  }

  /**
   * Bloquear empresa
   */
  async blockCompany(companyId: string, reason: string): Promise<Company> {
    return await this.updateCompanyStatus(companyId, 'blocked', reason);
  }

  /**
   * Buscar empresas por status
   */
  async getCompaniesByStatus(status: string): Promise<Company[]> {
    const result = await this.getAllCompanies({ status });
    return result.companies;
  }

  /**
   * Buscar empresas pendentes
   */
  async getPendingCompanies(): Promise<Company[]> {
    return await this.getCompaniesByStatus('pending');
  }

  /**
   * Buscar empresas aprovadas
   */
  async getApprovedCompanies(): Promise<Company[]> {
    return await this.getCompaniesByStatus('approved');
  }
}

export const companyService = new CompanyService();
