import { supabase } from './supabase';

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface UserPermissions {
  userId: string;
  permissions: string[];
}

/**
 * Service for handling user permissions
 */
export const permissionService = {
  /**
   * Get all available permissions
   */
  getAllPermissions: async (): Promise<Permission[]> => {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching permissions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return [];
    }
  },

  /**
   * Get permissions for a specific user
   */
  getUserPermissions: async (userId: string): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('permission_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user permissions:', error);
        return [];
      }

      return (data || []).map(item => item.permission_id);
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      return [];
    }
  },

  /**
   * Check if user has a specific permission
   */
  hasPermission: async (userId: string, permissionId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('permission_id')
        .eq('user_id', userId)
        .eq('permission_id', permissionId)
        .single();

      if (error) {
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  },

  /**
   * Update permissions for a user
   */
  updateUserPermissions: async (userId: string, permissions: string[]): Promise<boolean> => {
    try {
      // First, delete all existing permissions for the user
      const { error: deleteError } = await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Error deleting existing permissions:', deleteError);
        return false;
      }

      // Then insert the new permissions
      if (permissions.length > 0) {
        const permissionsToInsert = permissions.map(permissionId => ({
          user_id: userId,
          permission_id: permissionId
        }));

        const { error: insertError } = await supabase
          .from('user_permissions')
          .insert(permissionsToInsert);

        if (insertError) {
          console.error('Error inserting new permissions:', insertError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error updating user permissions:', error);
      return false;
    }
  }
}; 