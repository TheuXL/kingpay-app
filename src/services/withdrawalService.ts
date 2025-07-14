import { ApiResponse, CreateWithdrawalPayload, UpdateWithdrawalStatusPayload, Withdrawal, WithdrawalAggregates, WithdrawalFilters } from '../types';
import { supabase } from './supabase';

/**
 * Obtém a lista de saques com filtros opcionais
 */
export const getWithdrawals = async (filters: WithdrawalFilters = {}): Promise<ApiResponse<Withdrawal[]>> => {
  try {
    // Construir a URL com parâmetros de consulta
    let endpoint = 'saques';
    const queryParams: string[] = [];
    
    if (filters.limit !== undefined) queryParams.push(`limit=${filters.limit}`);
    if (filters.offset !== undefined) queryParams.push(`offset=${filters.offset}`);
    if (filters.status) queryParams.push(`status=${filters.status}`);
    
    if (queryParams.length > 0) {
      endpoint += `?${queryParams.join('&')}`;
    }
    
    const { data, error } = await supabase.functions.invoke(endpoint, {
      method: 'GET',
    });

    if (error) {
      console.error('Erro ao buscar saques:', error);
      return {
        success: false,
        error: {
          message: error.message || 'Erro ao buscar saques',
        },
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erro ao buscar saques:', error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Erro desconhecido ao buscar saques',
      },
    };
  }
};

/**
 * Cria um novo pedido de saque
 */
export const createWithdrawal = async (payload: CreateWithdrawalPayload): Promise<ApiResponse<Withdrawal>> => {
  try {
    const { data, error } = await supabase.functions.invoke('withdrawals', {
      method: 'POST',
      body: payload,
    });

    if (error) {
      console.error('Erro ao criar saque:', error);
      return {
        success: false,
        error: {
          message: error.message || 'Erro ao criar saque',
        },
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erro ao criar saque:', error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Erro desconhecido ao criar saque',
      },
    };
  }
};

/**
 * Marca um saque como pago manualmente (apenas para administradores)
 */
export const markWithdrawalAsPaidManually = async (withdrawalId: string): Promise<ApiResponse<Withdrawal>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawalId}`, {
      method: 'PATCH',
      body: { status: 'done_manual' },
    });

    if (error) {
      console.error('Erro ao marcar saque como pago manualmente:', error);
      return {
        success: false,
        error: {
          message: error.message || 'Erro ao marcar saque como pago manualmente',
        },
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erro ao marcar saque como pago manualmente:', error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Erro desconhecido ao marcar saque como pago manualmente',
      },
    };
  }
};

/**
 * Nega um pedido de saque
 */
export const denyWithdrawal = async (withdrawalId: string, reasonForDenial: string): Promise<ApiResponse<Withdrawal>> => {
  try {
    const payload: UpdateWithdrawalStatusPayload = {
      status: 'cancel',
      reason_for_denial: reasonForDenial,
    };

    const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawalId}`, {
      method: 'PATCH',
      body: payload,
    });

    if (error) {
      console.error('Erro ao negar saque:', error);
      return {
        success: false,
        error: {
          message: error.message || 'Erro ao negar saque',
        },
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erro ao negar saque:', error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Erro desconhecido ao negar saque',
      },
    };
  }
};

/**
 * Aprova um pedido de saque
 */
export const approveWithdrawal = async (withdrawalId: string): Promise<ApiResponse<Withdrawal>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`withdrawals/${withdrawalId}`, {
      method: 'PATCH',
      body: { status: 'approved' },
    });

    if (error) {
      console.error('Erro ao aprovar saque:', error);
      return {
        success: false,
        error: {
          message: error.message || 'Erro ao aprovar saque',
        },
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erro ao aprovar saque:', error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Erro desconhecido ao aprovar saque',
      },
    };
  }
};

/**
 * Obtém dados agregados de saques
 */
export const getWithdrawalAggregates = async (startDate: string, endDate: string): Promise<ApiResponse<WithdrawalAggregates>> => {
  try {
    // Construir a URL com parâmetros de consulta
    let endpoint = `saques/aggregates?createdatstart=${encodeURIComponent(startDate)}&createdatend=${encodeURIComponent(endDate)}`;
    
    const { data, error } = await supabase.functions.invoke(endpoint, {
      method: 'GET',
    });

    if (error) {
      console.error('Erro ao buscar dados agregados de saques:', error);
      return {
        success: false,
        error: {
          message: error.message || 'Erro ao buscar dados agregados de saques',
        },
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erro ao buscar dados agregados de saques:', error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Erro desconhecido ao buscar dados agregados de saques',
      },
    };
  }
}; 