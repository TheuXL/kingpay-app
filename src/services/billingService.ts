import { ApiResponse } from '../types';
import { Billing, PayBillingPayload } from '../types/billing';
import { supabase } from './supabase';

/**
 * Fetches all billings for the current user or company.
 */
const getAllBillings = async (): Promise<ApiResponse<Billing[]>> => {
  try {
    const { data, error } = await supabase.functions.invoke('billings', {
      method: 'GET'
    });
    
    if (error) {
      return { 
        success: false, 
        data: undefined, 
        error: { message: error.message || 'Failed to fetch billings' } 
      };
    }
    
    return { 
      success: true, 
      data, 
      error: undefined 
    };
  } catch (error) {
    console.error('Error fetching billings:', error);
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
 * Pays a billing by ID.
 */
const payBilling = async (payload: PayBillingPayload): Promise<ApiResponse<any>> => {
  try {
    const { data, error } = await supabase.functions.invoke('billings/pay', {
      method: 'POST',
      body: payload
    });
    
    if (error) {
      return { 
        success: false, 
        data: undefined, 
        error: { message: error.message || `Failed to pay billing with ID ${payload.billingId}` } 
      };
    }
    
    return { 
      success: true, 
      data, 
      error: undefined 
    };
  } catch (error) {
    console.error(`Error paying billing:`, error);
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

export const billingService = {
  getAllBillings,
  getBillings: getAllBillings, // Alias for backward compatibility
  payBilling
}; 