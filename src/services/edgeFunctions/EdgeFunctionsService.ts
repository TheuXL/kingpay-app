/**
 * 🌐 EDGE FUNCTIONS SERVICE - KINGPAY
 * ===================================
 * 
 * Serviço principal para Edge Functions do Supabase
 * - Gerenciamento de cache e fallbacks
 * - Múltiplas estratégias de requisição
 * - Sistema de retry automático
 */

import { ENV } from '../../config/env';
import { ApiResponse } from '../../types/api';
import { edgeFunctionsProxy } from '../api/EdgeFunctionsProxy';

// =================== INTERFACES ===================

export interface WalletData {
  id: string;
  user_id: string;
  company_id: string;
  balance: number;
  available_balance: number;
  pending_balance: number;
  currency: 'BRL' | 'USD';
  status: 'active' | 'blocked' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface DashboardData {
  total_transactions: number;
  total_amount: number;
  pending_amount: number;
  available_balance: number;
  approval_rate: number;
  period_start: string;
  period_end: string;
}

export interface TransactionData {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  customer_name: string;
  description: string;
}

export interface MovementData {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: string;
}

export interface PixKeyData {
  id: string;
  type: 'email' | 'phone' | 'cpf' | 'random';
  key: string;
  description: string;
  status: 'active' | 'pending' | 'inactive';
}

export interface PaymentLinkData {
  id: string;
  name: string;
  amount: number;
  status: 'active' | 'inactive';
  payment_methods: string[];
  created_at: string;
}

export interface TaxRateData {
  payment_method: string;
  installments: number;
  percentage: number;
  fixed_fee: number;
  total_fee: number;
}

// =================== CLASSE PRINCIPAL ===================

export class EdgeFunctionsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${ENV.SUPABASE_URL}/functions/v1`;
    console.log('🚀 EdgeFunctionsService configurado para:', this.baseUrl);
  }

  /**
   * Faz requisição autenticada para Edge Function usando o proxy robusto
   */
  async makeRequest<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
    body?: any,
    params?: Record<string, string>
  ): Promise<T> {
    console.log(`📡 ${method} ${endpoint} (via EdgeFunctionsProxy)`);

    // O proxy agora será responsável por obter o token
    const response = await edgeFunctionsProxy.request<T>(
      endpoint,
      method,
      body,
      params
    );

    if (!response.success) {
      throw new Error(response.error || 'Erro na requisição');
    }

    return response.data as T;
  }

  // =================== WALLET ===================

  /**
   * 💰 WALLET - GET /functions/v1/wallet
   */
  async getWallet(): Promise<ApiResponse<WalletData>> {
    console.log('💰 Carregando dados da carteira...');
    try {
      // O UserID será extraído do token no backend
      const data = await this.makeRequest<WalletData>('wallet');
      
      console.log('✅ Carteira carregada com sucesso');
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao carregar carteira:', error);
      throw error;
    }
  }

  // =================== DASHBOARD ===================

  /**
   * 📊 DASHBOARD - POST /functions/v1/dados-dashboard
   */
  async getDashboardData(params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<ApiResponse<DashboardData>> {
    console.log('📊 Carregando dados do dashboard...');

    try {
      const queryParams: Record<string, string> = {};
      if (params?.start_date) queryParams.start_date = params.start_date;
      if (params?.end_date) queryParams.end_date = params.end_date;

      const data = await this.makeRequest<DashboardData>(
        'dados-dashboard', 
        'POST', 
        undefined,
        queryParams
      );
      
      console.log('✅ Dashboard carregado com sucesso');
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao carregar dashboard:', error);
      throw error;
    }
  }

  // =================== TRANSAÇÕES ===================

  /**
   * 💳 TRANSAÇÕES - GET /functions/v1/transacoes
   */
  async getTransactions(params?: {
    limit?: number;
    offset?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    paymentMethod?: string;
  }): Promise<ApiResponse<TransactionData[]>> {
    console.log('💳 Carregando transações...');

    try {
      const queryParams: Record<string, string> = {};
      if (params?.limit) queryParams.limit = params.limit.toString();
      if (params?.offset) queryParams.offset = params.offset.toString();
      if (params?.status) queryParams.status = params.status;
      if (params?.startDate) queryParams.startDate = params.startDate;
      if (params?.endDate) queryParams.endDate = params.endDate;
      if (params?.paymentMethod) queryParams.paymentMethod = params.paymentMethod;

      const data = await this.makeRequest<TransactionData[]>(
        'transacoes', 
        'GET', 
        undefined,
        queryParams
      );
      
      console.log('✅ Transações carregadas com sucesso');
      return { success: true, data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('❌ Erro ao carregar transações:', error);
      throw error;
    }
  }

  // =================== EXTRATO ===================

  /**
   * 🏦 EXTRATO - GET /functions/v1/extrato/{userId}
   */
  async getMovements(params?: {
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<MovementData[]>> {
    console.log('🏦 Carregando extrato...');
    
    // O backend deve usar o user_id do token autenticado
    try {
      const queryParams: Record<string, string> = {};
      if (params?.limit) queryParams.limit = params.limit.toString();
      if (params?.offset) queryParams.offset = params.offset.toString();
      if (params?.startDate) queryParams.startDate = params.startDate;
      if (params?.endDate) queryParams.endDate = params.endDate;

      const data = await this.makeRequest<MovementData[]>(`extrato`, 'GET', undefined, queryParams);
      
      console.log('✅ Extrato carregado com sucesso');
      return { success: true, data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('❌ Erro ao carregar extrato:', error);
      throw error;
    }
  }

  // =================== CHAVES PIX ===================

  /**
   * 🔑 CHAVES PIX - GET /functions/v1/pix-key
   */
  async getPixKeys(params?: { 
    user_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<PixKeyData[]>> {
    console.log('🔑 Carregando chaves PIX...');
    
    // O backend deve usar o user_id do token autenticado
    try {
      const queryParams: Record<string, string> = { user_id: params?.user_id || '' };
      if (params?.limit) queryParams.limit = params.limit.toString();
      if (params?.offset) queryParams.offset = params.offset.toString();

      const data = await this.makeRequest<PixKeyData[]>(
        'pix-key', 
        'GET', 
        undefined,
        queryParams
      );
      
      console.log('✅ Chaves PIX carregadas com sucesso');
      return { success: true, data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('❌ Erro ao carregar chaves PIX:', error);
      throw error;
    }
  }

  // =================== LINKS DE PAGAMENTO ===================

  /**
   * 🔗 LINKS DE PAGAMENTO - GET /functions/v1/link-pagamentos
   */
  async getPaymentLinks(params?: { 
    company?: string;
    id?: string;
  }): Promise<ApiResponse<PaymentLinkData[]>> {
    console.log('🔗 Carregando links de pagamento...');
    
    try {
      const queryParams: Record<string, string> = {};
      if (params?.company) queryParams.company = params.company;
      if (params?.id) queryParams.id = params.id;

      const data = await this.makeRequest<PaymentLinkData[]>(
        'link-pagamentos', 
        'GET', 
        undefined,
        queryParams
      );
      
      console.log('✅ Links de pagamento carregados com sucesso');
      return { success: true, data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('❌ Erro ao carregar links de pagamento:', error);
      throw error;
    }
  }

  // =================== TAXAS ===================

  /**
   * 💰 TAXAS - POST /functions/v1/taxas
   */
  async getTaxRates(params: {
    company_id: string;
    valor: number;
    payment_method: string;
    parcelas?: number;
  }): Promise<ApiResponse<TaxRateData>> {
    console.log('💰 Calculando taxas...');

    try {
      const data = await this.makeRequest<TaxRateData>(
        'taxas', 
        'POST', 
        {
          company_id: params.company_id,
          valor: params.valor,
          payment_method: params.payment_method,
          parcelas: params.parcelas || 1
        }
      );
      
      console.log('✅ Taxas calculadas com sucesso');
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao calcular taxas:', error);
      throw error;
    }
  }

  // =================== ADMIN - SAQUES ===================

  /**
   * 💸 SAQUES - GET /functions/v1/saques
   */
  async getWithdrawals(params?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<ApiResponse<any[]>> {
    console.log('💸 Carregando saques...');

    try {
      const queryParams: Record<string, string> = {};
      if (params?.limit) queryParams.limit = params.limit.toString();
      if (params?.offset) queryParams.offset = params.offset.toString();
      if (params?.status) queryParams.status = params.status;

      const data = await this.makeRequest<any[]>(
        'saques', 
        'GET', 
        undefined,
        queryParams
      );
      
      console.log('✅ Saques carregados com sucesso');
      return { success: true, data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('❌ Erro ao carregar saques:', error);
      throw error;
    }
  }

  // =================== ADMIN - ANTECIPAÇÕES ===================

  /**
   * 🚀 ANTECIPAÇÕES - GET /functions/v1/antecipacoes/anticipations
   */
  async getAnticipations(params?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<ApiResponse<any[]>> {
    console.log('🚀 Carregando antecipações...');

    try {
      const queryParams: Record<string, string> = {};
      if (params?.limit) queryParams.limit = params.limit.toString();
      if (params?.offset) queryParams.offset = params.offset.toString();
      if (params?.status) queryParams.status = params.status;

      const data = await this.makeRequest<any[]>(
        'antecipacoes/anticipations', 
        'GET', 
        undefined,
        queryParams
      );
      
      console.log('✅ Antecipações carregadas com sucesso');
      return { success: true, data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('❌ Erro ao carregar antecipações:', error);
      throw error;
    }
  }

  // =================== ADMIN - EMPRESAS ===================

  /**
   * 🏢 EMPRESAS - GET /functions/v1/companies
   */
  async getCompanies(params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<any[]>> {
    console.log('🏢 Carregando empresas...');

    try {
      const queryParams: Record<string, string> = {};
      if (params?.status) queryParams.status = params.status;
      if (params?.limit) queryParams.limit = params.limit.toString();
      if (params?.offset) queryParams.offset = params.offset.toString();

      const data = await this.makeRequest<any[]>(
        'companies', 
        'GET', 
        undefined,
        queryParams
      );
      
      console.log('✅ Empresas carregadas com sucesso');
      return { success: true, data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('❌ Erro ao carregar empresas:', error);
      throw error;
    }
  }

  // =================== ADMIN - USUÁRIOS ===================

  /**
   * 👥 USUÁRIOS - GET /functions/v1/users
   */
  async getUsers(): Promise<ApiResponse<any[]>> {
    console.log('👥 Carregando usuários...');

    try {
      const data = await this.makeRequest<any[]>('users', 'GET');
      
      console.log('✅ Usuários carregados com sucesso');
      return { success: true, data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('❌ Erro ao carregar usuários:', error);
      throw error;
    }
  }

  // =================== TICKETS DE SUPORTE ===================

  /**
   * 🎫 CRIAR NOVO TICKET DE SUPORTE
   */
  async createTicket(ticketData: {
    subject: string;
    message: string;
    attachment_url?: string;
  }): Promise<ApiResponse<any>> {
    console.log('🎫 Criando novo ticket de suporte...');

    try {
      const payload = {
        action: "create_ticket",
        payload: {
          subject: ticketData.subject,
          message: ticketData.message,
          attachment_url: ticketData.attachment_url,
        }
      };

      const data = await this.makeRequest('support-tickets', 'POST', payload);
      
      console.log('✅ Ticket criado com sucesso');
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao criar ticket:', error);
      throw error;
    }
  }

  /**
   * 📋 LISTAR TICKETS DE SUPORTE
   */
  async listTickets(): Promise<ApiResponse<any[]>> {
    console.log('📋 Carregando lista de tickets...');

    try {
      const payload = {
        action: "list_tickets",
        payload: {}
      };

      const data = await this.makeRequest<any[]>('support-tickets', 'POST', payload);
      
      console.log('✅ Tickets carregados com sucesso');
      return { success: true, data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('❌ Erro ao listar tickets:', error);
      throw error;
    }
  }

  /**
   * 🎫 BUSCAR TICKET ESPECÍFICO
   */
  async getTicket(ticketId: string): Promise<ApiResponse<any>> {
    console.log('🎫 Carregando ticket específico...');

    try {
      const payload = {
        action: "get_ticket",
        payload: {
          ticket_id: ticketId
        }
      };

      const data = await this.makeRequest('support-tickets', 'POST', payload);
      
      console.log('✅ Ticket carregado com sucesso');
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao buscar ticket:', error);
      throw error;
    }
  }

  /**
   * 💬 BUSCAR MENSAGENS DO TICKET
   */
  async getTicketMessages(ticketId: string, page: number = 1, perPage: number = 20): Promise<ApiResponse<any[]>> {
    console.log('💬 Carregando mensagens do ticket...');

    try {
      const payload = {
        action: "get_messages",
        payload: {
          ticket_id: ticketId,
          page: page,
          per_page: perPage
        }
      };

      const data = await this.makeRequest<any[]>('support-tickets', 'POST', payload);
      
      console.log('✅ Mensagens do ticket carregadas com sucesso');
      return { success: true, data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('❌ Erro ao buscar mensagens do ticket:', error);
      throw error;
    }
  }

  /**
   * 💬 ENVIAR MENSAGEM PARA TICKET
   */
  async sendTicketMessage(messageData: {
    ticket_id: string;
    message: string;
    attachment_url?: string;
  }): Promise<ApiResponse<any>> {
    console.log('💬 Enviando mensagem para ticket...');

    try {
      const payload = {
        action: "send_message",
        payload: {
          ticket_id: messageData.ticket_id,
          message: messageData.message,
          attachment_url: messageData.attachment_url,
        }
      };

      const data = await this.makeRequest('support-tickets', 'POST', payload);
      
      console.log('✅ Mensagem enviada com sucesso');
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  /**
   * ✅ MARCAR MENSAGENS DO TICKET COMO LIDAS
   */
  async markTicketMessagesAsRead(ticketId: string): Promise<ApiResponse<any>> {
    console.log('✅ Marcando mensagens como lidas...');

    try {
      const payload = {
        action: "mark_message_read",
        payload: {
          ticket_id: ticketId
        }
      };

      const data = await this.makeRequest('support-tickets', 'POST', payload);
      
      console.log('✅ Mensagens marcadas como lidas');
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao marcar mensagens como lidas:', error);
      throw error;
    }
  }

  /**
   * 🔍 VERIFICAR MENSAGENS NÃO LIDAS
   */
  async checkUnreadMessages(): Promise<ApiResponse<any>> {
    console.log('🔍 Verificando mensagens não lidas...');

    try {
      const payload = {
        action: "check_unread_messages",
        payload: {}
      };

      const data = await this.makeRequest('support-tickets', 'POST', payload);
      
      console.log('✅ Verificação de mensagens não lidas concluída');
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao verificar mensagens não lidas:', error);
      throw error;
    }
  }

  /**
   * 📊 OBTER MÉTRICAS DOS TICKETS
   */
  async getTicketMetrics(): Promise<ApiResponse<any>> {
    console.log('📊 Carregando métricas dos tickets...');

    try {
      const payload = {
        action: "get_metrics",
        payload: {}
      };

      const data = await this.makeRequest('support-tickets', 'POST', payload);
      
      console.log('✅ Métricas carregadas com sucesso');
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao obter métricas:', error);
      throw error;
    }
  }

  // =================== UTILITÁRIOS ===================

  /**
   * 🔍 Verificar conectividade
   */
  async checkConnectivity(): Promise<boolean> {
    try {
      await this.makeRequest('', 'GET');
      return true;
    } catch (error) {
      console.warn('🚨 Edge Functions indisponíveis:', error);
      return false;
    }
  }

  /**
   * 🧪 Testar conectividade (alias para checkConnectivity)
   */
  async testConnectivity(): Promise<{success: boolean}> {
    try {
      const isConnected = await this.checkConnectivity();
      return { success: isConnected };
    } catch (error) {
      console.error('❌ Erro no teste de conectividade:', error);
      return { success: false };
    }
  }

  // A função getServiceStatus será removida pois dependia do authStore
}

// =================== INSTÂNCIA SINGLETON ===================

export const edgeFunctionsService = new EdgeFunctionsService();