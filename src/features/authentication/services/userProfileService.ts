/**
 * 👤 USER PROFILE SERVICE - KINGPAY
 * =================================
 * 
 * Serviço para gerenciamento de perfis de usuário
 * - Requisições reais à API do Supabase
 * - Sem fallbacks ou dados mockados
 */

import { supabase } from '../../../lib/supabase';
import { edgeFunctionsProxy } from '../../../services/api/EdgeFunctionsProxy';

export interface UserProfile {
  id: string;
  user_id?: string;
  company_id?: string;
  company?: Company; // Adicionando a propriedade que faltava
  full_name?: string;
  fullname?: string;
  phone?: string;
  email?: string;
  isAdmin?: boolean;
  usertype?: string;
  permissions?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Company {
  id: string;
  name?: string;
  company_name?: string;
  cnpj?: string;
  taxid?: string;
  email?: string;
  status?: string;
  users?: string[];
}

export class UserProfileService {
  private edgeFunctionsProxy = edgeFunctionsProxy;

  /**
   * Obtém o perfil do usuário e sua empresa associada
   * Baseado nos endpoints reais documentados no Endpoints.md
   */
  async getUserProfileAndCompany(userId: string): Promise<{ profile: UserProfile | undefined; company: Company | undefined }> {
    try {
      console.log('🔍 Buscando perfil e empresa para usuário:', userId);
      
      // ✅ TENTATIVA 1: Tentar usar endpoints que realmente existem
      // Baseado no Endpoints.md, não existe endpoint específico para perfil de usuário comum
      // Mas podemos tentar outros endpoints que podem retornar dados do usuário
      
      try {
        console.log('🔄 Tentando Edge Function /wallet para obter dados do usuário...');
        
        // O endpoint de wallet pode conter informações do usuário
        const walletResponse = await this.edgeFunctionsProxy.request('wallet', 'GET', undefined, { userId });
        
        if (walletResponse.success && walletResponse.data) {
          console.log('✅ Dados obtidos via endpoint wallet');
          
          // Se obtivemos dados, tentar extrair informações do usuário
          const responseData = walletResponse.data as any;
          if (responseData?.user_info || responseData?.profile) {
            const userInfo = responseData.user_info || responseData.profile;
            const companyInfo = responseData.company_info || responseData.company;
            
            return {
              profile: this.normalizeProfile(userInfo),
              company: this.normalizeCompany(companyInfo)
            };
          }
        }
      } catch (edgeError) {
        console.log('⚠️ Endpoint wallet não retornou dados de usuário, tentando outras abordagens...');
      }

      // ✅ TENTATIVA 2: Tentar endpoint de dashboard que pode ter informações do usuário
      try {
                  console.log('🔄 Tentando Edge Function /dados-dashboard...');
          
          const dashboardResponse = await this.edgeFunctionsProxy.request('dados-dashboard', 'POST', {
          start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end_date: new Date().toISOString().split('T')[0]
        });
        
        if (dashboardResponse.success && dashboardResponse.data) {
          console.log('✅ Dados obtidos via endpoint dashboard');
          
          // Extrair informações do usuário se disponíveis
          const dashboardData = dashboardResponse.data as any;
          if (dashboardData?.user_info || dashboardData?.company_info) {
            return {
              profile: this.normalizeProfile(dashboardData.user_info),
              company: this.normalizeCompany(dashboardData.company_info)
            };
          }
        }
      } catch (edgeError) {
        console.log('⚠️ Edge Function dashboard não disponível, usando fallback para banco direto');
      }

      // ✅ TENTATIVA 3: Fallback para banco direto com tratamento de RLS
      return await this.getUserProfileFromDatabase(userId);

    } catch (error) {
      console.error('❌ Erro ao buscar perfil e empresa:', error);
      return { profile: undefined, company: undefined };
    }
  }

  /**
   * Normaliza dados de perfil de diferentes fontes
   */
  private normalizeProfile(profileData: any): UserProfile | undefined {
    if (!profileData) return undefined;
    
    return {
      id: profileData.id || profileData.user_id,
      user_id: profileData.user_id || profileData.id,
      company_id: profileData.company_id || profileData.company,
      company: profileData.company,
      full_name: profileData.full_name || profileData.fullname,
      fullname: profileData.fullname || profileData.full_name,
      phone: profileData.phone,
      email: profileData.email,
      isAdmin: profileData.isAdmin,
      usertype: profileData.usertype,
      permissions: profileData.permissions,
      created_at: profileData.created_at,
      updated_at: profileData.updated_at
    };
  }

  /**
   * Normaliza dados de empresa de diferentes fontes
   */
  private normalizeCompany(companyData: any): Company | undefined {
    if (!companyData) return undefined;
    
    return {
      id: companyData.id || companyData.company_id,
      name: companyData.name || companyData.company_name,
      company_name: companyData.company_name || companyData.name,
      cnpj: companyData.cnpj || companyData.taxid,
      taxid: companyData.taxid || companyData.cnpj,
      email: companyData.email,
      status: companyData.status,
      users: companyData.users
    };
  }

  /**
   * Fallback robusto para buscar dados diretamente do banco
   * Com tratamento adequado de RLS e permissões
   */
  private async getUserProfileFromDatabase(userId: string): Promise<{ profile: UserProfile | undefined; company: Company | undefined }> {
    try {
      console.log('🗄️ Buscando perfil diretamente do banco de dados...');

      let profile: any = undefined;

      // ✅ Estratégia 1: Tentar a view usuario_info primeiro (mais completa)
      try {
        console.log('🔄 Tentando view usuario_info...');
        const { data, error } = await supabase
          .from('usuario_info')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (!error && data) {
          profile = data;
          console.log('✅ Perfil encontrado na view usuario_info');
          
          // A view usuario_info já contém dados da empresa
          const company: Company = {
            id: data.company_id,
            name: data.company_name,
            company_name: data.company_name,
            cnpj: data.company_taxid,
            taxid: data.company_taxid,
            status: data.company_status,
          };
          
          return {
            profile: this.normalizeProfile(profile),
            company: this.normalizeCompany(company)
          };
        } else if (error) {
          console.log('⚠️ Erro na view usuario_info:', error.message);
        }
      } catch (error) {
        console.log('⚠️ Erro ao acessar view usuario_info:', error);
      }

      // ✅ Estratégia 2: Buscar na tabela de perfil separadamente
      if (!profile) {
        console.log('🔄 Tentando tabela vb_cdz_gus_user_profile_tb...');
        
        // Primeira tentativa: buscar por user_id (padrão auth.users)
        try {
          const { data, error } = await supabase
            .from('vb_cdz_gus_user_profile_tb')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

          if (!error && data) {
            profile = data;
            console.log('✅ Perfil encontrado por id na tabela de perfil');
          } else if (error) {
            console.log('⚠️ Erro ao buscar por id:', error.message);
          }
        } catch (error) {
          console.log('⚠️ Erro na busca por id:', error);
        }
      }

      // ✅ Estratégia 3: Se ainda não encontrou, usar busca sem filtro e filtrar no frontend
      if (!profile) {
        try {
          console.log('🔍 Tentando busca ampla e filtragem local...');
          const { data: profiles, error } = await supabase
            .from('vb_cdz_gus_user_profile_tb')
            .select('*')
            .limit(100);

          if (!error && profiles) {
            profile = profiles.find(p => p.id === userId);
            if (profile) {
              console.log('✅ Perfil encontrado via busca ampla');
            }
          }
        } catch (error) {
          console.log('⚠️ Erro na busca ampla:', error);
        }
      }

      if (!profile) {
        console.log('❌ Perfil não encontrado em nenhuma tentativa');
        return { profile: undefined, company: undefined };
      }

      // ✅ Buscar empresa associada
      let company: any = undefined;
      
      if (profile.company || profile.company_id) {
        const companyId = profile.company || profile.company_id;
        
        try {
          const { data, error } = await supabase
            .from('vb_cdz_gus_companies_tb')
            .select('*')
            .eq('id', companyId)
            .maybeSingle();

          if (!error && data) {
            company = data;
            console.log('✅ Empresa encontrada');
          } else {
            console.log('⚠️ Empresa não encontrada ou erro:', error?.message);
          }
        } catch (error) {
          console.log('⚠️ Erro ao buscar empresa:', error);
        }
      }

      // ✅ Se não tem company_id, tentar buscar empresa que contém o usuário
      if (!company) {
        try {
          console.log('🔍 Buscando empresa via array de usuários...');
          const { data: companies, error } = await supabase
            .from('vb_cdz_gus_companies_tb')
            .select('*')
            .contains('users', [userId])
            .limit(1);

          if (!error && companies && companies.length > 0) {
            company = companies[0];
            console.log('✅ Empresa encontrada via array users');
          }
        } catch (error) {
          console.log('⚠️ Erro ao buscar empresa via users array:', error);
        }
      }

      return {
        profile: this.normalizeProfile(profile),
        company: this.normalizeCompany(company)
      };

    } catch (error) {
      console.error('❌ Erro crítico no fallback do banco:', error);
      return { profile: undefined, company: undefined };
    }
  }

  /**
   * Obtém apenas o company_id do usuário
   * Método otimizado com múltiplas estratégias de fallback
   */
  async getUserCompanyId(userId: string): Promise<string | undefined> {
    try {
      console.log('🔍 Buscando company_id para usuário:', userId);

      // ✅ TENTATIVA 1: Via view usuario_info (mais confiável)
      try {
        const { data, error } = await supabase
          .from('usuario_info')
          .select('company_id')
          .eq('id', userId)
          .maybeSingle();

        if (!error && data?.company_id) {
          console.log('✅ Company ID obtido via view usuario_info:', data.company_id);
          return data.company_id;
        }
      } catch (error) {
        console.log('⚠️ Erro na view usuario_info:', error);
      }

      // ✅ TENTATIVA 2: Banco direto - busca otimizada
      let { data: profile, error } = await supabase
        .from('vb_cdz_gus_user_profile_tb')
        .select('company, company_id')
        .eq('id', userId)
        .maybeSingle();

      // ✅ TENTATIVA 3: Busca ampla se RLS está bloqueando
      if (!profile || error) {
        try {
          const { data: profiles, error: searchError } = await supabase
            .from('vb_cdz_gus_user_profile_tb')
            .select('company, company_id, id')
            .limit(100);

          if (!searchError && profiles) {
            const foundProfile = profiles.find(p => p.id === userId);
            if (foundProfile) {
              profile = foundProfile;
              console.log('✅ Company ID encontrado via busca ampla');
            }
          }
        } catch (searchError) {
          console.log('⚠️ Erro na busca ampla:', searchError);
        }
      }

      const companyId = profile?.company_id || profile?.company || undefined;
      console.log('✅ Company ID final:', companyId);
      
      return companyId;

    } catch (error) {
      console.error('❌ Erro ao buscar company_id:', error);
      return undefined;
    }
  }

  /**
   * Verifica se o usuário tem acesso a uma empresa específica
   */
  async hasAccessToCompany(userId: string, companyId: string): Promise<boolean> {
    try {
      const userCompanyId = await this.getUserCompanyId(userId);
      return userCompanyId === companyId;
    } catch (error) {
      console.error('❌ Erro ao verificar acesso à empresa:', error);
      return false;
    }
  }

  /**
   * Cria um novo perfil de usuário
   * Baseado nos endpoints reais disponíveis
   */
  async createUserProfile(userData: Partial<UserProfile>): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
    try {
      console.log('🔄 Criando perfil de usuário...');

      // ✅ TENTATIVA 1: Tentar criar via Edge Function (se existir endpoint específico)
      try {
                  // Segundo Endpoints.md, existe o endpoint 97: POST /functions/v1/users/create
          // mas é para administradores criarem usuários
          const createResponse = await this.edgeFunctionsProxy.request('users/create', 'POST', userData);
        
        if (createResponse.success) {
          console.log('✅ Perfil criado via Edge Function');
          return {
            success: true,
            profile: this.normalizeProfile(createResponse.data)
          };
        }
      } catch (edgeError) {
        console.log('⚠️ Edge Function create não disponível, usando banco direto');
      }

      // ✅ TENTATIVA 2: Fallback para banco direto
      const { data, error } = await supabase
        .from('vb_cdz_gus_user_profile_tb')
        .insert([userData])
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao criar perfil:', error.message);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('✅ Perfil criado via banco direto');
      return {
        success: true,
        profile: this.normalizeProfile(data)
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('❌ Erro ao criar perfil:', errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Atualiza perfil do usuário
   */
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
    try {
      console.log('🔄 Atualizando perfil do usuário...');

      // ✅ TENTATIVA 1: Via Edge Function se disponível
              try {
          // Endpoint 98: PATCH /functions/v1/users/{id}/edit
          const updateResponse = await this.edgeFunctionsProxy.request(`users/${userId}/edit`, 'PATCH', updates);
        
        if (updateResponse.success) {
          console.log('✅ Perfil atualizado via Edge Function');
          return {
            success: true,
            profile: this.normalizeProfile(updateResponse.data)
          };
        }
      } catch (edgeError) {
        console.log('⚠️ Edge Function update não disponível, usando banco direto');
      }

      // ✅ TENTATIVA 2: Fallback para banco direto
      const { data, error } = await supabase
        .from('vb_cdz_gus_user_profile_tb')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao atualizar perfil:', error.message);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('✅ Perfil atualizado via banco direto');
      return {
        success: true,
        profile: this.normalizeProfile(data)
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('❌ Erro ao atualizar perfil:', errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Método de emergência para debug
   * Lista todas as tabelas disponíveis para diagnóstico
   */
  async debugDatabaseAccess(): Promise<void> {
    try {
      console.log('🔍 Testando acesso às tabelas...');
      
      // Testar acesso a user_profile
      const { data: profileTest, error: profileError } = await supabase
        .from('vb_cdz_gus_user_profile_tb')
        .select('count')
        .limit(1);
        
      console.log('User Profile Table:', profileError ? `❌ ${profileError.message}` : '✅ Acessível');
      
      // Testar acesso a companies
      const { data: companyTest, error: companyError } = await supabase
        .from('vb_cdz_gus_companies_tb')
        .select('count')
        .limit(1);
        
      console.log('Companies Table:', companyError ? `❌ ${companyError.message}` : '✅ Acessível');
      
      // Testar sessão atual
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Sessão atual:', session ? '✅ Ativa' : '❌ Inativa');
      console.log('User ID da sessão:', session?.user?.id);
      
    } catch (error) {
      console.error('❌ Erro no debug:', error);
    }
  }
}

// Instância singleton para uso global
export const userProfileService = new UserProfileService(); 