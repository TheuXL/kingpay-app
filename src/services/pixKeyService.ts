import { ApiResponse } from '../types';
import { PixKey } from '../types/pixKey';
import { supabase } from './supabase';

/**
 * Get all PIX keys for the current user
 */
export const getPixKeys = async (): Promise<ApiResponse<PixKey[]>> => {
  try {
    const { data, error } = await supabase.functions.invoke('pix-keys', {
      method: 'GET'
    });
    
    if (error) {
      return { 
        success: false, 
        data: undefined, 
        error: { message: error.message || 'Failed to fetch PIX keys' } 
      };
    }
    
    return { 
      success: true, 
      data, 
      error: undefined 
    };
  } catch (error) {
    console.error('Error fetching PIX keys:', error);
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
 * Approve a PIX key
 */
export const approvePixKey = async (keyId: string): Promise<ApiResponse<PixKey>> => {
  try {
    const { data, error } = await supabase.functions.invoke('pix-keys/approve', {
      method: 'POST',
      body: { key_id: keyId }
    });
    
    if (error) {
      return { 
        success: false, 
        data: undefined, 
        error: { message: error.message || `Failed to approve PIX key ${keyId}` } 
      };
    }
    
    return { 
      success: true, 
      data, 
      error: undefined 
    };
  } catch (error) {
    console.error(`Error approving PIX key:`, error);
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