import { supabase } from './supabase';

export interface WithdrawalFilters {
  status?: 'pending' | 'approved' | 'rejected' | 'paid';
  companyId?: string;
  startDate?: string;
  endDate?: string;
}

export interface AnticipationFilters {
  status?: 'pending' | 'approved' | 'rejected' | 'paid';
  companyId?: string;
  startDate?: string;
  endDate?: string;
}

export const financialService = {
  getWithdrawals: async (filters: WithdrawalFilters = {}) => {
    let query = supabase.from('withdrawals').select(`
      *,
      companies (
        id,
        name,
        cnpj
      )
    `);
    
    // Aplicar filtros
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.companyId) {
      query = query.eq('company_id', filters.companyId);
    }
    
    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    
    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar saques:', error);
      throw error;
    }

    return data;
  },

  getAnticipations: async (filters: AnticipationFilters = {}) => {
    let query = supabase.from('anticipations').select(`
      *,
      companies (
        id,
        name,
        cnpj
      )
    `);
    
    // Aplicar filtros
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.companyId) {
      query = query.eq('company_id', filters.companyId);
    }
    
    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    
    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar antecipações:', error);
      throw error;
    }

    return data;
  },

  getWithdrawalById: async (id: string) => {
    const { data, error } = await supabase
      .from('withdrawals')
      .select(
        `
        *,
        companies (
          id,
          name,
          cnpj
        )
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar saque por ID:', error);
      throw error;
    }

    return data;
  },

  getAnticipationById: async (id: string) => {
    const { data, error } = await supabase
      .from('anticipations')
      .select(
        `
        *,
        companies (
          id,
          name,
          cnpj
        )
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar antecipação por ID:', error);
      throw error;
    }

    return data;
  },
  
  approveWithdrawal: async (id: string, approvalData: { userId: string, notes?: string }) => {
    const { data, error } = await supabase
      .from('withdrawals')
      .update({ 
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: approvalData.userId,
        approval_notes: approvalData.notes || null
      })
      .eq('id', id);
      
    if (error) {
      console.error('Erro ao aprovar saque:', error);
      throw error;
    }
    
    return data;
  },
  
  rejectWithdrawal: async (id: string, rejectionData: { userId: string, reason: string }) => {
    const { data, error } = await supabase
      .from('withdrawals')
      .update({ 
        status: 'rejected',
        rejected_at: new Date().toISOString(),
        rejected_by: rejectionData.userId,
        rejection_reason: rejectionData.reason
      })
      .eq('id', id);
      
    if (error) {
      console.error('Erro ao rejeitar saque:', error);
      throw error;
    }
    
    return data;
  },
  
  markWithdrawalAsPaid: async (id: string, paymentData: { userId: string, paymentDetails?: any }) => {
    const { data, error } = await supabase
      .from('withdrawals')
      .update({ 
        status: 'paid',
        paid_at: new Date().toISOString(),
        paid_by: paymentData.userId,
        payment_details: paymentData.paymentDetails || null
      })
      .eq('id', id);
      
    if (error) {
      console.error('Erro ao marcar saque como pago:', error);
      throw error;
    }
    
    return data;
  },
  
  approveAnticipation: async (id: string, approvalData: { userId: string, notes?: string }) => {
    const { data, error } = await supabase
      .from('anticipations')
      .update({ 
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: approvalData.userId,
        approval_notes: approvalData.notes || null
      })
      .eq('id', id);
      
    if (error) {
      console.error('Erro ao aprovar antecipação:', error);
      throw error;
    }
    
    return data;
  },
  
  rejectAnticipation: async (id: string, rejectionData: { userId: string, reason: string }) => {
    const { data, error } = await supabase
      .from('anticipations')
      .update({ 
        status: 'rejected',
        rejected_at: new Date().toISOString(),
        rejected_by: rejectionData.userId,
        rejection_reason: rejectionData.reason
      })
      .eq('id', id);
      
    if (error) {
      console.error('Erro ao rejeitar antecipação:', error);
      throw error;
    }
    
    return data;
  },
  
  markAnticipationAsPaid: async (id: string, paymentData: { userId: string, paymentDetails?: any }) => {
    const { data, error } = await supabase
      .from('anticipations')
      .update({ 
        status: 'paid',
        paid_at: new Date().toISOString(),
        paid_by: paymentData.userId,
        payment_details: paymentData.paymentDetails || null
      })
      .eq('id', id);
      
    if (error) {
      console.error('Erro ao marcar antecipação como paga:', error);
      throw error;
    }
    
    return data;
  },
  
  getFinancialStats: async () => {
    // Estatísticas de saques
    const { count: pendingWithdrawalsCount, error: pendingWithdrawalsError } = await supabase
      .from('withdrawals')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (pendingWithdrawalsError) {
      console.error('Erro ao buscar estatísticas de saques pendentes:', pendingWithdrawalsError);
      throw pendingWithdrawalsError;
    }
    
    // Estatísticas de antecipações
    const { count: pendingAnticipationsCount, error: pendingAnticipationsError } = await supabase
      .from('anticipations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (pendingAnticipationsError) {
      console.error('Erro ao buscar estatísticas de antecipações pendentes:', pendingAnticipationsError);
      throw pendingAnticipationsError;
    }
    
    // Soma dos valores de saques pendentes
    const { data: pendingWithdrawalsSum, error: pendingWithdrawalsSumError } = await supabase
      .from('withdrawals')
      .select('amount')
      .eq('status', 'pending');
      
    if (pendingWithdrawalsSumError) {
      console.error('Erro ao buscar soma de saques pendentes:', pendingWithdrawalsSumError);
      throw pendingWithdrawalsSumError;
    }
    
    const totalPendingWithdrawals = pendingWithdrawalsSum.reduce((sum, item) => sum + item.amount, 0);
    
    // Soma dos valores de antecipações pendentes
    const { data: pendingAnticipationsSum, error: pendingAnticipationsSumError } = await supabase
      .from('anticipations')
      .select('amount')
      .eq('status', 'pending');
      
    if (pendingAnticipationsSumError) {
      console.error('Erro ao buscar soma de antecipações pendentes:', pendingAnticipationsSumError);
      throw pendingAnticipationsSumError;
    }
    
    const totalPendingAnticipations = pendingAnticipationsSum.reduce((sum, item) => sum + item.amount, 0);

    return {
      pendingWithdrawalsCount,
      pendingAnticipationsCount,
      totalPendingCount: (pendingWithdrawalsCount || 0) + (pendingAnticipationsCount || 0),
      totalPendingWithdrawals,
      totalPendingAnticipations,
      totalPendingAmount: totalPendingWithdrawals + totalPendingAnticipations
    };
  }
}; 