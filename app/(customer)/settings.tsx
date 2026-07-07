import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { AccountOptionRow } from '@/components/profile/AccountOptionRow';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { colors, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsScreen() {
  const auth = useAuth();
  const [notice, setNotice] = useState('');

  async function handleLogout() {
    try {
      await auth.logout();
      router.replace('/(auth)/login');
    } catch {
      setNotice('');
    }
  }

  async function handleDeleteAccount() {
    try {
      await auth.deleteAccount();
      router.replace('/(auth)/register');
    } catch {
      setNotice('Account deletion may require recent login. Log out, log in again, then retry.');
    }
  }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Settings" subtitle="Preferences and security" leftIcon="arrow-back" onLeftPress={() => router.back()} />

      <View style={styles.section}>
        <SectionHeader title="Account Settings" />
        <View style={styles.list}>
          <AccountOptionRow title="Personal Information" subtitle="Manage account details" icon="person-outline" onPress={() => router.push('/(customer)/edit-profile' as Href)} />
          <AccountOptionRow title="Password" subtitle="Use Forgot Password from login to reset securely" icon="lock-closed-outline" onPress={() => setNotice('Password reset is handled by the Forgot Password screen.')} />
          <AccountOptionRow title="Privacy" subtitle="Privacy option placeholder" icon="shield-checkmark-outline" onPress={() => setNotice('Privacy settings will be completed in a later phase.')} />
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Authentication" />
        <View style={styles.preferenceCard}>
          <AppText variant="bodyStrong">Session</AppText>
          <AppBadge label={auth.isAuthenticated ? 'Signed in' : 'Signed out'} tone={auth.isAuthenticated ? 'success' : 'warning'} icon="person-circle-outline" />
        </View>
        <View style={styles.preferenceCard}>
          <AppText variant="bodyStrong">Email Verification</AppText>
          <AppBadge label={auth.emailVerified ? 'Verified' : 'Required'} tone={auth.emailVerified ? 'success' : 'warning'} icon="mail-outline" />
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Notification Settings" />
        <View style={styles.preferenceCard}>
          <AppText variant="bodyStrong">Order updates</AppText>
          <AppBadge label="On" tone="success" icon="notifications-outline" />
        </View>
        <View style={styles.preferenceCard}>
          <AppText variant="bodyStrong">Promotions</AppText>
          <AppBadge label="Placeholder" tone="info" icon="megaphone-outline" />
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Appearance" />
        <View style={styles.preferenceCard}>
          <AppText variant="bodyStrong">Theme</AppText>
          <AppBadge label="Light mode placeholder" tone="neutral" icon="sunny-outline" />
        </View>
      </View>

      {auth.error ? <AppBadge label={auth.error} tone="danger" icon="alert-circle-outline" /> : null}
      {notice ? <AppBadge label={notice} tone="info" icon="information-circle-outline" /> : null}

      <AppButton label="Logout" variant="danger" leftIcon="log-out-outline" loading={auth.loading} onPress={handleLogout} />
      <AppButton label="Delete Account" variant="outline" leftIcon="trash-outline" disabled={auth.loading || !auth.isAuthenticated} onPress={handleDeleteAccount} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  section: {
    gap: spacing.md,
  },
  list: {
    gap: spacing.md,
  },
  preferenceCard: {
    alignItems: 'center',
    backgroundColor: colors.neutral.surface,
    borderColor: colors.neutral.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
});
