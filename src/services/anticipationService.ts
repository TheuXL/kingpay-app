// src/services/anticipationService.ts
import { ApiResponse } from '../types';
import {
  Anticipation,
  ApproveAnticipationPayload
} from '../types/anticipations';
import { supabase } from './supabase';

// Define proper filters interface
export interface AnticipationFilters {
  limit?: number;
  offset?: number;
  status?: string;
}

// Add the missing interface
export interface DenyAnticipationPayload {
  anticipation_id: string;
  reason: string;
}

/**
 * Obtém a lista de antecipações com filtros opcionais
 */
export const getAnticipations = async (filters: AnticipationFilters = {}): Promise<ApiResponse<Anticipation[]>> => {
  try {
    let endpoint = 'antecipacoes/anticipations';
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
      return { success: false, error: { message: error.message || 'Erro ao buscar antecipações' } };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: { message: error instanceof Error ? error.message : 'Erro desconhecido' } };
  }
};

/**
 * Nega um pedido de antecipação
 */
export const denyAnticipation = async (payload: DenyAnticipationPayload): Promise<ApiResponse<Anticipation>> => {
  try {
    const { data, error } = await supabase.functions.invoke('antecipacoes/deny', {
      method: 'PATCH',
      body: payload,
    });

    if (error) {
      return { success: false, error: { message: error.message || 'Erro ao negar antecipação' } };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: { message: error instanceof Error ? error.message : 'Erro desconhecido' } };
  }
};

/**
 * Aprova um pedido de antecipação
 */
export const approveAnticipation = async (payload: ApproveAnticipationPayload): Promise<ApiResponse<Anticipation>> => {
  try {
    const { data, error } = await supabase.functions.invoke('antecipacoes/approve', {
      method: 'POST',
      body: payload,
    });

    if (error) {
      return { success: false, error: { message: error.message || 'Erro ao aprovar antecipação' } };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: { message: error instanceof Error ? error.message : 'Erro desconhecido' } };
  }
}; 