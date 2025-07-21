import { supabase } from '../../../lib/supabase';

/**
 * Módulo: Subcontas (Marketplace)
 * Endpoints da documentação
 */
export class SubaccountService {

  /**
   * POST /proxy
   * Propósito: Funciona como um gateway seguro para um provedor de marketplace.
   */
  async proxyRequest(endpoint: string, payload: any, method: 'POST' | 'GET' | 'PUT' | 'PATCH' = 'POST') {
    try {
      const { data, error } = await supabase.functions.invoke('proxy', {
        method: 'POST',
        body: { endpoint, payload, method },
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro na requisição proxy:', error);
      throw error;
    }
  }

  /**
   * POST /request_verification
   * Propósito: Enviar os dados de verificação ("Know Your Customer") de um vendedor.
   */
  async requestVerification(verificationData: any) {
    try {
      const { data, error } = await supabase.functions.invoke('request_verification', {
        method: 'POST',
        body: verificationData,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao solicitar verificação de KYC:', error);
      throw error;
    }
  }

  /**
   * POST /functions/v1/subconta
   * Propósito: Orquestrar o processo completo de criação de subconta.
   */
  async createSubaccount(subaccountData: any) {
    try {
      const { data, error } = await supabase.functions.invoke('subconta', {
        method: 'POST',
        body: subaccountData,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar subconta:', error);
      throw error;
    }
  }

  /**
   * PUT /functions/v1/subconta/resend_documents
   * Propósito: Reenviar um documento específico caso tenha sido recusado.
   */
  async resendDocuments(documentsData: any) {
    try {
      const { data, error } = await supabase.functions.invoke('subconta/resend_documents', {
        method: 'PUT',
        body: documentsData,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao reenviar documentos:', error);
      throw error;
    }
  }

  /**
   * POST /functions/v1/subconta/checkstatus
   * Propósito: Consultar o status atual de uma subconta.
   */
  async checkSubaccountStatus(subaccountId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('subconta/checkstatus', {
        method: 'POST',
        body: { sub_account_id: subaccountId },
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao verificar status da subconta:', error);
      throw error;
    }
  }

  /**
   * POST /functions/v1/subconta/check_kyc
   * Propósito: Focado em consultar o status da verificação de documentos (KYC).
   */
  async checkKycStatus(subaccountId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('subconta/check_kyc', {
        method: 'POST',
        body: { sub_account_id: subaccountId },
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao verificar status do KYC:', error);
      throw error;
    }
  }
}

export const subaccountService = new SubaccountService(); 