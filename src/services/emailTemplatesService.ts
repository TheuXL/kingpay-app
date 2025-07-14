import { AceitarTermosResponse, ApiResponse, EmailTemplate, EmailTemplatesResponse, UpdateEmailTemplateRequest } from '../types';
import { supabase } from './supabase';

export const emailTemplatesService = {
  // Obter templates de email
  async getEmailTemplates(): Promise<ApiResponse<EmailTemplatesResponse>> {
    try {
      const { data, error } = await supabase
        .functions
        .invoke('configuracoes/termos', {
          method: 'GET',
        });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Erro ao buscar templates de email:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido ao buscar templates de email',
        },
      };
    }
  },

  // Atualizar template de email
  async updateEmailTemplate(template: UpdateEmailTemplateRequest): Promise<ApiResponse<EmailTemplate>> {
    try {
      const { data, error } = await supabase
        .functions
        .invoke('configuracoes/emails', {
          method: 'PUT',
          body: template
        });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Erro ao atualizar template de email:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar template de email',
        },
      };
    }
  },

  // Aceitar termos de uso
  async aceitarTermos(): Promise<ApiResponse<AceitarTermosResponse>> {
    try {
      const { data, error } = await supabase
        .functions
        .invoke('configuracoes/acecitar-termos', {
          method: 'PUT',
        });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Erro ao aceitar termos de uso:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido ao aceitar termos de uso',
        },
      };
    }
  }
}; 