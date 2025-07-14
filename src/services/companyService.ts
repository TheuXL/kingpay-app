import {
  Company,
  CompanyAcquirer,
  CompanyConfig,
  CompanyCount,
  CompanyDocument,
  CompanyFinancialInfo,
  CompanyReserve,
  CompanyTaxes,
  CreateCompanyPayload,
  UpdateCompanyPayload,
  UpdateCompanyStatusPayload,
  UpdateCompanyTaxesPayload,
} from '../types/company';
import { supabase } from './supabase';

// Define missing interfaces
export type CompanyStatus = 'approved' | 'pending' | 'rejected' | 'blocked';

export interface CalculateTaxesPayload {
  companyId: string;
  amount: number;
  paymentMethod: string;
  installments: number;
}

export interface CalculatedTaxes {
  valor_original: number;
  valor_taxa: number;
  valor_liquido: number;
  taxa_percentual: number;
  taxa_fixa: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

/**
 * Retorna uma lista de todas as empresas
 */
export const getAllCompanies = async (status?: CompanyStatus): Promise<ApiResponse<Company[]>> => {
  try {
    const { data, error } = await supabase.functions.invoke('companies', {
      method: 'GET',
      headers: status ? { status } : undefined,
    });

    if (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Erro ao buscar empresas',
      };
    }

    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};

/**
 * Get company count by status
 */
export const getCompanyCount = async (): Promise<ApiResponse<CompanyCount>> => {
  try {
    const { data, error } = await supabase.functions.invoke('companies/contagem', {
      method: 'GET',
    });

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch company count',
    };
  }
};

/**
 * Get company by ID
 */
export const getCompanyById = async (id: string): Promise<ApiResponse<Company>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`companies/${id}`, {
      method: 'GET',
    });

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch company',
    };
  }
};

/**
 * Get company taxes by company ID
 */
export const getCompanyTaxes = async (id: string): Promise<ApiResponse<CompanyTaxes>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`companies/${id}/taxas`, {
      method: 'GET',
    });

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch company taxes',
    };
  }
};

/**
 * Get company reserve by company ID
 */
export const getCompanyReserve = async (id: string): Promise<ApiResponse<CompanyReserve>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`companies/${id}/reserva`, {
      method: 'GET',
    });

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch company reserve',
    };
  }
};

/**
 * Get company configuration by company ID
 */
export const getCompanyConfig = async (id: string): Promise<ApiResponse<CompanyConfig>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`companies/${id}/config`, {
      method: 'GET',
    });

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch company config',
    };
  }
};

/**
 * Get company documents by company ID
 */
export const getCompanyDocs = async (id: string): Promise<ApiResponse<CompanyDocument[]>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`companies/${id}/docs`, {
      method: 'GET',
    });

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch company documents',
    };
  }
};

/**
 * Get company acquirers by company ID
 */
export const getCompanyAcquirers = async (id: string): Promise<ApiResponse<CompanyAcquirer[]>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`companies/${id}/adq`, {
      method: 'GET',
    });

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch company acquirers',
    };
  }
};

/**
 * Get company financial info by company ID
 */
export const getCompanyFinancialInfo = async (id: string): Promise<ApiResponse<CompanyFinancialInfo>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`companies/${id}/financial-info`, {
      method: 'GET',
    });

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch company financial info',
    };
  }
};

/**
 * Update company taxes
 */
export const updateCompanyTaxes = async (
  id: string,
  payload: UpdateCompanyTaxesPayload
): Promise<ApiResponse<CompanyTaxes>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`companies/${id}/taxas`, {
      method: 'PATCH',
      body: payload,
    });

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update company taxes',
    };
  }
};

/**
 * Update company info
 */
export const updateCompanyInfo = async (
  id: string,
  payload: UpdateCompanyPayload
): Promise<ApiResponse<Company>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`companies/${id}`, {
      method: 'PATCH',
      body: payload,
    });

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update company info',
    };
  }
};

/**
 * Update company config
 */
export const updateCompanyConfig = async (
  id: string,
  payload: UpdateCompanyPayload
): Promise<ApiResponse<CompanyConfig>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`companies/${id}/config`, {
      method: 'PATCH',
      body: payload,
    });

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update company config',
    };
  }
};

/**
 * Update company config in bulk
 */
export const updateCompanyConfigBulk = async (
  id: string,
  payload: UpdateCompanyPayload[]
): Promise<ApiResponse<CompanyConfig[]>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`companies/${id}/config-bulk`, {
      method: 'PATCH',
      body: payload,
    });

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update company config in bulk',
    };
  }
};

/**
 * Update company reserve
 */
export const updateCompanyReserve = async (
  id: string,
  payload: UpdateCompanyPayload
): Promise<ApiResponse<CompanyReserve>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`companies/${id}/reserva`, {
      method: 'PATCH',
      body: payload,
    });

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update company reserve',
    };
  }
};

/**
 * Update company acquirer
 */
export const updateCompanyAcquirer = async (
  id: string,
  payload: UpdateCompanyPayload
): Promise<ApiResponse<CompanyAcquirer>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`companies/${id}/adq`, {
      method: 'PATCH',
      body: payload,
    });

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update company acquirer',
    };
  }
};

/**
 * Update company status
 */
export const updateCompanyStatus = async (
  id: string,
  payload: UpdateCompanyStatusPayload
): Promise<ApiResponse<Company>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`companies/${id}/status`, {
      method: 'PATCH',
      body: payload,
    });

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update company status',
    };
  }
};

/**
 * Create new company
 */
export const createCompany = async (
  payload: CreateCompanyPayload
): Promise<ApiResponse<Company>> => {
  try {
    const { data, error } = await supabase.functions.invoke('companies', {
      method: 'POST',
      body: payload,
    });

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to create company',
    };
  }
};

/**
 * Calculate taxes
 */
export const calculateTaxes = async (
  payload: CalculateTaxesPayload
): Promise<ApiResponse<CalculatedTaxes>> => {
  try {
    const { data, error } = await supabase.functions.invoke('taxas', {
      method: 'POST',
      body: payload,
    });

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to calculate taxes',
    };
  }
};

/**
 * Accept terms
 */
export const acceptTerms = async (): Promise<ApiResponse<boolean>> => {
  try {
    const { data, error } = await supabase.functions.invoke('configuracoes/acecitar-termos', {
      method: 'PUT',
    });

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: true, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to accept terms',
    };
  }
}; 