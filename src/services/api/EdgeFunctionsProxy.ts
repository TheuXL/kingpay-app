/**
 * 🌐 EDGE FUNCTIONS PROXY - KINGPAY
 * =================================
 * 
 * Proxy simplificado para Edge Functions do Supabase
 * - Apenas requisições reais à API
 * - Sem fallbacks ou dados mockados
 * - Comunicação direta com Supabase
 */

import { ENV } from '@/config/env';
import { logger } from '@/utils/logger';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string | null;
  status?: number;
}

class EdgeFunctionsProxy {
  private getAccessToken: (() => Promise<string | null>) | null = null;
  private getUserId: (() => string | null) | null = null;
  private getApiKey: (() => string | null) | null = null;

  public setAccessTokenGetter(getter: () => Promise<string | null>) {
    this.getAccessToken = getter;
    logger.system('AccessTokenGetter configurado no EdgeFunctionsProxy');
  }

  public setUserIdGetter(getter: () => string | null) {
    this.getUserId = getter;
  }

  public setApiKeyGetter(getter: () => string | null) {
    this.getApiKey = getter;
  }

  public async invoke(
    endpoint: string,
    method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE',
    body?: any
  ) {
    const startTime = Date.now();
    const userId = this.getUserId ? this.getUserId() : undefined;
    const requestId = logger.apiRequest(method, endpoint, {}, body, userId || undefined);

    const accessToken = this.getAccessToken ? await this.getAccessToken() : null;
    const apiKey = this.getApiKey ? this.getApiKey() : null;
    
    let url: string;
    if (endpoint.startsWith('auth/')) {
        url = `${ENV.SUPABASE_URL}/${endpoint}`;
    } else {
        url = `${ENV.SUPABASE_URL}/functions/v1/${endpoint}`;
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    // A apikey é geralmente para o Supabase Auth, não para as functions
    if (apiKey && endpoint.startsWith('auth/')) {
      headers['apikey'] = apiKey;
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }
    
    try {
      const response = await fetch(url, options);
      const duration = Date.now() - startTime;
      const responseBody = await response.text();
      const data = responseBody ? JSON.parse(responseBody) : null;

      logger.apiResponse(requestId, response.status, data, duration, userId || undefined);

      if (!response.ok) {
        throw new Error(data?.message || `Erro na requisição para ${endpoint}`);
      }
      
      return data;
    } catch (error) {
      const duration = Date.now() - startTime;
      const e = error instanceof Error ? error : new Error(String(error));
      logger.error(`Falha na requisição para ${endpoint}`, {
          requestId,
          duration,
          error: e.message,
          stack: e.stack,
      }, userId || undefined);
      throw error;
    }
  }
}

export const edgeFunctionsProxy = new EdgeFunctionsProxy(); 