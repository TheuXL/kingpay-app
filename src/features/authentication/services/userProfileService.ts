import { supabase } from '../../../config/supabaseClient';
import { logger } from '../../../utils/logger';

export interface UserProfile {
  id: string;
  fullname: string;
  email: string;
  company: string; // Corrigido de company_id para company
  // Adicione quaisquer outros campos que você espera do perfil
}

export interface Company {
    id: string;
    name: string;
    logo_url?: string;
    // Adicione outros campos da empresa
}

class UserProfileService {
  async getUserProfileAndCompany(userId: string): Promise<{ profile: UserProfile | null, company: Company | null }> {
    logger.system(`Buscando perfil e empresa para o usuário: ${userId}`);
    if (!userId) {
      logger.warn('Tentativa de buscar perfil sem userId.');
      return { profile: null, company: null };
    }

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('vb_cdz_gus_user_profile_tb')
        .select(
          `
          id,
          fullname,
          email,
          company
        `
        )
        .eq('id', userId)
        .single();

      if (profileError || !profileData) {
        logger.error('Erro ao buscar o perfil do usuário.', profileError || new Error('Nenhum dado de perfil retornado'));
        throw new Error('Não foi possível carregar o perfil do usuário.');
      }
      
      logger.success('Perfil do usuário encontrado.', { userId: profileData.id, companyId: profileData.company });
      
      let companyData: Company | null = null;
      if (profileData.company) {
        const { data: companyResult, error: companyError } = await supabase
            .from('vb_cdz_gus_companies_tb')
            .select('*')
            .eq('id', profileData.company)
            .single();

        if (companyError) {
            logger.error(`Erro ao buscar a empresa com id: ${profileData.company}`, companyError);
            // Decide-se não lançar erro, mas logar e retornar o perfil
        } else {
            companyData = companyResult as Company;
            logger.success('Empresa associada encontrada.', { companyId: companyData?.id });
        }
      }

      return { profile: profileData as UserProfile, company: companyData };
    } catch (error) {
      const e = error instanceof Error ? error : new Error(String(error));
      logger.error('Exceção no método getUserProfileAndCompany.', e);
      return { profile: null, company: null };
    }
  }
}

export const userProfileService = new UserProfileService(); 