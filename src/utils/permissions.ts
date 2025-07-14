import { supabase } from '../services/supabase';

/**
 * Verifica se um usuário tem uma determinada permissão
 * @param userId ID do usuário
 * @param permissionCode Código da permissão a ser verificada
 * @returns Promise<boolean> True se o usuário tem a permissão, false caso contrário
 */
export const hasPermission = async (userId?: string, permissionCode?: string): Promise<boolean> => {
  try {
    if (!userId || !permissionCode) {
      return false;
    }

    // Verificar se o usuário é um superadmin (tem todas as permissões)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Erro ao verificar se o usuário é admin:', userError);
      return false;
    }

    // Se o usuário for admin, tem todas as permissões
    if (userData?.is_admin) {
      return true;
    }

    // Verificar permissão específica
    const { data: permissionData, error: permissionError } = await supabase
      .from('user_permissions')
      .select('*')
      .eq('user_id', userId)
      .eq('permission_code', permissionCode)
      .single();

    if (permissionError) {
      // Se o erro for "No rows found", significa que o usuário não tem a permissão
      if (permissionError.code === 'PGRST116') {
        return false;
      }
      
      console.error('Erro ao verificar permissão:', permissionError);
      return false;
    }

    return !!permissionData;
  } catch (error) {
    console.error('Erro ao verificar permissão:', error);
    return false;
  }
};

/**
 * Verifica se um usuário tem múltiplas permissões (todas elas)
 * @param userId ID do usuário
 * @param permissionCodes Array de códigos de permissão a serem verificados
 * @returns Promise<boolean> True se o usuário tem todas as permissões, false caso contrário
 */
export const hasAllPermissions = async (userId?: string, permissionCodes?: string[]): Promise<boolean> => {
  try {
    if (!userId || !permissionCodes || permissionCodes.length === 0) {
      return false;
    }

    // Verificar cada permissão
    const results = await Promise.all(
      permissionCodes.map(code => hasPermission(userId, code))
    );

    // Retornar true somente se todas as permissões forem true
    return results.every(result => result === true);
  } catch (error) {
    console.error('Erro ao verificar múltiplas permissões:', error);
    return false;
  }
};

/**
 * Verifica se um usuário tem pelo menos uma das permissões especificadas
 * @param userId ID do usuário
 * @param permissionCodes Array de códigos de permissão a serem verificados
 * @returns Promise<boolean> True se o usuário tem pelo menos uma das permissões, false caso contrário
 */
export const hasAnyPermission = async (userId?: string, permissionCodes?: string[]): Promise<boolean> => {
  try {
    if (!userId || !permissionCodes || permissionCodes.length === 0) {
      return false;
    }

    // Verificar cada permissão
    const results = await Promise.all(
      permissionCodes.map(code => hasPermission(userId, code))
    );

    // Retornar true se pelo menos uma permissão for true
    return results.some(result => result === true);
  } catch (error) {
    console.error('Erro ao verificar múltiplas permissões:', error);
    return false;
  }
};

/**
 * Obtém todas as permissões de um usuário
 * @param userId ID do usuário
 * @returns Promise<string[]> Array com os códigos das permissões do usuário
 */
export const getUserPermissions = async (userId?: string): Promise<string[]> => {
  try {
    if (!userId) {
      return [];
    }

    // Verificar se o usuário é um superadmin (tem todas as permissões)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Erro ao verificar se o usuário é admin:', userError);
      return [];
    }

    // Se o usuário for admin, retornar uma lista com um código especial
    if (userData?.is_admin) {
      return ['*']; // Asterisco indica todas as permissões
    }

    // Obter todas as permissões do usuário
    const { data: permissionsData, error: permissionsError } = await supabase
      .from('user_permissions')
      .select('permission_code')
      .eq('user_id', userId);

    if (permissionsError) {
      console.error('Erro ao obter permissões do usuário:', permissionsError);
      return [];
    }

    // Extrair os códigos de permissão
    return permissionsData.map(item => item.permission_code);
  } catch (error) {
    console.error('Erro ao obter permissões do usuário:', error);
    return [];
  }
}; 