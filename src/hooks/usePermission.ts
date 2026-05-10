// ============================================================
// usePermission Hook — Role-Based Access Control
// ============================================================

import { useMemo } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { USER_TYPES } from '@/constants';

/**
 * Hook to check permissions of the currently authenticated user.
 *
 * Example:
 *   const { hasPermission, hasAnyPermission, isAdmin, isSeller, isBuyer } = usePermission();
 *
 *   if (hasPermission('products:write')) { ... }
 *   if (isSeller) { ... }
 */
export function usePermission() {
  const user = useAuthStore((state) => state.user);

  /** All unique permission names across all roles */
  const permissions = useMemo<string[]>(() => {
    if (!user?.roles) return [];
    const set = new Set<string>();
    user.roles.forEach((role) => {
      role.permissions?.forEach((perm) => {
        set.add(perm.permission_name);
      });
    });
    return Array.from(set);
  }, [user]);

  /** All role names the user holds */
  const roleNames = useMemo<string[]>(() => {
    if (!user?.roles) return [];
    return user.roles.map((r) => r.role_name);
  }, [user]);

  /** Check if user has a specific permission */
  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  /** Check if user has ANY of the given permissions */
  const hasAnyPermission = (perms: string[]): boolean => {
    return perms.some((p) => permissions.includes(p));
  };

  /** Check if user has ALL of the given permissions */
  const hasAllPermissions = (perms: string[]): boolean => {
    return perms.every((p) => permissions.includes(p));
  };

  /** Check if user has a specific role */
  const hasRole = (roleName: string): boolean => {
    return roleNames.includes(roleName);
  };

  /** Shorthand: is the user an Admin? */
  const isAdmin = useMemo(
    () => roleNames.includes('Admin') || roleNames.includes('Manager'),
    [roleNames]
  );

  /**
   * Is the user a Seller?
   * Determined by:
   *  - user_type.can_sell === true, OR
   *  - type_id is 1 (Supplier) or 3 (Company)
   */
  const isSeller = useMemo(() => {
    if (!user) return false;
    // Check user_type object first (most reliable)
    if (user.user_type?.can_sell) return true;
    // Fallback to type_id from constants
    const typeInfo = USER_TYPES[user.type_id as keyof typeof USER_TYPES];
    if (typeInfo?.can_sell) return true;
    return false;
  }, [user]);

  /**
   * Is the user a Buyer?
   * Determined by:
   *  - user_type.can_buy === true, OR
   *  - type_id is 2 (Retailer)
   */
  const isBuyer = useMemo(() => {
    if (!user) return false;
    // Check user_type object first
    if (user.user_type?.can_buy) return true;
    // Fallback to type_id from constants
    const typeInfo = USER_TYPES[user.type_id as keyof typeof USER_TYPES];
    if (typeInfo?.can_buy) return true;
    return false;
  }, [user]);

  /**
   * Get the dashboard path for the current user based on their role.
   * Admin > Seller > Buyer > generic dashboard
   */
  const dashboardPath = useMemo(() => {
    if (isAdmin) return '/admin';
    if (isSeller) return '/dashboard/supplier';
    if (isBuyer) return '/dashboard/retailer';
    return '/dashboard';
  }, [isAdmin, isSeller, isBuyer]);

  return {
    permissions,
    roleNames,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    isAdmin,
    isSeller,
    isBuyer,
    dashboardPath,
  };
}

export default usePermission;
