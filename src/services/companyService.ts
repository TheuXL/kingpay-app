import { supabase } from './supabase';

export interface CompanyFilters {
  status?: 'pending' | 'approved' | 'rejected';
  search?: string;
}

export const companyService = {
  getCompanies: async (filters: CompanyFilters = {}) => {
    let query = supabase.from('companies').select('*');
    
    // Aplicar filtros se fornecidos
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,cnpj.ilike.%${filters.search}%`);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar empresas:', error);
      throw error;
    }
    
    return data;
  },
  
  getCompanyById: async (id: string) => {
    const { data, error } = await supabase
      .from('companies')
      .select('*, documents(*)')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Erro ao buscar empresa por ID:', error);
      throw error;
    }
    
    return data;
  },
  
  approveCompany: async (id: string, approvalData: { userId: string, notes?: string }) => {
    const { data, error } = await supabase
      .from('companies')
      .update({ 
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: approvalData.userId,
        approval_notes: approvalData.notes || null
      })
      .eq('id', id);
      
    if (error) {
      console.error('Erro ao aprovar empresa:', error);
      throw error;
    }
    
    return data;
  },
  
  rejectCompany: async (id: string, rejectionData: { userId: string, reason: string }) => {
    const { data, error } = await supabase
      .from('companies')
      .update({ 
        status: 'rejected',
        rejected_at: new Date().toISOString(),
        rejected_by: rejectionData.userId,
        rejection_reason: rejectionData.reason
      })
      .eq('id', id);
      
    if (error) {
      console.error('Erro ao rejeitar empresa:', error);
      throw error;
    }
    
    return data;
  },

  getCompanyStats: async () => {
    const { count: pendingCount, error: pendingError } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (pendingError) {
      console.error('Erro ao buscar estatísticas de empresas pendentes:', pendingError);
      throw pendingError;
    }

    const { count: approvedCount, error: approvedError } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    if (approvedError) {
      console.error('Erro ao buscar estatísticas de empresas aprovadas:', approvedError);
      throw approvedError;
    }

    const { count: rejectedCount, error: rejectedError } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected');

    if (rejectedError) {
      console.error('Erro ao buscar estatísticas de empresas rejeitadas:', rejectedError);
      throw rejectedError;
    }

    return { 
      pendingCount, 
      approvedCount,
      rejectedCount,
      totalCount: (pendingCount || 0) + (approvedCount || 0) + (rejectedCount || 0)
    };
  }
}; 