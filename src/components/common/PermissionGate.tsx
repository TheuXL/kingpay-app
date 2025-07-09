import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';

interface PermissionGateProps {
  /**
   * The permission IDs required to access the content
   */
  permissionIds: string[];
  
  /**
   * If true, the user must have ALL the specified permissions
   * If false (default), the user must have ANY of the specified permissions
   */
  requireAll?: boolean;
  
  /**
   * Content to render if the user has the required permissions
   */
  children: React.ReactNode;
  
  /**
   * Optional content to render if the user does not have the required permissions
   */
  fallback?: React.ReactNode;
}

/**
 * A component that conditionally renders its children based on user permissions
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  permissionIds,
  requireAll = false,
  children,
  fallback = null,
}) => {
  const { hasAllPermissions, hasAnyPermission, loading } = usePermissions();
  
  // While loading permissions, don't render anything
  if (loading) {
    return null;
  }
  
  // Check if the user has the required permissions
  const hasAccess = requireAll
    ? hasAllPermissions(permissionIds)
    : hasAnyPermission(permissionIds);
  
  // Render the children if the user has access, otherwise render the fallback
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}; 