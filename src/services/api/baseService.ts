/**
 * 🌐 BASE SERVICE - KINGPAY
 * =========================
 * 
 * Serviço base para comunicação real com Edge Functions do Supabase
 * - Apenas requisições reais à API
 * - Sem fallbacks ou dados mockados
 * - Autenticação automática com Bearer Token
 */

import { ENV } from '../../config/env';
import { supabase } from '../../lib/supabase';
import { ApiResponse } from '../../types/api';

export abstract class BaseService {
  protected baseUrl: string;
  protected apiKey: string;

  constructor() {
    this.baseUrl = ENV.SUPABASE_URL;
    this.apiKey = ENV.SUPABASE_ANON_KEY;
    
    // Log de inicialização para debug
    console.log(`🚀 BaseService inicializado:`, {
      baseUrl: this.baseUrl,
      hasApiKey: !!this.apiKey,
      service: this.constructor.name
    });
  }

  /**
   * 🚀 Método base para fazer requisições
   */
  protected async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
    body?: any,
    params?: Record<string, string | number | boolean>
  ): Promise<ApiResponse<T>> {
    try {
      // Obter sessão ativa
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('❌ Erro ao obter sessão:', sessionError);
        return {
          success: false,
          error: `Erro de autenticação: ${sessionError.message}`,
          status: 401
        };
      }

      // Construir URL completa
      let url = `${this.baseUrl}/functions/v1/${endpoint}`;
      
      // Adicionar query parameters para GET
      if (params && Object.keys(params).length > 0 && method === 'GET') {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        url = `${url}?${searchParams.toString()}`;
      }

      // Headers essenciais
      const headers: Record<string, string> = {
        'apikey': this.apiKey,
        'Content-Type': 'application/json',
      };

      // Adicionar Authorization se autenticado
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      } else {
        console.warn('⚠️ Fazendo requisição sem token de autenticação');
      }

      // Configurar requisição
      const requestOptions: RequestInit = {
        method,
        headers,
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-cache',
      };

      // Adicionar body se necessário
      if (body && method !== 'GET') {
        requestOptions.body = JSON.stringify(body);
      }

      // Logs detalhados para debug
      console.log(`🌐 API Request:`, {
        method,
        url,
        endpoint,
        hasAuth: !!session?.access_token,
        hasBody: !!body,
        service: this.constructor.name
      });

      // Fazer requisição
      const response = await fetch(url, requestOptions);

      // Log da resposta
      console.log(`📊 API Response:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        endpoint,
        service: this.constructor.name
      });

      // Verificar resposta
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error ${method} ${endpoint}:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          service: this.constructor.name
        });
        
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText || response.statusText}`,
          status: response.status
        };
      }

      // Processar dados da resposta
      const contentType = response.headers.get('content-type');
      let data: T;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text() as any;
      }

      console.log(`✅ API Success ${method} ${endpoint}:`, {
        hasData: !!data,
        dataType: typeof data,
        service: this.constructor.name
      });

      return {
        success: true,
        data,
        status: response.status
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      console.error(`❌ API Error ${method} ${endpoint}:`, {
        error: errorMessage,
        stack: errorStack,
        service: this.constructor.name
      });

      return {
        success: false,
        error: `Erro de requisição: ${errorMessage}`,
        status: 0
      };
    }
  }

  /**
   * 🔐 Verificar se o usuário está autenticado
   */
  protected async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session?.access_token;
    } catch (error) {
      console.error('❌ Erro ao verificar autenticação:', error);
      return false;
    }
  }

  /**
   * 🆔 Obter ID do usuário atual
   */
  protected async getCurrentUserId(): Promise<string | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.user?.id || null;
    } catch (error) {
      console.error('❌ Erro ao obter ID do usuário:', error);
      return null;
    }
  }

  /**
   * 🔄 Verificar se usuário está autenticado
   */
  protected async ensureAuthenticated(): Promise<boolean> {
    const isAuth = await this.isAuthenticated();
    
    if (!isAuth) {
      console.log('🔐 Usuário não autenticado. Login necessário.');
      return false;
    }
    
    return true;
  }

  /**
   * 🔄 GET Request
   */
  protected async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, 'GET', undefined, params);
  }

  /**
   * 📤 POST Request
   */
  protected async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, 'POST', body);
  }

  /**
   * 🔄 PUT Request
   */
  protected async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, 'PUT', body);
  }

  /**
   * 🔧 PATCH Request
   */
  protected async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, 'PATCH', body);
  }

  /**
   * 🗑️ DELETE Request
   */
  protected async delete<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, 'DELETE', body);
  }
} 