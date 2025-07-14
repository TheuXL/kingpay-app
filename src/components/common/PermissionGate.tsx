import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

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
 * A component that conditionally renders content based on user permissions
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  permissionIds,
  requireAll = false,
  children,
  fallback = null,
}) => {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissions();

  // Handle the case where no permissions are required
  if (!permissionIds || permissionIds.length === 0) {
    return <>{children}</>;
  }

  // Handle the case with a single permission
  if (permissionIds.length === 1) {
    const hasAccess = hasPermission(permissionIds[0]);
    return <>{hasAccess ? children : fallback}</>;
  }

  // Handle the case with multiple permissions
  const hasAccess = requireAll 
    ? hasAllPermissions(permissionIds)
    : hasAnyPermission(permissionIds);

  return <>{hasAccess ? children : fallback}</>;
}; 