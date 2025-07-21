import { ENV } from '../../../config/env';
import { supabaseClient } from '../../../config/supabaseClient';

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: {
    id: string;
    aud: string;
    role: string;
    email: string;
    email_confirmed_at: string;
    phone: string;
    confirmed_at: string;
    last_sign_in_at: string;
    app_metadata: any;
    user_metadata: any;
    identities: any[];
    created_at: string;
    updated_at: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  name?: string;
}

export class AuthApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = ENV.SUPABASE_URL;
  }

  /**
   * Gera token de autenticação
   * Endpoint: POST /auth/v1/token?grant_type=password
   * Endpoints 1-2 da documentação
   */
  async generateToken(payload: LoginPayload): Promise<{ success: boolean; data?: AuthTokenResponse; error?: string }> {
    try {
      console.log('🔐 Gerando token de autenticação via Edge Function...');
      
      const url = `${this.baseUrl}/auth/v1/token?grant_type=password`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': ENV.SUPABASE_ANON_KEY
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Erro na autenticação:', response.status, data);
        return {
          success: false,
          error: data.error_description || data.message || `HTTP error ${response.status}`
        };
      }

      console.log('✅ Token gerado com sucesso');
      console.log('🎫 Token válido até:', new Date(data.expires_at * 1000).toLocaleString());

      return {
        success: true,
        data
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('❌ Erro ao gerar token:', errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Cria nova conta de usuário
   * Endpoint: POST /auth/v1/signup
   * Endpoint 4 da documentação
   */
  async createAccount(payload: SignupPayload): Promise<{ success: boolean; data?: AuthTokenResponse; error?: string }> {
    try {
      console.log('🔐 Criando nova conta via Edge Function...');
      
      const url = `${this.baseUrl}/auth/v1/signup`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': ENV.SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          data: payload.name ? { full_name: payload.name } : {}
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Erro na criação da conta:', response.status, data);
        return {
          success: false,
          error: data.error_description || data.message || `HTTP error ${response.status}`
        };
      }

      console.log('✅ Conta criada com sucesso');

      return {
        success: true,
        data
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('❌ Erro ao criar conta:', errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Atualiza token no Supabase client
   * @param tokenData Dados do token obtidos da autenticação
   */
  async updateSupabaseSession(tokenData: AuthTokenResponse): Promise<boolean> {
    try {
      console.log('🔄 Atualizando sessão no Supabase client...');
      
      const { data, error } = await supabaseClient.auth.setSession({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token
      });

      if (error) {
        console.error('❌ Erro ao atualizar sessão:', error.message);
        return false;
      }

      console.log('✅ Sessão atualizada no Supabase client');
      return true;

    } catch (error) {
      console.error('❌ Erro ao atualizar sessão:', error);
      return false;
    }
  }

  /**
   * Faz login usando Edge Function e atualiza sessão
   * @param payload Dados de login
   */
  async loginWithEdgeFunction(payload: LoginPayload): Promise<{ success: boolean; data?: AuthTokenResponse; error?: string }> {
    try {
      // Primeiro, obter token via Edge Function
      const tokenResult = await this.generateToken(payload);
      
      if (!tokenResult.success || !tokenResult.data) {
        return {
          success: false,
          error: tokenResult.error || 'Erro ao gerar token'
        };
      }

      // Atualizar sessão no Supabase client
      const sessionUpdated = await this.updateSupabaseSession(tokenResult.data);
      
      if (!sessionUpdated) {
        console.warn('⚠️ Token obtido mas falha ao atualizar sessão local');
      }

      return {
        success: true,
        data: tokenResult.data
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('❌ Erro no login completo:', errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Faz signup usando Edge Function e atualiza sessão
   * @param payload Dados de cadastro
   */
  async signupWithEdgeFunction(payload: SignupPayload): Promise<{ success: boolean; data?: AuthTokenResponse; error?: string }> {
    try {
      // Primeiro, criar conta via Edge Function
      const signupResult = await this.createAccount(payload);
      
      if (!signupResult.success || !signupResult.data) {
        return {
          success: false,
          error: signupResult.error || 'Erro ao criar conta'
        };
      }

      // Atualizar sessão no Supabase client se houver dados de sessão
      if (signupResult.data.access_token) {
        const sessionUpdated = await this.updateSupabaseSession(signupResult.data);
        
        if (!sessionUpdated) {
          console.warn('⚠️ Conta criada mas falha ao atualizar sessão local');
        }
      }

      return {
        success: true,
        data: signupResult.data
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('❌ Erro no signup completo:', errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Verifica se o token está válido
   * @param token Token de acesso
   */
  isTokenValid(token: string, expiresAt: number): boolean {
    if (!token || !expiresAt) {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    const bufferTime = 300; // 5 minutos de buffer

    return expiresAt > (now + bufferTime);
  }

  /**
   * Força refresh da sessão se necessário
   */
  async refreshSessionIfNeeded(): Promise<{ success: boolean; refreshed: boolean; error?: string }> {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      
      if (!session) {
        return {
          success: false,
          refreshed: false,
          error: 'Nenhuma sessão ativa'
        };
      }

      // Verificar se o token ainda é válido
      if (this.isTokenValid(session.access_token, session.expires_at || 0)) {
        return {
          success: true,
          refreshed: false
        };
      }

      // Token expirado, tentar refresh
      console.log('🔄 Token expirado, fazendo refresh...');
      
      const { data, error } = await supabaseClient.auth.refreshSession();
      
      if (error) {
        console.error('❌ Erro ao fazer refresh:', error.message);
        return {
          success: false,
          refreshed: false,
          error: error.message
        };
      }

      console.log('✅ Sessão renovada com sucesso');
      return {
        success: true,
        refreshed: true
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('❌ Erro ao verificar/renovar sessão:', errorMessage);
      
      return {
        success: false,
        refreshed: false,
        error: errorMessage
      };
    }
  }

  /**
   * Verifica se há uma sessão válida e força refresh se necessário
   */
  async ensureValidSession(): Promise<boolean> {
    try {
      const refreshResult = await this.refreshSessionIfNeeded();
      
      if (!refreshResult.success) {
        console.error('❌ Não foi possível garantir sessão válida:', refreshResult.error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Erro ao garantir sessão válida:', error);
      return false;
    }
  }
}

export const authApiService = new AuthApiService(); 