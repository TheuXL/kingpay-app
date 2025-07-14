import { Acquirer, AcquirerFee, UpdateAcquirerActivePayload, UpdateAcquirerFeePayload } from '../types/acquirers';
import { supabase } from './supabase';

/**
 * Retrieves all acquirers with an optional limit
 */
export const getAllAcquirers = async (limit: number = 100): Promise<Acquirer[]> => {
  const { data, error } = await supabase
    .from('functions/v1/acquirers')
    .select('*')
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch acquirers: ${error.message}`);
  }

  return data || [];
};

/**
 * Retrieves a specific acquirer by ID
 */
export const getAcquirerById = async (id: string): Promise<Acquirer> => {
  const { data, error } = await supabase
    .from('functions/v1/acquirers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch acquirer: ${error.message}`);
  }

  return data;
};

/**
 * Retrieves the fees for a specific acquirer
 */
export const getAcquirerFees = async (id: string): Promise<AcquirerFee[]> => {
  // Usando rpc (remote procedure call) em vez de append
  const { data, error } = await supabase
    .rpc('get_acquirer_fees', { acquirer_id: id });

  if (error) {
    throw new Error(`Failed to fetch acquirer fees: ${error.message}`);
  }

  return data || [];
};

/**
 * Toggles active status for payment methods of an acquirer
 */
export const toggleAcquirerActive = async (
  id: string,
  payload: UpdateAcquirerActivePayload
): Promise<Acquirer> => {
  // Usando rpc em vez de append
  const { data, error } = await supabase
    .rpc('update_acquirer_active', { 
      acquirer_id: id,
      ...payload
    });

  if (error) {
    throw new Error(`Failed to update acquirer active status: ${error.message}`);
  }

  return data;
};

/**
 * Updates the fees for a specific acquirer
 */
export const updateAcquirerFee = async (
  id: string,
  payload: UpdateAcquirerFeePayload
): Promise<AcquirerFee> => {
  // Usando rpc em vez de append
  const { data, error } = await supabase
    .rpc('update_acquirer_fees', {
      acquirer_id: id,
      ...payload
    });

  if (error) {
    throw new Error(`Failed to update acquirer fee: ${error.message}`);
  }

  return data;
}; 