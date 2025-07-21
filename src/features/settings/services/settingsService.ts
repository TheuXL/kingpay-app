import { supabase } from '../../../lib/supabase';

/**
 * Tipos para configurações da aplicação
 */
export interface AppConfig {
  platform: {
    name: string;
    description: string;
    version: string;
  };
  features: {
    chargebackEnabled: boolean;
    anticipationEnabled: boolean;
    walletEnabled: boolean;
    taxCalculatorEnabled: boolean;
  };
  limits: {
    maxWithdrawalAmount: number;
    maxDailyTransactions: number;
    minTransactionAmount: number;
  };
  fees: {
    pixFee: number;
    boletoFee: number;
    cardFee: number;
    withdrawalFee: number;
  };
  enable_multi_account: boolean;
}

/**
 * Módulo: Configurações e Personalização
 * Endpoints 30-36 da documentação INTEGRACAO.md
 */
export const settingsService = {
  /**
   * Endpoint 30: Obter Termos de Uso (GET /functions/v1/configuracoes/termos)
   * Propósito: Buscar o texto dos Termos de Uso.
   */
  async getTermsOfUse() {
    try {
      const { data, error } = await supabase.functions.invoke('configuracoes/termos', {
        method: 'GET',
      });
      if (error) throw error;
      return data.termos;
    } catch (error) {
      console.error('Erro ao buscar termos:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  },

  /**
   * Endpoint 31: Atualizar Termos de Uso (Admin) (PUT /functions/v1/configuracoes/termos)
   * Propósito: Alterar o texto dos Termos de Uso.
   */
  async updateTermsOfUse(newTerms: string) {
    try {
      await supabase.functions.invoke('configuracoes/termos', {
        method: 'PUT',
        body: { termos: newTerms },
      });
    } catch (error) {
      console.error('Erro ao atualizar termos:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  },

  /**
   * Endpoint 32: Obter Configurações da Plataforma (GET /functions/v1/configuracoes)
   * Propósito: Carregar as regras de negócio globais.
   */
  async getPlatformConfig() {
    try {
      const { data, error } = await supabase.functions.invoke('configuracoes', {
        method: 'GET',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar config:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  },

  /**
   * Obter configurações do app (alias para getPlatformConfig)
   */
  async getAppConfig(): Promise<AppConfig> {
    try {
      const data = await this.getPlatformConfig();
      
      // Mapear dados da plataforma para AppConfig
      const typedData = data as any;
      return {
        platform: {
          name: typedData?.platform_name || 'KingPay',
          description: typedData?.platform_description || 'Sistema de Pagamentos',
          version: typedData?.platform_version || '1.0.0',
        },
        features: {
          chargebackEnabled: typedData?.enable_chargeback || false,
          anticipationEnabled: typedData?.enable_anticipation || true,
          walletEnabled: typedData?.enable_wallet || true,
          taxCalculatorEnabled: typedData?.enable_tax_calculator || true,
        },
        limits: {
          maxWithdrawalAmount: typedData?.max_withdrawal_amount || 10000,
          maxDailyTransactions: typedData?.max_daily_transactions || 100,
          minTransactionAmount: typedData?.min_transaction_amount || 1,
        },
        fees: {
          pixFee: typedData?.pix_fee || 0,
          boletoFee: typedData?.boleto_fee || 350,
          cardFee: typedData?.card_fee || 390,
          withdrawalFee: typedData?.withdrawal_fee || 0,
        },
        enable_multi_account: typedData?.enable_multi_account || false,
      };
    } catch (error) {
      console.error('Erro ao buscar config do app:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  },

  /**
   * Endpoint 33: Atualizar Configurações da Plataforma (Admin) (PUT /functions/v1/configuracoes)
   * Propósito: Salvar novas regras de negócio.
   * configPayload é o objeto JSON completo com todas as configurações
   */
  async updatePlatformConfig(configPayload: any) {
    try {
      await supabase.functions.invoke('configuracoes', {
        method: 'PUT',
        body: configPayload,
      });
    } catch (error) {
      console.error('Erro ao atualizar config:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  },

  /**
   * Atualizar configurações do app (wrapper para updatePlatformConfig)
   */
  async updateAppConfig(configUpdates: Partial<AppConfig>) {
    try {
      // Converter AppConfig para formato da plataforma
      const platformConfig: any = {};
      
      if (configUpdates.platform) {
        if (configUpdates.platform.name) platformConfig.platform_name = configUpdates.platform.name;
        if (configUpdates.platform.description) platformConfig.platform_description = configUpdates.platform.description;
        if (configUpdates.platform.version) platformConfig.platform_version = configUpdates.platform.version;
      }
      
      if (configUpdates.features) {
        if (configUpdates.features.chargebackEnabled !== undefined) platformConfig.enable_chargeback = configUpdates.features.chargebackEnabled;
        if (configUpdates.features.anticipationEnabled !== undefined) platformConfig.enable_anticipation = configUpdates.features.anticipationEnabled;
        if (configUpdates.features.walletEnabled !== undefined) platformConfig.enable_wallet = configUpdates.features.walletEnabled;
        if (configUpdates.features.taxCalculatorEnabled !== undefined) platformConfig.enable_tax_calculator = configUpdates.features.taxCalculatorEnabled;
      }
      
      if (configUpdates.limits) {
        if (configUpdates.limits.maxWithdrawalAmount !== undefined) platformConfig.max_withdrawal_amount = configUpdates.limits.maxWithdrawalAmount;
        if (configUpdates.limits.maxDailyTransactions !== undefined) platformConfig.max_daily_transactions = configUpdates.limits.maxDailyTransactions;
        if (configUpdates.limits.minTransactionAmount !== undefined) platformConfig.min_transaction_amount = configUpdates.limits.minTransactionAmount;
      }
      
      if (configUpdates.fees) {
        if (configUpdates.fees.pixFee !== undefined) platformConfig.pix_fee = configUpdates.fees.pixFee;
        if (configUpdates.fees.boletoFee !== undefined) platformConfig.boleto_fee = configUpdates.fees.boletoFee;
        if (configUpdates.fees.cardFee !== undefined) platformConfig.card_fee = configUpdates.fees.cardFee;
        if (configUpdates.fees.withdrawalFee !== undefined) platformConfig.withdrawal_fee = configUpdates.fees.withdrawalFee;
      }
      
      if (configUpdates.enable_multi_account !== undefined) {
        platformConfig.enable_multi_account = configUpdates.enable_multi_account;
      }
      
      await this.updatePlatformConfig(platformConfig);
    } catch (error) {
      console.error('Erro ao atualizar config do app:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  },

  /**
   * Endpoint 34: Obter Personalização Visual (GET /functions/v1/personalization)
   * Propósito: Carregar o tema (cores, logos) da plataforma.
   */
  async getTheme() {
    try {
      const { data, error } = await supabase.functions.invoke('personalization', {
        method: 'GET',
      });
      if (error) throw error;
      // Retorna o primeiro item, pois deve haver apenas um registro de tema
      const typedData = data as any;
      return typedData.data[0]; 
    } catch (error) {
      console.error('Erro ao buscar tema:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  },

  /**
   * Endpoint 35: Atualizar Personalização Visual (Admin) (PUT /functions/v1/personalization)
   * Propósito: Salvar um novo tema visual.
   * themePayload é o objeto JSON completo com todas as cores, logos, etc.
   */
  async updateTheme(themePayload: any) {
    try {
      await supabase.functions.invoke('personalization', {
        method: 'PUT',
        body: themePayload,
      });
    } catch (error) {
      console.error('Erro ao atualizar tema:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  },

  /**
   * Endpoint 36: Aceitar Termos de Uso (PUT /functions/v1/configuracoes/acecitar-termos)
   * Propósito: Registrar que o usuário aceitou os termos.
   */
  async acceptTerms() {
    try {
      await supabase.functions.invoke('configuracoes/acecitar-termos', {
        method: 'PUT',
      });
    } catch (error) {
      console.error('Erro ao aceitar termos:', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  },

  /**
   * GET /functions/v1/config-companie-view
   */
  async getCompanyConfigView() {
    try {
      const { data, error } = await supabase.functions.invoke('config-companie-view', {
        method: 'GET',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar config view:', error);
      throw error;
    }
  },

  /**
   * GET /functions/v1/configuracoes/emails
   */
  async getEmailTemplates() {
    try {
      const { data, error } = await supabase.functions.invoke('configuracoes/emails', {
        method: 'GET',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar templates de email:', error);
      throw error;
    }
  },

  /**
   * PUT /functions/v1/configuracoes/emails
   */
  async updateEmailTemplate(templateData: any) {
    try {
      const { data, error } = await supabase.functions.invoke('configuracoes/emails', {
        method: 'PUT',
        body: templateData,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar template de email:', error);
      throw error;
    }
  },
}; 