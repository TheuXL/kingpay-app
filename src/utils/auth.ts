import { supabase } from '../lib/supabase';

export const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        throw new Error('Usuário não autenticado. A sessão é nula.');
    }
    return { 
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json' 
    };
}; 