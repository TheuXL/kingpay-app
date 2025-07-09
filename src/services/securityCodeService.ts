import { supabase } from './supabase';

interface SecurityCodeResponse {
  success: boolean;
  code?: string;
  expires_at?: string;
  message?: string;
  error?: any;
}

/**
 * Service for handling security code operations
 */
export const securityCodeService = {
  /**
   * Generate a new security code
   * Endpoint: POST https://{{base_url}}/functions/v1/validation-codes/generate
   */
  generateCode: async (): Promise<SecurityCodeResponse> => {
    try {
      const { data, error } = await supabase.functions.invoke(
        'validation-codes/generate',
        {
          method: 'POST',
        }
      );

      if (error) {
        return { success: false, error };
      }

      return data as SecurityCodeResponse;
    } catch (error) {
      return { success: false, error };
    }
  },

  /**
   * Validate a security code
   * Endpoint: POST https://{{base_url}}/functions/v1/validation-codes/validate
   */
  validateCode: async (code: string): Promise<SecurityCodeResponse> => {
    try {
      const { data, error } = await supabase.functions.invoke(
        'validation-codes/validate',
        {
          method: 'POST',
          body: { code },
        }
      );

      if (error) {
        return { success: false, error };
      }

      return data as SecurityCodeResponse;
    } catch (error) {
      return { success: false, error };
    }
  },
}; 