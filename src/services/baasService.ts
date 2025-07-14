import { ApiResponse } from '../types';
import {
    Baas,
    BaasFee,
    UpdateBaasFeePayload
} from '../types/baas';
import { supabase } from './supabase';

/**
 * Fetches all BaaS providers.
 */
const getAllBaas = async (): Promise<ApiResponse<Baas[]>> => {
  try {
    const { data, error } = await supabase.functions.invoke('baas', {
      method: 'GET'
    });
    
    if (error) {
      return { 
        success: false, 
        data: undefined, 
        error: { message: error.message || 'Failed to fetch BaaS providers' } 
      };
    }
    
    return { 
      success: true, 
      data, 
      error: undefined 
    };
  } catch (error) {
    console.error('Error fetching all BaaS:', error);
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
 * Fetches a specific BaaS provider by ID.
 */
const getBaasById = async (baasId: string): Promise<ApiResponse<Baas>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`baas/${baasId}`, {
      method: 'GET'
    });
    
    if (error) {
      return { 
        success: false, 
        data: undefined, 
        error: { message: error.message || `Failed to fetch BaaS with ID ${baasId}` } 
      };
    }
    
    return { 
      success: true, 
      data, 
      error: undefined 
    };
  } catch (error) {
    console.error(`Error fetching BaaS with ID ${baasId}:`, error);
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
 * Fetches the fees/taxes for a specific BaaS provider.
 */
const getBaasFees = async (baasId: string): Promise<ApiResponse<BaasFee[]>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`baas/${baasId}/taxas`, {
      method: 'GET'
    });
    
    if (error) {
      return { 
        success: false, 
        data: undefined, 
        error: { message: error.message || `Failed to fetch fees for BaaS with ID ${baasId}` } 
      };
    }
    
    return { 
      success: true, 
      data, 
      error: undefined 
    };
  } catch (error) {
    console.error(`Error fetching fees for BaaS with ID ${baasId}:`, error);
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
 * Activates or deactivates a BaaS provider.
 */
const toggleBaasActive = async (baasId: string): Promise<ApiResponse<Baas>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`baas/${baasId}/active`, {
      method: 'PATCH'
    });
    
    if (error) {
      return { 
        success: false, 
        data: undefined, 
        error: { message: error.message || `Failed to toggle active status for BaaS with ID ${baasId}` } 
      };
    }
    
    return { 
      success: true, 
      data, 
      error: undefined 
    };
  } catch (error) {
    console.error(`Error toggling active status for BaaS with ID ${baasId}:`, error);
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
 * Updates the fee for a BaaS provider.
 */
const updateBaasFee = async (baasId: string, payload: UpdateBaasFeePayload): Promise<ApiResponse<BaasFee>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`baas/${baasId}/taxa`, {
      method: 'PATCH',
      body: payload
    });
    
    if (error) {
      return { 
        success: false, 
        data: undefined, 
        error: { message: error.message || `Failed to update fee for BaaS with ID ${baasId}` } 
      };
    }
    
    return { 
      success: true, 
      data, 
      error: undefined 
    };
  } catch (error) {
    console.error(`Error updating fee for BaaS with ID ${baasId}:`, error);
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

export const baasService = {
  getAllBaas,
  getBaasById,
  getBaasFees,
  toggleBaasActive,
  updateBaasFee
}; 