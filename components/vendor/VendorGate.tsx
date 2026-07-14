import { PropsWithChildren } from 'react';
import type { Href } from 'expo-router';
import { router } from 'expo-router';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useVendorAccess } from '@/hooks/useVendorAccess';

export function VendorGate({ children }: PropsWithChildren) {
  const access = useVendorAccess();

  if (access.loading) {
    return <ScreenContainer contentStyle={{ justifyContent: 'center' }}><LoadingState title="Checking vendor access" message="Verifying your Firestore vendor profile." /></ScreenContainer>;
  }

  if (access.error) {
    return <ScreenContainer contentStyle={{ justifyContent: 'center' }}><FriendlyErrorState title="Vendor access unavailable" message={access.error} onRetry={access.retry} /></ScreenContainer>;
  }

  if (!access.isVendor) {
    return (
      <ScreenContainer scroll contentStyle={{ gap: 18, justifyContent: 'center' }}>
        <AppBadge label="Restaurant owners only" tone="danger" icon="storefront-outline" />
        <FriendlyErrorState title="Access denied" message="Only users with the vendor role may access the restaurant portal." icon="lock-closed-outline" />
        <AppButton label="Vendor Login" leftIcon="log-in-outline" onPress={() => router.replace('/(vendor)/login' as Href)} />
        <AppButton label="Back to Customer App" variant="outline" leftIcon="arrow-back" onPress={() => router.replace('/(auth)/login' as Href)} />
      </ScreenContainer>
    );
  }

  return <>{children}</>;
}
