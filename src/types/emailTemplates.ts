export interface EmailTemplate {
  id: string;
  assunto: string;
  remetente_nome: string;
  email_body: string;
  tipo: string;
  created_at?: string;
  updated_at?: string;
}

export interface EmailTemplatesResponse {
  templates: EmailTemplate[];
}

export interface UpdateEmailTemplateRequest {
  id: string;
  assunto?: string;
  remetente_nome?: string;
  email_body?: string;
}

export interface AceitarTermosResponse {
  success: boolean;
  message: string;
  data?: {
    termos_aceitos: boolean;
    data_aceitacao: string;
  };
} 