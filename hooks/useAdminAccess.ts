import { useMemo } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';

export function useAdminAccess() {
  const auth = useAuth();
  const profileState = useUserProfile();
  const isAdmin = Boolean(auth.isAuthenticated && profileState.data?.role === 'admin');

  return useMemo(() => ({
    isAuthenticated: auth.isAuthenticated,
    isAdmin,
    loading: auth.loading || profileState.loading,
    error: profileState.error,
    profile: profileState.data,
    retry: profileState.retry,
  }), [auth.isAuthenticated, auth.loading, isAdmin, profileState.data, profileState.error, profileState.loading, profileState.retry]);
}
