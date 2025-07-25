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
    try {
      console.log('🏢 Listando todas as empresas...');

      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const { data, error } = await supabase.functions.invoke(`companies?${params.toString()}`, {
        method: 'GET',
      });

      if (error) {
        console.error('❌ Erro ao listar empresas:', error.message);
        throw error;
      }

      return {
        companies: data.companies || [],
        total: data.total || 0
      };

    } catch (error) {
      console.error('❌ Erro inesperado ao listar empresas:', error);
      throw error;
    }
  }

  /**
   * Endpoint 57: Obter Contagem de Empresas
   * GET /functions/v1/companies/contagem
   */
  async getCompaniesCount(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    blocked: number;
  }> {
    try {
      console.log('📊 Obtendo contagem de empresas...');

      const { data, error } = await supabase.functions.invoke('companies/contagem', {
        method: 'GET',
      });

      if (error) {
        console.error('❌ Erro ao obter contagem:', error.message);
        throw error;
      }

      return data;

    } catch (error) {
      console.error('❌ Erro inesperado ao obter contagem:', error);
      throw error;
    }
  }

  /**
   * Endpoint 58: Buscar Detalhes de uma Empresa
   * GET /functions/v1/companies/:id
   */
  async getCompanyById(companyId: string): Promise<Company> {
    const response = await edgeFunctionsProxy.get<any>(`companies/${companyId}`);
    if (response.success && response.data.company) return response.data.company;
    throw new Error(response.error || 'Erro ao buscar empresa.');
  }

  /**
   * Endpoint 62: Criar Nova Empresa
   * POST /functions/v1/companies
   */
  async createCompany(companyData: CreateCompanyRequest): Promise<Company> {
    try {
      console.log('➕ Criando nova empresa:', companyData.name);

      const { data, error } = await supabase.functions.invoke('companies', {
        method: 'POST',
        body: companyData,
      });

      if (error) {
        console.error('❌ Erro ao criar empresa:', error.message);
        throw error;
      }

      console.log('✅ Empresa criada:', data.id);
      return data;

    } catch (error) {
      console.error('❌ Erro inesperado ao criar empresa:', error);
      throw error;
    }
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
    try {
      console.log('🔄 Atualizando status da empresa:', companyId, '→', status);

      const { data, error } = await supabase.functions.invoke(`companies/${companyId}/status`, {
        method: 'PATCH',
        body: { status, reason },
      });

      if (error) {
        console.error('❌ Erro ao atualizar status:', error.message);
        throw error;
      }

      console.log('✅ Status atualizado');
      return data;

    } catch (error) {
      console.error('❌ Erro inesperado ao atualizar status:', error);
      throw error;
    }
  }

  /**
   * Buscar Taxas da Empresa
   * GET /functions/v1/companies/:id/taxas
   */
  async getCompanyTaxes(companyId: string): Promise<CompanyTaxes> {
    const response = await edgeFunctionsProxy.get<CompanyTaxes>(`companies/${companyId}/taxas`);
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
    try {
      console.log('💰 Atualizando taxas da empresa:', companyId);

      const { data, error } = await supabase.functions.invoke(`companies/${companyId}/taxas`, {
        method: 'PATCH',
        body: taxes,
      });

      if (error) {
        console.error('❌ Erro ao atualizar taxas:', error.message);
        throw error;
      }

      console.log('✅ Taxas atualizadas');
      return data;

    } catch (error) {
      console.error('❌ Erro inesperado ao atualizar taxas:', error);
      throw error;
    }
  }

  /**
   * Buscar Configurações da Empresa
   * GET /functions/v1/companies/:id/config
   */
  async getCompanyConfig(companyId: string): Promise<CompanyConfig> {
    const response = await edgeFunctionsProxy.get<any>(`companies/${companyId}/config`);
    if (response.success && response.data.config) return response.data.config;
    throw new Error(response.error || 'Erro ao buscar config da empresa.');
  }

  /**
   * Atualizar Configurações da Empresa
   * PATCH /functions/v1/companies/:id/config
   */
  async updateCompanyConfig(companyId: string, config: Partial<CompanyConfig>): Promise<CompanyConfig> {
    try {
      console.log('⚙️ Atualizando configurações da empresa:', companyId);

      const { data, error } = await supabase.functions.invoke(`companies/${companyId}/config`, {
        method: 'PATCH',
        body: config,
      });

      if (error) {
        console.error('❌ Erro ao atualizar configurações:', error.message);
        throw error;
      }

      console.log('✅ Configurações atualizadas');
      return data;

    } catch (error) {
      console.error('❌ Erro inesperado ao atualizar configurações:', error);
      throw error;
    }
  }

  /**
   * Buscar Reserva Financeira da Empresa
   * GET /functions/v1/companies/:id/reserva
   */
  async getCompanyReserve(companyId: string): Promise<CompanyReserve> {
    const response = await edgeFunctionsProxy.get<any>(`companies/${companyId}/reserva`);
    if (response.success && response.data.reserva) return response.data.reserva;
    throw new Error(response.error || 'Erro ao buscar reserva da empresa.');
  }

  /**
   * Atualizar Reserva Financeira da Empresa
   * PATCH /functions/v1/companies/:id/reserva
   */
  async updateCompanyReserve(companyId: string, reserve: Partial<CompanyReserve>): Promise<CompanyReserve> {
    try {
      console.log('🏦 Atualizando reserva da empresa:', companyId);

      const { data, error } = await supabase.functions.invoke(`companies/${companyId}/reserva`, {
        method: 'PATCH',
        body: reserve,
      });

      if (error) {
        console.error('❌ Erro ao atualizar reserva:', error.message);
        throw error;
      }

      console.log('✅ Reserva atualizada');
      return data;

    } catch (error) {
      console.error('❌ Erro inesperado ao atualizar reserva:', error);
      throw error;
    }
  }

  /**
   * Buscar Documentos da Empresa
   * GET /functions/v1/companies/:id/docs
   */
  async getCompanyDocuments(companyId: string): Promise<CompanyDocuments> {
    const response = await edgeFunctionsProxy.get<any>(`companies/${companyId}/docs`);
    if (response.success && response.data.docs) return response.data.docs;
    throw new Error(response.error || 'Erro ao buscar documentos da empresa.');
  }

  /**
   * Atualizar Documentos da Empresa
   * PATCH /functions/v1/companies/:id/docs
   */
  async updateCompanyDocuments(companyId: string, documents: Partial<CompanyDocuments>): Promise<CompanyDocuments> {
    try {
      console.log('📄 Atualizando documentos da empresa:', companyId);

      const { data, error } = await supabase.functions.invoke(`companies/${companyId}/docs`, {
        method: 'PATCH',
        body: documents,
      });

      if (error) {
        console.error('❌ Erro ao atualizar documentos:', error.message);
        throw error;
      }

      console.log('✅ Documentos atualizados');
      return data;

    } catch (error) {
      console.error('❌ Erro inesperado ao atualizar documentos:', error);
      throw error;
    }
  }

  /**
   * Buscar Informações Financeiras da Empresa
   * GET /functions/v1/companies/:id/financial-info
   */
  async getCompanyFinancialInfo(companyId: string): Promise<CompanyFinancialInfo> {
    try {
      console.log('💼 Buscando informações financeiras da empresa:', companyId);

      const { data, error } = await supabase.functions.invoke(`companies/${companyId}/financial-info`, {
        method: 'GET',
      });

      if (error) {
        console.error('❌ Erro ao buscar informações financeiras:', error.message);
        throw error;
      }

      return data;

    } catch (error) {
      console.error('❌ Erro inesperado ao buscar informações financeiras:', error);
      throw error;
    }
  }

  /**
   * GET /functions/v1/companies/:id/adq
   */
  async getCompanyAcquirers(companyId: string) {
    try {
      const { data, error } = await supabase.functions.invoke(`companies/${companyId}/adq`, {
        method: 'GET',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar adquirentes da empresa:', error);
      throw error;
    }
  }

  /**
   * PATCH /functions/v1/companies/:id/adq
   */
  async updateCompanyAcquirers(companyId: string, acquirersData: any) {
    try {
      const { data, error } = await supabase.functions.invoke(`companies/${companyId}/adq`, {
        method: 'PATCH',
        body: acquirersData,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar adquirentes da empresa:', error);
      throw error;
    }
  }

  /**
   * Atualizar Taxas em Massa
   * PATCH /functions/v1/companies/:id/taxas-bulk
   */
  async updateTaxesBulk(taxes: Partial<CompanyTaxes>): Promise<{ updatedCount: number }> {
    try {
      console.log('💰 Atualizando taxas em massa...');

      const { data, error } = await supabase.functions.invoke('companies/0/taxas-bulk', {
        method: 'PATCH',
        body: taxes,
      });

      if (error) {
        console.error('❌ Erro ao atualizar taxas em massa:', error.message);
        throw error;
      }

      console.log('✅ Taxas atualizadas em massa');
      return data;

    } catch (error) {
      console.error('❌ Erro inesperado ao atualizar taxas em massa:', error);
      throw error;
    }
  }

  /**
   * Atualizar Configurações em Massa
   * PATCH /functions/v1/companies/:id/config-bulk
   */
  async updateConfigBulk(config: Partial<CompanyConfig>): Promise<{ updatedCount: number }> {
    try {
      console.log('⚙️ Atualizando configurações em massa...');

      const { data, error } = await supabase.functions.invoke('companies/0/config-bulk', {
        method: 'PATCH',
        body: config,
      });

      if (error) {
        console.error('❌ Erro ao atualizar configurações em massa:', error.message);
        throw error;
      }

      console.log('✅ Configurações atualizadas em massa');
      return data;

    } catch (error) {
      console.error('❌ Erro inesperado ao atualizar configurações em massa:', error);
      throw error;
    }
  }

  /**
   * Endpoint 65: Atualizar Reservas em Massa
   * PATCH /functions/v1/companies/:id/reserva-bulk
   */
  async updateReserveBulk(reserve: Partial<CompanyReserve>): Promise<{ updatedCount: number }> {
    try {
      console.log('🏦 Atualizando reservas em massa...');

      const { data, error } = await supabase.functions.invoke('companies/0/reserva-bulk', {
        method: 'PATCH',
        body: reserve,
      });

      if (error) {
        console.error('❌ Erro ao atualizar reservas em massa:', error.message);
        throw error;
      }

      console.log('✅ Reservas atualizadas em massa');
      return data;

    } catch (error) {
      console.error('❌ Erro inesperado ao atualizar reservas em massa:', error);
      throw error;
    }
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
