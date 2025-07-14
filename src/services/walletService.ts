import { ApiResponse } from '../types';
import {
    ManageBalancePayload,
    RemoveBalancePayload,
    SimulateAnticipationPayload,
} from '../types/wallet';
import { supabase } from './supabase';

/**
 * Simulates an anticipation of receivables.
 */
const simulateAnticipation = async (
  payload: SimulateAnticipationPayload
): Promise<ApiResponse<any>> => {
  try {
    const { data, error } = await supabase.functions.invoke('antecipacoes/create', {
      method: 'POST',
      body: payload,
    });
    
    if (error) throw error;
    
    return { 
      success: true, 
      data, 
      error: undefined 
    };
  } catch (error) {
    console.error('Error simulating anticipation:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred.';
    
    return { 
      success: false, 
      data: undefined, 
      error: { message: errorMessage } 
    };
  }
};

/**
 * Removes a specific amount from a user's wallet balance.
 */
const removeBalance = async (payload: RemoveBalancePayload): Promise<ApiResponse<null>> => {
  try {
    const { error } = await supabase.functions.invoke('wallet/remove-balance', {
      method: 'POST',
      body: payload,
    });
    
    if (error) throw error;
    
    return { 
      success: true, 
      data: null, 
      error: undefined 
    };
  } catch (error) {
    console.error('Error removing balance:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred.';
    
    return { 
      success: false, 
      data: null, 
      error: { message: errorMessage } 
    };
  }
};

/**
 * Manages a user's balance by adding or subtracting an amount.
 */
const manageBalance = async (payload: ManageBalancePayload): Promise<ApiResponse<null>> => {
  try {
    const { error } = await supabase.functions.invoke('wallet/balance-management', {
      method: 'POST',
      body: payload,
    });
    
    if (error) throw error;
    
    return { 
      success: true, 
      data: null, 
      error: undefined 
    };
  } catch (error) {
    console.error('Error managing balance:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred.';
    
    return { 
      success: false, 
      data: null, 
      error: { message: errorMessage } 
    };
  }
};

/**
 * Fetches the user's wallet information, including receivables.
 */
const getWallet = async (userId: string): Promise<ApiResponse<any>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`wallet?userId=${userId}`, {
      method: 'GET',
    });
    
    if (error) throw error;
    
    return { 
      success: true, 
      data, 
      error: undefined 
    };
  } catch (error) {
    console.error('Error fetching wallet:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred.';
    
    return { 
      success: false, 
      data: undefined, 
      error: { message: errorMessage } 
    };
  }
};

/**
 * Fetches the user's account statement with pagination.
 */
const getStatement = async (
  userId: string,
  limit: number = 10,
  offset: number = 0
): Promise<ApiResponse<any>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`extrato/${userId}?limit=${limit}&offset=${offset}`, {
      method: 'GET',
    });
    
    if (error) throw error;
    
    return { 
      success: true, 
      data, 
      error: undefined 
    };
  } catch (error) {
    console.error('Error fetching statement:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred.';
    
    return { 
      success: false, 
      data: undefined, 
      error: { message: errorMessage } 
    };
  }
};

/**
 * Fetches the user's receivables.
 * Note: The user provided the same endpoint as getWallet. We assume it's correct.
 */
const getReceivables = async (userId: string): Promise<ApiResponse<any>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`wallet?userId=${userId}`, {
        method: 'GET',
    });
    
    if (error) throw error;
    
    return { 
      success: true, 
      data, 
      error: undefined 
    };
  } catch (error) {
    console.error('Error fetching receivables:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred.';
    
    return { 
      success: false, 
      data: undefined, 
      error: { message: errorMessage } 
    };
  }
};

export const walletService = {
  simulateAnticipation,
  removeBalance,
  manageBalance,
  getWallet,
  getStatement,
  getReceivables,
}; 