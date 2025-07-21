/**
 * 🔐 SERVIÇO DE CÓDIGOS DE VALIDAÇÃO - KINGPAY
 * ===========================================
 * 
 * Módulo: Código de Segurança
 * Endpoints 3-4 da documentação INTEGRACAO.md
 * 
 * Implementação dos fluxos de geração e validação de códigos
 * de segurança para operações sensíveis
 */

import { supabase } from '../../lib/supabase';

export interface ValidationCodeResponse {
  success: boolean;
  code?: string;
  expiresAt?: Date;
  message?: string;
}

export interface ValidateCodeResponse {
  success: boolean;
  valid: boolean;
  message?: string;
}

export class ValidationCodeService {
  
  /**
   * Endpoint 3: Gerar Código de Validação
   * POST /functions/v1/validation-codes/generate
   * 
   * Propósito: Gerar um código de segurança único e com tempo 
   * de expiração para um usuário autenticado
   */
  async generateValidationCode(): Promise<ValidationCodeResponse> {
    try {
      console.log('🔐 Gerando código de validação...');

      const { data, error } = await supabase.functions.invoke('validation-codes/generate', {
        method: 'POST',
      });

      if (error) {
        console.error('❌ Erro ao gerar código:', error.message);
        return {
          success: false,
          message: error.message
        };
      }

      console.log('✅ Código de validação gerado');
      
      return {
        success: true,
        code: data.code,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        message: data.message
      };

    } catch (error) {
      console.error('❌ Erro inesperado ao gerar código:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Endpoint 4: Validar Código de Segurança
   * POST /functions/v1/validation-codes/validate
   * 
   * Propósito: Verificar se o código fornecido pelo usuário é válido,
   * não expirado e corresponde ao usuário logado
   */
  async validateCode(code: string): Promise<ValidateCodeResponse> {
    try {
      console.log('🔍 Validando código de segurança...');

      if (!code || code.trim().length === 0) {
        return {
          success: false,
          valid: false,
          message: 'Código não pode estar vazio'
        };
      }

      const { data, error } = await supabase.functions.invoke('validation-codes/validate', {
        method: 'POST',
        body: { code: code.trim() },
      });

      if (error) {
        console.error('❌ Erro ao validar código:', error.message);
        return {
          success: false,
          valid: false,
          message: error.message
        };
      }

      console.log('✅ Código validado:', data.valid ? 'Válido' : 'Inválido');
      
      return {
        success: true,
        valid: data.valid || false,
        message: data.message
      };

    } catch (error) {
      console.error('❌ Erro inesperado ao validar código:', error);
      return {
        success: false,
        valid: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Gerar e enviar código por email (se suportado)
   */
  async generateAndSendCode(email?: string): Promise<ValidationCodeResponse> {
    try {
      console.log('📧 Gerando e enviando código por email...');

      const body: any = {};
      if (email) {
        body.email = email;
      }

      const { data, error } = await supabase.functions.invoke('validation-codes/generate', {
        method: 'POST',
        body: Object.keys(body).length > 0 ? body : undefined,
      });

      if (error) {
        console.error('❌ Erro ao gerar e enviar código:', error.message);
        return {
          success: false,
          message: error.message
        };
      }

      console.log('✅ Código gerado e enviado por email');
      
      return {
        success: true,
        code: data.code,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        message: data.message || 'Código enviado por email'
      };

    } catch (error) {
      console.error('❌ Erro inesperado ao gerar e enviar código:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Verificar se código ainda é válido (sem consumi-lo)
   */
  async checkCodeStatus(code: string): Promise<{ valid: boolean; expiresAt?: Date }> {
    try {
      const { data, error } = await supabase.functions.invoke('validation-codes/check', {
        method: 'POST',
        body: { code: code.trim() },
      });

      if (error) {
        return { valid: false };
      }

      return {
        valid: data.valid || false,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined
      };

    } catch (error) {
      console.error('❌ Erro ao verificar status do código:', error);
      return { valid: false };
    }
  }

  /**
   * Invalidar código (marcar como usado)
   */
  async invalidateCode(code: string): Promise<boolean> {
    try {
      console.log('🚫 Invalidando código...');

      const { error } = await supabase.functions.invoke('validation-codes/invalidate', {
        method: 'POST',
        body: { code: code.trim() },
      });

      if (error) {
        console.error('❌ Erro ao invalidar código:', error.message);
        return false;
      }

      console.log('✅ Código invalidado');
      return true;

    } catch (error) {
      console.error('❌ Erro inesperado ao invalidar código:', error);
      return false;
    }
  }
}

export const validationCodeService = new ValidationCodeService(); 