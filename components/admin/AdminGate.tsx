import { PropsWithChildren } from 'react';
import type { Href } from 'expo-router';
import { router } from 'expo-router';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useAdminAccess } from '@/hooks/useAdminAccess';

export function AdminGate({ children }: PropsWithChildren) {
  const access = useAdminAccess();

  if (access.loading) {
    return <ScreenContainer contentStyle={{ justifyContent: 'center' }}><LoadingState title="Checking admin access" message="Verifying your Firestore admin profile." /></ScreenContainer>;
  }

  if (access.error) {
    return <ScreenContainer contentStyle={{ justifyContent: 'center' }}><FriendlyErrorState title="Admin access unavailable" message={access.error} onRetry={access.retry} /></ScreenContainer>;
  }

  if (!access.isAdmin) {
    return (
      <ScreenContainer scroll contentStyle={{ gap: 18, justifyContent: 'center' }}>
        <AppBadge label="Admin users only" tone="danger" icon="shield-outline" />
        <FriendlyErrorState title="Access denied" message="Only users with the admin role may access the administrator console." icon="lock-closed-outline" />
        <AppButton label="Admin Login" leftIcon="log-in-outline" onPress={() => router.replace('/(admin)/login' as Href)} />
        <AppButton label="Back to Customer App" variant="outline" leftIcon="arrow-back" onPress={() => router.replace('/(auth)/login' as Href)} />
      </ScreenContainer>
    );
  }

  return <>{children}</>;
}
