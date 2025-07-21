import { supabase } from '../../../lib/supabase';

/**
 * Módulo: Código de Segurança
 * Endpoints 3-4 da documentação INTEGRACAO.md
 */
export class SecurityCodeService {

  /**
   * Endpoint 3: Geração de Código de Validação
   * POST /functions/v1/validation-codes/generate
   * Propósito: Gerar um código de uso único para ações sensíveis.
   */
  async generateSecurityCode() {
    try {
      const { data, error } = await supabase.functions.invoke('validation-codes/generate', {
        method: 'POST',
      });
      if (error) throw error;
      console.log('Código gerado:', data.code);
      return data;
    } catch (error) {
      console.error('Erro ao gerar código:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  /**
   * Endpoint 4: Validação de Código de Segurança
   * POST /functions/v1/validation-codes/validate
   * Propósito: Validar o código inserido pelo usuário.
   */
  async validateSecurityCode(code: string) {
    try {
      const { data, error } = await supabase.functions.invoke('validation-codes/validate', {
        method: 'POST',
        body: { code: code },
      });
      if (error) throw error;
      console.log('Validação:', data.message);
      return data.success;
    } catch (error) {
      console.error('Erro ao validar código:', error instanceof Error ? error.message : 'Erro desconhecido');
      return false;
    }
  }
}

export const securityCodeService = new SecurityCodeService(); 