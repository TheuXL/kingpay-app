/**
 * 🔐 AUTH SERVICE - KINGPAY
 * =========================
 * 
 * Serviço de autenticação baseado nos endpoints 1-6 da documentação
 * - Endpoints 1-4: Autenticação básica (login, signup)
 * - Endpoints 5-6: Códigos de segurança (2FA)
 * - Usa API Key em vez de Bearer Token para auth inicial
 */

import { ENV } from '../../config/env';
import { supabaseClient } from '../../config/supabaseClient';
import { ApiResponse } from '../../types/api';

// =================== INTERFACES AUTH ===================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    email_confirmed_at?: string;
    created_at: string;
    updated_at: string;
  };
}

export interface ValidationCode {
  code: string;
  expires_at: string;
  created_at: string;
  is_used: boolean;
}

export interface SecurityCodePayload {
  code: string;
}

// =================== AUTH SERVICE ===================

export class AuthService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = ENV.SUPABASE_URL;
    this.apiKey = ENV.SUPABASE_ANON_KEY;
  }

  /**
   * 🚀 Fazer requisição com autenticação via API Key
   */
  private async authRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
    body?: any
  ): Promise<ApiResponse<T>> {
    try {
      const url = endpoint.startsWith('/auth/') 
        ? `${this.baseUrl}${endpoint}`
        : `${this.baseUrl}/functions/v1/${endpoint}`;

      const headers: Record<string, string> = {
        'apikey': this.apiKey,
        'Content-Type': 'application/json'
      };

      const requestOptions: RequestInit = {
        method,
        headers,
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-cache'
      };

      if (body && method !== 'GET') {
        requestOptions.body = JSON.stringify(body);
      }

      console.log(`🔐 Auth Request: ${method} ${endpoint}`);

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Auth Error: ${response.status} ${errorText}`);
        
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText || response.statusText}`,
          status: response.status
        };
      }

      const data = await response.json();

      console.log(`✅ Auth Success: ${method} ${endpoint}`);

      return {
        success: true,
        data,
        status: response.status
      };

    } catch (error) {
      console.error(`❌ Auth Error ${method} ${endpoint}:`, error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão',
        status: 500
      };
    }
  }

  /**
   * 🔑 Endpoint 1: POST /auth/v1/token?grant_type=password - Gerar Token
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthTokenResponse>> {
    return this.authRequest<AuthTokenResponse>(
      '/auth/v1/token?grant_type=password',
      'POST',
      credentials
    );
  }

  /**
   * 🆕 Endpoint 4: POST /auth/v1/signup - Criar Conta
   */
  async signup(data: SignupData): Promise<ApiResponse<AuthTokenResponse>> {
    return this.authRequest<AuthTokenResponse>(
      '/auth/v1/signup',
      'POST',
      data
    );
  }

  /**
   * 🔒 Endpoint 5: POST /functions/v1/validation-codes/generate - Gerar Código
   */
  async generateSecurityCode(): Promise<ApiResponse<ValidationCode>> {
    // Este endpoint precisa de Bearer Token, então usa o Supabase client
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      
      if (!session?.access_token) {
        return {
          success: false,
          error: 'Token de autenticação não encontrado',
          status: 401
        };
      }

      const response = await fetch(`${this.baseUrl}/functions/v1/validation-codes/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText}`,
          status: response.status
        };
      }

      const data = await response.json();
      
      return {
        success: true,
        data,
        status: response.status
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao gerar código',
        status: 500
      };
    }
  }

  /**
   * ✅ Endpoint 6: POST /functions/v1/validation-codes/validate - Validar Código
   */
  async validateSecurityCode(payload: SecurityCodePayload): Promise<ApiResponse<{ isValid: boolean }>> {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      
      if (!session?.access_token) {
        return {
          success: false,
          error: 'Token de autenticação não encontrado',
          status: 401
        };
      }

      const response = await fetch(`${this.baseUrl}/functions/v1/validation-codes/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText}`,
          status: response.status
        };
      }

      const data = await response.json();
      
      return {
        success: true,
        data,
        status: response.status
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao validar código',
        status: 500
      };
    }
  }

  /**
   * 🚪 Logout usando Supabase
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabaseClient.auth.signOut();
      
      if (error) {
        return {
          success: false,
          error: error.message,
          status: 400
        };
      }

      return {
        success: true,
        status: 200
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao fazer logout',
        status: 500
      };
    }
  }

  /**
   * 🔄 Refresh Token
   */
  async refreshToken(): Promise<ApiResponse<AuthTokenResponse>> {
    try {
      const { data, error } = await supabaseClient.auth.refreshSession();
      
      if (error || !data.session) {
        return {
          success: false,
          error: error?.message || 'Erro ao renovar token',
          status: 400
        };
      }

      return {
        success: true,
        data: {
          access_token: data.session.access_token,
          token_type: 'bearer',
          expires_in: data.session.expires_in || 3600,
          refresh_token: data.session.refresh_token,
          user: data.session.user
        } as AuthTokenResponse,
        status: 200
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao renovar token',
        status: 500
      };
    }
  }

  /**
   * 👤 Obter usuário atual
   */
  async getCurrentUser(): Promise<ApiResponse<any>> {
    try {
      const { data: { user }, error } = await supabaseClient.auth.getUser();
      
      if (error || !user) {
        return {
          success: false,
          error: error?.message || 'Usuário não encontrado',
          status: 401
        };
      }

      return {
        success: true,
        data: user,
        status: 200
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao obter usuário',
        status: 500
      };
    }
  }
}

export const authService = new AuthService(); 