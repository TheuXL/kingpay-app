import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { permissionService } from '@/services/permissionService';

export function usePermissions() {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = useCallback(async () => {
    if (!user) {
      setPermissions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userPermissions = await permissionService.getUserPermissions(user.id);
      setPermissions(userPermissions);
    } catch (error) {
      console.error('Error fetching user permissions:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const hasPermission = useCallback(
    (permissionId: string): boolean => {
      return permissions.includes(permissionId);
    },
    [permissions]
  );

  const hasAnyPermission = useCallback(
    (permissionIds: string[]): boolean => {
      return permissionIds.some(id => permissions.includes(id));
    },
    [permissions]
  );

  const hasAllPermissions = useCallback(
    (permissionIds: string[]): boolean => {
      return permissionIds.every(id => permissions.includes(id));
    },
    [permissions]
  );

  const refreshPermissions = useCallback(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return {
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refreshPermissions,
  };
} 