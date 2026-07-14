import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { useAuth } from '@/hooks/useAuth';
import { clearFirestoreDataCache } from '@/hooks/useFirestoreData';

export function AdminLogoutAction() {
  const auth = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [notice, setNotice] = useState('');

  async function logoutAdmin() {
    setLoggingOut(true);
    setNotice('');

    try {
      await auth.logout();
      clearFirestoreDataCache();
      router.replace('/(auth)/login' as Href);
    } catch (error) {
      const message = error instanceof Error ? error.message : auth.error;
      setNotice(message ?? 'Unable to log out. Please try again.');
    } finally {
      setLoggingOut(false);
    }
  }

  function confirmLogout() {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => { void logoutAdmin(); } },
    ]);
  }

  return (
    <>
      {notice ? <AppBadge label={notice} tone="danger" icon="alert-circle-outline" /> : null}
      <AppButton
        label="Logout"
        variant="danger"
        leftIcon="log-out-outline"
        loading={loggingOut || auth.loading}
        disabled={loggingOut || auth.loading}
        onPress={confirmLogout}
      />
    </>
  );
}
