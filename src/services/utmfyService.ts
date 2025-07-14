import {
    CreateUtmFyTrackerRequest,
    UpdateUtmFyTrackerRequest,
    UtmFyTrackerResponse
} from '../types/utmfy';
import { supabase } from './supabase';

export const utmfyService = {
  /**
   * Buscar todos os rastreadores UTM
   */
  async getTrackers(): Promise<UtmFyTrackerResponse> {
    try {
      const { data, error } = await supabase
        .from('pixel_trackers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data
      };
    } catch (error: any) {
      console.error('Erro ao buscar rastreadores UTM:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido ao buscar rastreadores UTM',
          code: 'UTM_FETCH_ERROR'
        },
      };
    }
  },

  /**
   * Criar um novo rastreador UTM
   */
  async createTracker(trackerData: CreateUtmFyTrackerRequest): Promise<UtmFyTrackerResponse> {
    try {
      // Validações obrigatórias
      if (!trackerData.name) {
        throw new Error('Nome do rastreador é obrigatório');
      }
      
      if (!trackerData.platform) {
        throw new Error('Plataforma é obrigatória');
      }
      
      if (!trackerData.pixel_id) {
        throw new Error('ID do pixel é obrigatório');
      }
      
      if (!trackerData.api_key) {
        throw new Error('Chave de API é obrigatória');
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        throw new Error('Falha ao verificar usuário autenticado');
      }

      const newTracker = {
        name: trackerData.name,
        platform: trackerData.platform,
        pixel_id: trackerData.pixel_id,
        api_key: trackerData.api_key,
        user_id: userData.user?.id
      };

      const { data, error } = await supabase
        .from('pixel_trackers')
        .insert(newTracker)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data
      };
    } catch (error: any) {
      console.error('Erro ao criar rastreador UTM:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido ao criar rastreador UTM',
          code: 'UTM_CREATE_ERROR'
        },
      };
    }
  },

  /**
   * Atualizar um rastreador UTM existente
   */
  async updateTracker(trackerData: UpdateUtmFyTrackerRequest): Promise<UtmFyTrackerResponse> {
    try {
      if (!trackerData.id) {
        throw new Error('ID do rastreador é obrigatório');
      }

      // Verifica se o rastreador existe
      const { data: existingTracker, error: checkError } = await supabase
        .from('pixel_trackers')
        .select('*')
        .eq('id', trackerData.id)
        .single();

      if (checkError || !existingTracker) {
        throw new Error(`Rastreador com ID ${trackerData.id} não encontrado`);
      }

      // Preparar dados para atualização, removendo campos undefined
      const updateData: any = {};
      if (trackerData.name !== undefined) updateData.name = trackerData.name;
      if (trackerData.platform !== undefined) updateData.platform = trackerData.platform;
      if (trackerData.pixel_id !== undefined) updateData.pixel_id = trackerData.pixel_id;
      if (trackerData.api_key !== undefined) updateData.api_key = trackerData.api_key;
      
      // Adiciona data de atualização
      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('pixel_trackers')
        .update(updateData)
        .eq('id', trackerData.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data
      };
    } catch (error: any) {
      console.error('Erro ao atualizar rastreador UTM:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar rastreador UTM',
          code: 'UTM_UPDATE_ERROR'
        },
      };
    }
  }
}; 