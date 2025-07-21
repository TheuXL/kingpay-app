import { supabase } from '../../../lib/supabase';

/**
 * Módulo: Logs de Auditoria (Admin)
 */
export class AuditLogService {

  /**
   * GET /functions/v1/audit-log
   * Propósito: Recuperar um registro de ações importantes realizadas no sistema.
   */
  async getAuditLogs(filters?: { 
    limit?: number; 
    offset?: number; 
    userId?: string;
    action?: string;
  }) {
    try {
      const params = new URLSearchParams();
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());
      if (filters?.userId) params.append('user_id', filters.userId);
      if (filters?.action) params.append('action', filters.action);

      const { data, error } = await supabase.functions.invoke(`audit-log?${params.toString()}`, {
        method: 'GET',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar logs de auditoria:', error);
      throw error;
    }
  }
}

export const auditLogService = new AuditLogService(); 