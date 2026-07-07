import { PropsWithChildren } from 'react';

import { useAuth as useFirebaseAuth } from '@/hooks/useAuth';
import { User } from '@/types';

export function AuthProvider({ children }: PropsWithChildren) {
  return <>{children}</>;
}

export function useAuth() {
  const auth = useFirebaseAuth();

  return {
    user: auth.currentUser
      ? ({
          id: auth.currentUser.uid,
          fullName: auth.displayName ?? auth.email ?? 'YUMMY Customer',
          address: '',
          phone: '',
          username: auth.email ?? '',
          role: 'customer',
          createdAt: auth.currentUser.metadata.creationTime ?? new Date().toISOString(),
          updatedAt: auth.currentUser.metadata.lastSignInTime ?? undefined,
        } satisfies User)
      : null,
    isAuthenticated: auth.isAuthenticated,
    isReady: auth.isReady,
  };
}
