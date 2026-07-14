import { PropsWithChildren } from 'react';
import type { Href } from 'expo-router';
import { router } from 'expo-router';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useAuth } from '@/hooks/useAuth';

export function CustomerGate({ children }: PropsWithChildren) {
  const auth = useAuth();

  if (!auth.isReady) {
    return <ScreenContainer contentStyle={{ justifyContent: 'center' }}><LoadingState title="Checking session" message="Restoring your Firebase session." /></ScreenContainer>;
  }

  if (!auth.isAuthenticated) {
    return (
      <ScreenContainer scroll contentStyle={{ gap: 18, justifyContent: 'center' }}>
        <AppBadge label="Sign in required" tone="warning" icon="person-circle-outline" />
        <FriendlyErrorState title="Login required" message="Please sign in before opening customer account screens." icon="lock-closed-outline" />
        <AppButton label="Go to Login" leftIcon="log-in-outline" onPress={() => router.replace('/(auth)/login' as Href)} />
      </ScreenContainer>
    );
  }

  return <>{children}</>;
}
