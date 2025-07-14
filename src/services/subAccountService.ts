import { supabase } from './supabase';

/**
 * Interface para uma subconta
 */
export interface SubAccount {
  id: string;
  company_id: string;
  name: string;
  bank_code?: string;
  bank_agency?: string;
  bank_account?: string;
  account_type?: 'checking' | 'savings';
  token?: string;
  acquirer_name?: string;
  status?: 'pending' | 'active' | 'rejected' | 'suspended';
  kyc_status?: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  company?: {
    id: string;
    name: string;
  };
}

/**
 * Interface para opções de paginação
 */
export interface PaginationOptions {
  limit?: number;
  offset?: number;
  search?: string;
  status?: string;
}

/**
 * Interface para documentos KYC
 */
export interface KycDocuments {
  balance_sheet: string;
  [key: string]: string; // Para documentos adicionais
}

/**
 * Serviço para gerenciar subcontas
 */
export const subAccountService = {
  /**
   * Listar todas as subcontas (Endpoint 38)
   * @param options Opções de paginação e filtro
   * @returns Lista de subcontas
   */
  listSubAccounts: async (options: PaginationOptions = {}) => {
    try {
      const {
        limit = 10,
        offset = 0,
        search = '',
        status = ''
      } = options;

      // Chamar a função Edge para listar subcontas
      const { data, error } = await supabase.functions.invoke('subconta', {
        body: {
          limit,
          offset,
          search,
          status
        }
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  },

  /**
   * Reenviar documentos para uma subconta (Endpoint 39)
   * @param subAccountId ID da subconta
   * @param documents Documentos a serem enviados
   * @returns Resultado da operação
   */
  resendDocuments: async (subAccountId: string, documents: KycDocuments) => {
    try {
      if (!subAccountId) {
        return { success: false, error: { message: 'ID da subconta é obrigatório' } };
      }

      if (!documents || !documents.balance_sheet) {
        return { success: false, error: { message: 'Documentos são obrigatórios' } };
      }

      // Chamar a função Edge para reenviar documentos
      const { data, error } = await supabase.functions.invoke('subconta/resend_documents', {
        method: 'PUT',
        body: {
          subconta_id: subAccountId,
          ...documents
        }
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  },

  /**
   * Verificar status de uma subconta no provedor de pagamentos (Endpoint 40)
   * @param subAccountId ID da subconta
   * @param token Token da subconta
   * @returns Status da subconta
   */
  checkStatus: async (subAccountId: string, token: string) => {
    try {
      if (!subAccountId) {
        return { success: false, error: { message: 'ID da subconta é obrigatório' } };
      }

      if (!token) {
        return { success: false, error: { message: 'Token da subconta é obrigatório' } };
      }

      // Chamar a função Edge para verificar status
      const { data, error } = await supabase.functions.invoke('subconta/checkstatus', {
        method: 'POST',
        body: {
          subconta_id: subAccountId,
          token
        }
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  },

  /**
   * Verificar status KYC de uma subconta (Endpoint 41)
   * @param token Token da subconta
   * @returns Status KYC da subconta
   */
  checkKyc: async (token: string) => {
    try {
      if (!token) {
        return { success: false, error: { message: 'Token da subconta é obrigatório' } };
      }

      // Chamar a função Edge para verificar status KYC
      const { data, error } = await supabase.functions.invoke('subconta/check_kyc', {
        method: 'POST',
        body: {
          token
        }
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  },

  /**
   * Criar subconta e enviar documentação KYC (Endpoint 42)
   * @param subAccountData Dados da subconta
   * @returns Subconta criada
   */
  createSubAccountWithKyc: async (subAccountData: {
    companyId: string;
    subconta_nome: string;
    banco: string;
    agencia: string;
    conta: string;
    tipo_conta: 'checking' | 'savings';
    balance_sheet: string;
    adquirente_nome: string;
    [key: string]: any; // Para campos adicionais
  }) => {
    try {
      if (!subAccountData.companyId) {
        return { success: false, error: { message: 'ID da empresa é obrigatório' } };
      }

      if (!subAccountData.subconta_nome) {
        return { success: false, error: { message: 'Nome da subconta é obrigatório' } };
      }

      if (!subAccountData.balance_sheet) {
        return { success: false, error: { message: 'Balanço patrimonial é obrigatório' } };
      }

      // Chamar a função Edge para criar subconta com KYC
      const { data, error } = await supabase.functions.invoke('subconta', {
        method: 'POST',
        body: subAccountData
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  },

  /**
   * Simular listagem de subcontas (para testes ou quando a função Edge não está disponível)
   * @param options Opções de paginação e filtro
   * @returns Lista simulada de subcontas
   */
  simulateListSubAccounts: (options: PaginationOptions = {}) => {
    const {
      limit = 10,
      offset = 0,
      search = '',
      status = ''
    } = options;

    // Dados simulados de subcontas
    const mockSubAccounts: SubAccount[] = [
      {
        id: '1',
        company_id: 'company-1',
        name: 'Subconta 1',
        bank_code: '001',
        bank_agency: '1234',
        bank_account: '56789-0',
        account_type: 'checking',
        token: 'token-subconta-1',
        acquirer_name: 'Adquirente 1',
        status: 'active',
        kyc_status: 'approved',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        company: {
          id: 'company-1',
          name: 'Empresa 1'
        }
      },
      {
        id: '2',
        company_id: 'company-2',
        name: 'Subconta 2',
        bank_code: '237',
        bank_agency: '5678',
        bank_account: '12345-6',
        account_type: 'savings',
        token: 'token-subconta-2',
        acquirer_name: 'Adquirente 2',
        status: 'pending',
        kyc_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        company: {
          id: 'company-2',
          name: 'Empresa 2'
        }
      },
      {
        id: '3',
        company_id: 'company-3',
        name: 'Subconta 3',
        bank_code: '341',
        bank_agency: '9012',
        bank_account: '34567-8',
        account_type: 'checking',
        token: 'token-subconta-3',
        acquirer_name: 'Adquirente 1',
        status: 'rejected',
        kyc_status: 'rejected',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        company: {
          id: 'company-3',
          name: 'Empresa 3'
        }
      },
      {
        id: '4',
        company_id: 'company-1',
        name: 'Subconta 4',
        bank_code: '033',
        bank_agency: '3456',
        bank_account: '78901-2',
        account_type: 'checking',
        token: 'token-subconta-4',
        acquirer_name: 'Adquirente 3',
        status: 'suspended',
        kyc_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        company: {
          id: 'company-1',
          name: 'Empresa 1'
        }
      },
      {
        id: '5',
        company_id: 'company-2',
        name: 'Subconta 5',
        bank_code: '104',
        bank_agency: '7890',
        bank_account: '12345-6',
        account_type: 'savings',
        token: 'token-subconta-5',
        acquirer_name: 'Adquirente 2',
        status: 'active',
        kyc_status: 'approved',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        company: {
          id: 'company-2',
          name: 'Empresa 2'
        }
      }
    ];

    // Filtrar por status se necessário
    let filteredAccounts = mockSubAccounts;
    if (status) {
      filteredAccounts = mockSubAccounts.filter(account => account.status === status);
    }

    // Filtrar por termo de busca se fornecido
    if (search) {
      const searchLower = search.toLowerCase();
      filteredAccounts = filteredAccounts.filter(account => 
        account.name.toLowerCase().includes(searchLower) ||
        account.company?.name.toLowerCase().includes(searchLower) ||
        account.acquirer_name?.toLowerCase().includes(searchLower)
      );
    }

    // Calcular paginação
    const total = filteredAccounts.length;
    const paginatedAccounts = filteredAccounts.slice(offset, offset + limit);

    // Retornar resultado simulado
    return {
      items: paginatedAccounts,
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    };
  },

  /**
   * Simular reenvio de documentos (para testes ou quando a função Edge não está disponível)
   * @param subAccountId ID da subconta
   * @param documents Documentos a serem enviados
   * @returns Resultado simulado da operação
   */
  simulateResendDocuments: (subAccountId: string, documents: KycDocuments) => {
    if (!subAccountId) {
      throw new Error('ID da subconta é obrigatório');
    }

    if (!documents || !documents.balance_sheet) {
      throw new Error('Documentos são obrigatórios');
    }

    // Simular resultado da operação
    return {
      id: subAccountId,
      status: 'pending',
      kyc_status: 'pending',
      updated_at: new Date().toISOString(),
      message: 'Documentos reenviados com sucesso'
    };
  },

  /**
   * Simular verificação de status (para testes ou quando a função Edge não está disponível)
   * @param subAccountId ID da subconta
   * @param token Token da subconta
   * @returns Status simulado da subconta
   */
  simulateCheckStatus: (subAccountId: string, token: string) => {
    if (!subAccountId) {
      throw new Error('ID da subconta é obrigatório');
    }

    if (!token) {
      throw new Error('Token da subconta é obrigatório');
    }

    // Simular resultado da operação
    return {
      id: subAccountId,
      status: 'active',
      provider_status: 'active',
      updated_at: new Date().toISOString()
    };
  },

  /**
   * Simular verificação de status KYC (para testes ou quando a função Edge não está disponível)
   * @param token Token da subconta
   * @returns Status KYC simulado da subconta
   */
  simulateCheckKyc: (token: string) => {
    if (!token) {
      throw new Error('Token da subconta é obrigatório');
    }

    // Simular resultado da operação
    return {
      token,
      kyc_status: 'approved',
      provider_kyc_status: 'approved',
      updated_at: new Date().toISOString()
    };
  },

  /**
   * Simular criação de subconta com KYC (para testes ou quando a função Edge não está disponível)
   * @param subAccountData Dados da subconta
   * @returns Subconta simulada criada
   */
  simulateCreateSubAccountWithKyc: (subAccountData: any) => {
    if (!subAccountData.companyId) {
      throw new Error('ID da empresa é obrigatório');
    }

    if (!subAccountData.subconta_nome) {
      throw new Error('Nome da subconta é obrigatório');
    }

    if (!subAccountData.balance_sheet) {
      throw new Error('Balanço patrimonial é obrigatório');
    }

    // Simular resultado da operação
    return {
      id: Math.random().toString(36).substring(2, 11),
      company_id: subAccountData.companyId,
      name: subAccountData.subconta_nome,
      bank_code: subAccountData.banco,
      bank_agency: subAccountData.agencia,
      bank_account: subAccountData.conta,
      account_type: subAccountData.tipo_conta,
      token: `token-${Math.random().toString(36).substring(2, 11)}`,
      acquirer_name: subAccountData.adquirente_nome,
      status: 'pending',
      kyc_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      message: 'Subconta criada com sucesso e KYC iniciado'
    };
  }
}; 