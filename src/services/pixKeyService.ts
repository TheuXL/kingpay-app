import { ApiResponse } from '../types';
import { PixKey } from '../types/pixKey';
import { supabase } from './supabase';

interface PixKeyListOptions {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

interface PixKeyListResponse {
  items: PixKey[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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
 * List all PIX keys with pagination and filtering options
 */
export const listAllPixKeys = async (options?: PixKeyListOptions): Promise<ApiResponse<PixKeyListResponse>> => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (options?.page) queryParams.append('page', options.page.toString());
    if (options?.limit) queryParams.append('limit', options.limit.toString());
    if (options?.status) queryParams.append('status', options.status);
    if (options?.search) queryParams.append('search', options.search);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const { data, error } = await supabase.functions.invoke(`pix-keys/list${queryString}`, {
      method: 'GET'
    });
    
    if (error) {
      return { 
        success: false, 
        data: undefined, 
        error: { message: error.message || 'Failed to list PIX keys' } 
      };
    }
    
    return { 
      success: true, 
      data, 
      error: undefined 
    };
  } catch (error) {
    console.error('Error listing PIX keys:', error);
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
 * Approve or reject a PIX key
 * @param keyId The ID of the PIX key to approve/reject
 * @param approve True to approve, false to reject
 * @param financialPassword User's financial password for security
 */
export const approvePixKey = async (
  keyId: string, 
  approve: boolean = true, 
  financialPassword?: string
): Promise<ApiResponse<PixKey>> => {
  try {
    // Validate inputs
    if (!keyId) {
      return { 
        success: false, 
        data: undefined, 
        error: { message: 'ID da chave Pix é obrigatório' } 
      };
    }
    
    if (!financialPassword) {
      return { 
        success: false, 
        data: undefined, 
        error: { message: 'Senha financeira é obrigatória' } 
      };
    }
    
    const endpoint = approve ? 'pix-keys/approve' : 'pix-keys/reject';
    
    const { data, error } = await supabase.functions.invoke(endpoint, {
      method: 'POST',
      body: { 
        key_id: keyId,
        financial_password: financialPassword
      }
    });
    
    if (error) {
      return { 
        success: false, 
        data: undefined, 
        error: { message: error.message || `Failed to ${approve ? 'approve' : 'reject'} PIX key ${keyId}` } 
      };
    }
    
    return { 
      success: true, 
      data, 
      error: undefined 
    };
  } catch (error) {
    console.error(`Error ${approve ? 'approving' : 'rejecting'} PIX key:`, error);
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
 * Simulate listing PIX keys when the API call fails
 * This is used as a fallback for development and testing
 */
export const simulateListPixKeys = (options?: PixKeyListOptions): PixKeyListResponse => {
  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const status = options?.status;
  const search = options?.search?.toLowerCase();
  
  // Generate mock data
  const mockPixKeys: PixKey[] = [
    {
      id: '1',
      user_id: 'user1',
      key_type: 'cpf',
      key_value: '123.456.789-00',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: 'user1',
        email: 'user1@example.com',
        full_name: 'User One'
      }
    },
    {
      id: '2',
      user_id: 'user2',
      key_type: 'email',
      key_value: 'user2@example.com',
      status: 'approved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: 'user2',
        email: 'user2@example.com',
        full_name: 'User Two'
      }
    },
    {
      id: '3',
      user_id: 'user3',
      key_type: 'phone',
      key_value: '+5511999999999',
      status: 'rejected',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: 'user3',
        email: 'user3@example.com',
        full_name: 'User Three'
      }
    },
    {
      id: '4',
      user_id: 'user4',
      key_type: 'random',
      key_value: '123e4567-e89b-12d3-a456-426614174000',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      company_id: 'company1',
      user: {
        id: 'user4',
        email: 'user4@example.com',
        full_name: 'User Four'
      },
      company: {
        id: 'company1',
        name: 'Company One'
      }
    },
    {
      id: '5',
      user_id: 'user5',
      key_type: 'email',
      key_value: 'user5@example.com',
      status: 'approved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: 'user5',
        email: 'user5@example.com',
        full_name: 'User Five'
      }
    }
  ];
  
  // Filter by status if specified
  let filteredKeys = mockPixKeys;
  if (status && status !== 'all') {
    filteredKeys = mockPixKeys.filter(key => key.status === status);
  }
  
  // Filter by search term if specified
  if (search) {
    filteredKeys = filteredKeys.filter(key => {
      return (
        key.key_value.toLowerCase().includes(search) ||
        key.user?.full_name?.toLowerCase().includes(search) ||
        key.user?.email.toLowerCase().includes(search) ||
        key.company?.name?.toLowerCase().includes(search)
      );
    });
  }
  
  // Calculate pagination
  const total = filteredKeys.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedKeys = filteredKeys.slice(startIndex, endIndex);
  
  return {
    items: paginatedKeys,
    total,
    page,
    limit,
    totalPages
  };
}; 