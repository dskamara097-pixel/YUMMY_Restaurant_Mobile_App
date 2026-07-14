import { useMemo } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';

export function useVendorAccess() {
  const auth = useAuth();
  const profileState = useUserProfile();
  const isVendor = Boolean(auth.isAuthenticated && profileState.data?.role === 'vendor');

  return useMemo(() => ({
    isAuthenticated: auth.isAuthenticated,
    isVendor,
    loading: auth.loading || profileState.loading,
    error: profileState.error,
    profile: profileState.data,
    retry: profileState.retry,
  }), [auth.isAuthenticated, auth.loading, isVendor, profileState.data, profileState.error, profileState.loading, profileState.retry]);
}
