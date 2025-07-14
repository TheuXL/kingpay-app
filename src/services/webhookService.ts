import { ApiResponse } from '../types';
import { CreateWebhookPayload, EditWebhookPayload, Webhook } from '../types/webhook';
import { supabase } from './supabase';

/**
 * Fetches the webhooks for a specific user with pagination.
 */
const getWebhooks = async (
  userId: string,
  limit: number = 100,
  offset: number = 0
): Promise<ApiResponse<Webhook[]>> => {
  try {
    const { data, error } = await supabase.functions.invoke(
      `webhook?user_id=${userId}&limit=${limit}&offset=${offset}`,
      { method: 'GET' }
    );
    
    if (error) throw error;
    
    return { 
      success: true, 
      data: data || [], 
      error: undefined 
    };
  } catch (error) {
    console.error('Error fetching webhooks:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred.';
    
    return { 
      success: false, 
      data: [], 
      error: { message: errorMessage }
    };
  }
};

/**
 * Creates a new webhook.
 */
const createWebhook = async (payload: CreateWebhookPayload): Promise<ApiResponse<Webhook>> => {
  try {
    const { data, error } = await supabase.functions.invoke('webhook', {
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
    console.error('Error creating webhook:', error);
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
 * Edits an existing webhook.
 */
const editWebhook = async (
  webhookId: string,
  payload: EditWebhookPayload
): Promise<ApiResponse<Webhook>> => {
  try {
    const { data, error } = await supabase.functions.invoke(`webhook/${webhookId}`, {
      method: 'PUT',
      body: payload,
    });
    
    if (error) throw error;
    
    return { 
      success: true, 
      data, 
      error: undefined 
    };
  } catch (error) {
    console.error('Error editing webhook:', error);
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
 * Deletes a webhook.
 */
const deleteWebhook = async (webhookId: string): Promise<ApiResponse<null>> => {
  try {
    const { error } = await supabase.functions.invoke(`webhook/${webhookId}`, {
      method: 'DELETE',
    });
    
    if (error) throw error;
    
    return { 
      success: true, 
      data: null, 
      error: undefined 
    };
  } catch (error) {
    console.error('Error deleting webhook:', error);
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

export const webhookService = {
  getWebhooks,
  createWebhook,
  editWebhook,
  deleteWebhook,
}; 