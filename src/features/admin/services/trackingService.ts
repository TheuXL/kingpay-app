import { supabase } from '@/config/supabaseClient';

/**
 * Módulo: Rastreamento
 * Endpoint para registrar eventos de rastreamento (pixels, UTMs).
 */
export class TrackingService {

  /**
   * GET /functions/v1/pixelTracker
   */
  async getPixelTracker(params: any) {
    try {
      const query = new URLSearchParams(params).toString();
      const { data, error } = await supabase.functions.invoke(`pixelTracker?${query}`, {
        method: 'GET',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar pixel tracker:', error);
      throw error;
    }
  }

  /**
   * POST /functions/v1/pixelTracker
   */
  async createPixelTracker(payload: any) {
    try {
      const { data, error } = await supabase.functions.invoke('pixelTracker', {
        method: 'POST',
        body: payload,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar pixel tracker:', error);
      throw error;
    }
  }

  /**
   * PATCH /functions/v1/pixelTracker
   */
  async updatePixelTracker(payload: any) {
    try {
      const { data, error } = await supabase.functions.invoke('pixelTracker', {
        method: 'PATCH',
        body: payload,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar pixel tracker:', error);
      throw error;
    }
  }
}

export const trackingService = new TrackingService(); 