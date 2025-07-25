/**
 * 🌐 EDGE FUNCTIONS PROXY - KINGPAY
 * =================================
 * 
 * Proxy simplificado para Edge Functions do Supabase
 * - Apenas requisições reais à API
 * - Sem fallbacks ou dados mockados
 * - Comunicação direta com Supabase
 */

import { ENV } from '../../config/env';
import { supabase } from '../../lib/supabase';
import type { ApiResponse } from '../../types/api';

export type { ApiResponse };

// Função para obter o access_token do contexto
let getAccessToken: (() => string | null) | null = null;

export const setAccessTokenGetter = (getter: () => string | null) => {
  getAccessToken = getter;
};

export class EdgeFunctionsProxy {

  constructor() {
    // Configurações agora vêm do cliente centralizado Supabase
  }

  /**
   * 🚀 Fazer requisição direta ao Edge Function
   */
  async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
    body?: any,
    params?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    try {
      // Obter access_token do contexto de autenticação
      let accessToken: string | null = null;
      
      if (getAccessToken) {
        accessToken = getAccessToken();
      } else {
        // Fallback para sessão do Supabase
        const { data: { session } } = await supabase.auth.getSession();
        accessToken = session?.access_token || null;
      }

      // Construir URL base correta
      const isAuthEndpoint = endpoint.startsWith('token');
      const baseUrl = isAuthEndpoint ? `${ENV.SUPABASE_URL}/auth/v1/` : `${ENV.SUPABASE_URL}/functions/v1/`;
      let url = `${baseUrl}${endpoint}`;
      
      // Adicionar query parameters para GET
      if (params && Object.keys(params).length > 0 && method === 'GET') {
        const queryString = new URLSearchParams(params).toString();
        url = `${url}?${queryString}`;
      }

      // Headers essenciais
      const headers: Record<string, string> = {
        'apikey': ENV.SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      };

      // Adicionar Authorization se autenticado
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
        console.log('🔑 Usando access_token para autenticação');
      } else {
        console.log('⚠️ Nenhum access_token disponível');
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

      console.log(`\n\n--- 🚀 [API Request] 🚀 ---`);
      console.log(`[${method}] ${url}`);
      if (body && method !== 'GET') {
        console.log(`[Payload]:`, JSON.stringify(body, null, 2));
      }
      console.log(`[Auth]: ${accessToken ? 'Bearer Token' : 'No Auth'}`);
      console.log(`-------------------------\n`);

      // Fazer requisição
      const response = await fetch(url, requestOptions);

      // Verificar resposta
      if (!response.ok) {
        const errorText = await response.text();
        
        console.log(`\n\n--- ❌ [API Error] ❌ ---`);
        console.log(`[${method}] ${url} - Status: ${response.status}`);
        try {
          // Tenta formatar o erro como JSON para melhor leitura
          console.log(`[Error Body]:`, JSON.stringify(JSON.parse(errorText), null, 2));
        } catch {
          console.log(`[Error Body]:`, errorText);
        }
        console.log(`-----------------------\n`);

        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText || response.statusText}`,
          status: response.status
        };
      }

      // Processar dados da resposta
      const contentType = response.headers.get('content-type');
      let data: any;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textData = await response.text();
        data = textData ? { message: textData } : {};
      }

      console.log(`\n\n--- ✅ [API Response] ✅ ---`);
      console.log(`[${method}] ${url} - Status: ${response.status}`);
      console.log(`[Data]:`, JSON.stringify(data, null, 2));
      console.log(`--------------------------\n`);

      return {
        success: true,
        data,
        status: response.status
      };

    } catch (error) {
      const errorText = error instanceof Error ? error.message : 'Erro de conexão';
      console.log(`\n\n--- ❌ [Network Error] ❌ ---`);
      console.log(`[${method}] /${endpoint}`);
      console.log(`[Error]: ${errorText}`);
      console.log(`---------------------------\n`);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão',
        status: 500
      };
    }
  }

  /**
   * 🔄 GET Request
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'GET', undefined, params);
  }

  /**
   * 📤 POST Request
   */
  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'POST', body);
  }

  /**
   * 🔄 PUT Request
   */
  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PUT', body);
  }

  /**
   * 🔧 PATCH Request
   */
  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PATCH', body);
  }

  /**
   * 🗑️ DELETE Request
   */
  async delete<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'DELETE', body);
  }
}

export const edgeFunctionsProxy = new EdgeFunctionsProxy(); 