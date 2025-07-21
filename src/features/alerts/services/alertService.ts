import { supabase } from '../../../lib/supabase';

/**
 * Módulo: Alertas e Notificações
 * Endpoints 47-50 da documentação INTEGRACAO.md
 */
export class AlertService {

  /**
   * Endpoint 47: Listar Alertas (GET /functions/v1/alerts)
   * Propósito: Obter a lista de notificações para o usuário
   */
  async getAlerts(page: number = 1, limit: number = 10) {
    try {
      const { data, error } = await supabase.functions.invoke(`alerts?limit=${limit}&offset=${(page - 1) * limit}`, {
        method: 'GET',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar alertas:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Endpoint 48: Criar Alerta (Admin) (POST /functions/v1/alerts)
   * Propósito: Enviar uma notificação global ou para um grupo de usuários
   */
  async createAlert(title: string, body: string, isCheckoutAlert: boolean = false) {
    try {
      await supabase.functions.invoke('alerts', {
        body: { title, body, checkout: isCheckoutAlert },
      });
    } catch (error) {
      console.error('Erro ao criar alerta:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Endpoint 49: Marcar Alerta como Visualizado (POST /functions/v1/alerts/mark-viewed)
   * Propósito: Indicar que o usuário leu uma notificação
   */
  async markAlertAsViewed(alertId: string) {
    try {
      await supabase.functions.invoke('alerts/mark-viewed', {
        body: { id: alertId },
      });
    } catch (error) {
      console.error('Erro ao marcar alerta:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Endpoint 50: Deletar Alerta (Admin) (DELETE /functions/v1/alerts)
   * Propósito: Remover uma notificação do sistema
   */
  async deleteAlert(alertId: string) {
    try {
      await supabase.functions.invoke('alerts', {
        method: 'DELETE',
        body: { id: alertId },
      });
    } catch (error) {
      console.error('Erro ao deletar alerta:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Marcar todos os alertas como lidos
   */
  async markAllAlertsAsViewed() {
    try {
      await supabase.functions.invoke('alerts/mark-all-viewed', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Erro ao marcar todos alertas:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Buscar alertas não lidos
   */
  async getUnreadAlertsCount() {
    try {
      const { data, error } = await supabase.functions.invoke('alerts/unread-count', {
        method: 'GET',
      });
      if (error) throw error;
      return data.count || 0;
    } catch (error) {
      console.error('Erro ao contar alertas não lidos:', error instanceof Error ? error.message : 'Erro desconhecido');
      return 0;
    }
  }

  /**
   * Criar alerta dirigido para usuário específico
   */
  async createUserAlert(userId: string, title: string, body: string, type: string = 'info') {
    try {
      await supabase.functions.invoke('alerts/user-specific', {
        body: { 
          user_id: userId,
          title, 
          body, 
          type,
          target: 'user'
        },
      });
    } catch (error) {
      console.error('Erro ao criar alerta de usuário:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Criar alerta para grupo de usuários
   */
  async createGroupAlert(userIds: string[], title: string, body: string, type: string = 'info') {
    try {
      await supabase.functions.invoke('alerts/group', {
        body: { 
          user_ids: userIds,
          title, 
          body, 
          type,
          target: 'group'
        },
      });
    } catch (error) {
      console.error('Erro ao criar alerta de grupo:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Agendar alerta para ser enviado em uma data específica
   */
  async scheduleAlert(title: string, body: string, scheduledDate: string, target: 'all' | 'group' | 'user' = 'all') {
    try {
      await supabase.functions.invoke('alerts/schedule', {
        body: { 
          title, 
          body, 
          scheduled_date: scheduledDate,
          target
        },
      });
    } catch (error) {
      console.error('Erro ao agendar alerta:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Cancelar alerta agendado
   */
  async cancelScheduledAlert(alertId: string) {
    try {
      await supabase.functions.invoke(`alerts/schedule/${alertId}/cancel`, {
        method: 'PATCH',
      });
    } catch (error) {
      console.error('Erro ao cancelar alerta agendado:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }
}

export const alertService = new AlertService(); 