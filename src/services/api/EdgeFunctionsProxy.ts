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
      // Obter sessão ativa
      const { data: { session } } = await supabase.auth.getSession();

      // Construir URL completa
      let url = `${ENV.SUPABASE_URL}/functions/v1/${endpoint}`;
      
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
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
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

      console.log(`🌐 Edge Function: ${method} ${endpoint}`);

      // Fazer requisição
      const response = await fetch(url, requestOptions);

      // Verificar resposta
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Edge Function error: ${response.status} ${errorText}`);
        
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

      console.log(`✅ Edge Function success: ${method} ${endpoint}`);

      return {
        success: true,
        data,
        status: response.status
      };

    } catch (error) {
      console.error(`❌ Edge Function error ${method} ${endpoint}:`, error);
      
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