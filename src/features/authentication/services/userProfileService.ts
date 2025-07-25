import { supabase } from "../../../config/supabaseClient";

export interface UserProfile {
    id: string;
    full_name: string;
    company_id: string;
    // ... outros campos do perfil
}

export interface Company {
    id: string;
    name: string;
    taxid: string; // CNPJ
    // ... outros campos da empresa
}

class UserProfileService {
    /**
     * Obtém o perfil do usuário e os dados da empresa associada.
     */
    async getUserProfileAndCompany(userId: string): Promise<{ profile: UserProfile | null, company: Company | null }> {
        if (!userId) {
            return { profile: null, company: null };
        }

        try {
            // 1. Buscar o perfil do usuário
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (profileError) {
                console.error('Erro ao buscar perfil:', profileError);
                throw new Error('Não foi possível carregar o perfil do usuário.');
            }

            if (!profile || !profile.company_id) {
                return { profile, company: null };
            }

            // 2. Buscar os dados da empresa
            const { data: company, error: companyError } = await supabase
                .from('companies')
                .select('*')
                .eq('id', profile.company_id)
                .single();

            if (companyError) {
                console.error('Erro ao buscar empresa:', companyError);
                // Retorna o perfil mesmo que a empresa não seja encontrada
                return { profile, company: null };
            }

            return { profile, company };

        } catch (error) {
            console.error('Erro no serviço de perfil de usuário:', error);
            return { profile: null, company: null };
        }
    }
}

export const userProfileService = new UserProfileService(); 