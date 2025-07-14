import { create } from 'zustand';
import { emailTemplatesService } from '../services/emailTemplatesService';
import { EmailTemplate } from '../types/emailTemplates';

interface EmailTemplatesState {
  // Estados
  templates: EmailTemplate[];
  selectedTemplate: EmailTemplate | null;
  loading: boolean;
  updating: boolean;
  aceitandoTermos: boolean;
  error: string | null;
  
  // Ações
  fetchEmailTemplates: () => Promise<void>;
  updateEmailTemplate: (template: Partial<EmailTemplate>) => Promise<boolean>;
  aceitarTermos: () => Promise<boolean>;
  selectTemplate: (templateId: string) => void;
  resetSelectedTemplate: () => void;
  resetError: () => void;
}

export const useEmailTemplatesStore = create<EmailTemplatesState>((set, get) => ({
  // Estados iniciais
  templates: [],
  selectedTemplate: null,
  loading: false,
  updating: false,
  aceitandoTermos: false,
  error: null,
  
  // Ações
  fetchEmailTemplates: async () => {
    set({ loading: true, error: null });
    try {
      const response = await emailTemplatesService.getEmailTemplates();
      if (response.success && response.data) {
        set({ templates: response.data.templates });
      } else {
        set({ error: response.error?.message || 'Erro ao buscar templates de email' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar templates de email' });
    } finally {
      set({ loading: false });
    }
  },
  
  updateEmailTemplate: async (template) => {
    if (!template.id) {
      set({ error: 'ID do template é obrigatório' });
      return false;
    }
    
    set({ updating: true, error: null });
    try {
      const response = await emailTemplatesService.updateEmailTemplate({
        id: template.id,
        assunto: template.assunto,
        remetente_nome: template.remetente_nome,
        email_body: template.email_body
      });
      
      if (response.success && response.data) {
        // Atualizar o template na lista
        const { templates } = get();
        const updatedTemplates = templates.map(t => 
          t.id === response.data?.id ? response.data : t
        ).filter((template): template is EmailTemplate => template !== undefined);
        
        set({ 
          templates: updatedTemplates,
          selectedTemplate: response.data
        });
        
        return true;
      } else {
        set({ error: response.error?.message || 'Erro ao atualizar template de email' });
        return false;
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar template de email' });
      return false;
    } finally {
      set({ updating: false });
    }
  },
  
  aceitarTermos: async () => {
    set({ aceitandoTermos: true, error: null });
    try {
      const response = await emailTemplatesService.aceitarTermos();
      
      if (response.success && response.data) {
        return true;
      } else {
        set({ error: response.error?.message || 'Erro ao aceitar termos de uso' });
        return false;
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erro desconhecido ao aceitar termos de uso' });
      return false;
    } finally {
      set({ aceitandoTermos: false });
    }
  },
  
  selectTemplate: (templateId) => {
    const { templates } = get();
    const template = templates.find(t => t.id === templateId);
    set({ selectedTemplate: template || null });
  },
  
  resetSelectedTemplate: () => {
    set({ selectedTemplate: null });
  },
  
  resetError: () => {
    set({ error: null });
  }
})); 