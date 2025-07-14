import { supabase } from './supabase';

interface TransactionResponse {
  success: boolean;
  data?: any;
  error?: any;
}

interface PixPaymentData {
  customer: {
    name: string;
    email: string;
    tax_id: string; // CPF/CNPJ
    phone?: string;
  };
  product: {
    name: string;
    price: number;
    quantity: number;
  };
  shipping?: {
    address: string;
    city: string;
    state: string;
    postal_code: string;
  };
  payment: {
    method: 'pix';
    installments?: number;
  };
}

interface CardPaymentData {
  customer: {
    name: string;
    email: string;
    tax_id: string; // CPF/CNPJ
    phone?: string;
  };
  product: {
    name: string;
    price: number;
    quantity: number;
  };
  shipping?: {
    address: string;
    city: string;
    state: string;
    postal_code: string;
  };
  payment: {
    method: 'credit_card';
    card: {
      number: string;
      holder_name: string;
      expiry_month: string;
      expiry_year: string;
      cvv: string;
    } | {
      card_hash: string;
    };
    installments?: number;
  };
}

type TransactionPayload = PixPaymentData | CardPaymentData;

/**
 * Service for handling transaction operations
 */
export const transactionService = {
  /**
   * Generate a PIX payment in development environment
   * Endpoint: POST https://{{base_url}}/functions/v1/transactions
   */
  generatePixDev: async (paymentData: PixPaymentData): Promise<TransactionResponse> => {
    try {
      // Add environment type to the payload
      const payload = {
        ...paymentData,
        environment: 'development',
        payment: {
          ...paymentData.payment,
          method: 'pix'
        }
      };

      const { data, error } = await supabase.functions.invoke('transactions', {
        method: 'POST',
        body: payload,
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
   * Generate a PIX payment in production environment
   * Endpoint: POST https://{{base_url}}/functions/v1/transactions
   */
  generatePixProd: async (paymentData: PixPaymentData): Promise<TransactionResponse> => {
    try {
      // Add environment type to the payload
      const payload = {
        ...paymentData,
        environment: 'production',
        payment: {
          ...paymentData.payment,
          method: 'pix'
        }
      };

      const { data, error } = await supabase.functions.invoke('transactions', {
        method: 'POST',
        body: payload,
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
   * Process a credit card payment in development environment
   * Endpoint: POST https://{{base_url}}/functions/v1/transactions
   */
  processCardDev: async (paymentData: CardPaymentData): Promise<TransactionResponse> => {
    try {
      // Add environment type to the payload
      const payload = {
        ...paymentData,
        environment: 'development',
        payment: {
          ...paymentData.payment,
          method: 'credit_card'
        }
      };

      const { data, error } = await supabase.functions.invoke('transactions', {
        method: 'POST',
        body: payload,
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
   * Process a credit card payment with hash in development environment
   * Endpoint: POST https://{{base_url}}/functions/v1/transactions
   */
  processCardHashDev: async (paymentData: CardPaymentData): Promise<TransactionResponse> => {
    try {
      // Add environment type to the payload
      const payload = {
        ...paymentData,
        environment: 'development',
        payment: {
          ...paymentData.payment,
          method: 'credit_card'
        }
      };

      const { data, error } = await supabase.functions.invoke('transactions', {
        method: 'POST',
        body: payload,
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
   * Process a credit card payment in production environment
   * Endpoint: POST https://{{base_url}}/functions/v1/transactions
   */
  processCardProd: async (paymentData: CardPaymentData): Promise<TransactionResponse> => {
    try {
      // Add environment type to the payload
      const payload = {
        ...paymentData,
        environment: 'production',
        payment: {
          ...paymentData.payment,
          method: 'credit_card'
        }
      };

      const { data, error } = await supabase.functions.invoke('transactions', {
        method: 'POST',
        body: payload,
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
   * Get API credentials
   * Endpoint: GET https://{{base_url}}/functions/v1/credentials
   */
  getCredentials: async (): Promise<TransactionResponse> => {
    try {
      const { data, error } = await supabase.functions.invoke('credentials', {
        method: 'GET',
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
   * Process webhook notification from payment provider
   * Endpoint: POST https://{{base_url}}/functions/v1/webhookfx
   */
  processWebhook: async (webhookData: any): Promise<TransactionResponse> => {
    try {
      const { data, error } = await supabase.functions.invoke('webhookfx', {
        method: 'POST',
        body: webhookData,
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: `An unexpected error occurred: ${error.message}` };
    }
  },

  /**
   * Get transaction summary
   * Endpoint: POST https://{{base_url}}/functions/v1/get-transactions-summary
   */
  getTransactionsSummary: async (): Promise<TransactionResponse> => {
    try {
      const { data, error } = await supabase.functions.invoke('get-transactions-summary', {
        method: 'POST',
        body: {},
      });

      if (error) {
        return { success: false, data: null, error: error.message };
      }

      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: null, error: `An unexpected error occurred: ${error}` };
    }
  },

  /**
   * Get all transactions with optional filters
   * Endpoint: POST https://{{base_url}}/functions/v1/get-all-transactions
   */
  getAllTransactions: async (filters = {}): Promise<TransactionResponse> => {
    try {
      const { data, error } = await supabase.functions.invoke('get-all-transactions', {
        method: 'POST',
        body: { filters },
      });

      if (error) {
        return { success: false, data: null, error: error.message };
      }

      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: null, error: `An unexpected error occurred: ${error}` };
    }
  },

  /**
   * Get details for a single transaction
   * Endpoint: POST https://{{base_url}}/functions/v1/get-transaction-details
   */
  getTransactionDetails: async (id: string): Promise<TransactionResponse> => {
    try {
      const { data, error } = await supabase.functions.invoke('get-transaction-details', {
        method: 'POST',
        body: { id },
      });

      if (error) {
        return { success: false, data: null, error: error.message };
      }

      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: null, error: `An unexpected error occurred: ${error}` };
    }
  }
}; 