import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UsePermissionsReturnType {
  permissions: string[];
  loading: boolean;
  error: string | null;
  hasPermission: (permissionId: string) => boolean;
  hasAllPermissions: (permissionIds: string[]) => boolean;
  hasAnyPermission: (permissionIds: string[]) => boolean;
  refreshPermissions: () => Promise<void>;
}

/**
 * Hook to check and manage user permissions
 */
export function usePermissions(): UsePermissionsReturnType {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = useCallback(async () => {
    if (!user) {
      setPermissions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Replace this with an actual API call to fetch user permissions
      // Example: const response = await permissionService.getUserPermissions(user.id);
      
      // For now, we'll use mock data based on user.is_admin or role
      const mockPermissions = user.is_admin 
        ? ['admin', 'view_companies', 'manage_companies', 'view_withdrawals', 'manage_withdrawals', 'view_settings', 'manage_settings']
        : ['view_companies', 'view_withdrawals'];
      
      setPermissions(mockPermissions);
    } catch (err) {
      console.error('Failed to fetch permissions:', err);
      setError('Failed to fetch permissions');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load permissions when the user changes
  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  // Check if the user has a specific permission
  const hasPermission = useCallback(
    (permissionId: string): boolean => {
      if (!user) return false;
      if (user.is_admin) return true; // Admins have all permissions
      return permissions.includes(permissionId);
    },
    [user, permissions]
  );

  // Check if the user has all the specified permissions
  const hasAllPermissions = useCallback(
    (permissionIds: string[]): boolean => {
      if (!user) return false;
      if (user.is_admin) return true; // Admins have all permissions
      return permissionIds.every(id => permissions.includes(id));
    },
    [user, permissions]
  );

  // Check if the user has any of the specified permissions
  const hasAnyPermission = useCallback(
    (permissionIds: string[]): boolean => {
      if (!user) return false;
      if (user.is_admin) return true; // Admins have all permissions
      return permissionIds.some(id => permissions.includes(id));
    },
    [user, permissions]
  );

  return {
    permissions,
    loading,
    error,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    refreshPermissions: fetchPermissions,
  };
} 