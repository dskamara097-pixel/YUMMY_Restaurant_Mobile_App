import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { AppInput } from '@/components/forms/AppInput';
import { PasswordInput } from '@/components/forms/PasswordInput';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { isValidEmail } from '@/utils/authValidation';

export default function VendorLoginScreen() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');

  async function handleLogin() {
    setNotice('');
    if (!isValidEmail(email)) { setNotice('Enter a valid vendor email address.'); return; }
    if (password.length < 8) { setNotice('Password must be at least 8 characters.'); return; }
    try {
      await auth.login({ email: email.trim(), password });
      router.replace('/(vendor)/dashboard' as Href);
    } catch {
      setNotice('Vendor login failed. Check your Firebase Auth account and try again.');
    }
  }

  return (
    <ScreenContainer scroll contentStyle={styles.screen} backgroundColor={colors.brand.primary}>
      <View style={styles.hero}>
        <View style={styles.logo}><AppIcon name="storefront-outline" size={42} color={colors.brand.primary} /></View>
        <AppText variant="display" tone="inverse" align="center">YUMMY Vendor</AppText>
        <AppText tone="inverse" align="center">Manage your restaurant, menu, orders, and offers.</AppText>
      </View>
      <View style={styles.formCard}>
        <AppBadge label="Restaurant owner login" tone="primary" icon="shield-checkmark-outline" />
        <AppInput label="Vendor email" value={email} onChangeText={setEmail} leftIcon="mail-outline" autoCapitalize="none" keyboardType="email-address" />
        <PasswordInput label="Password" value={password} onChangeText={setPassword} helperText="Use your Firebase vendor account password." />
        {auth.error ? <AppBadge label={auth.error} tone="danger" icon="alert-circle-outline" /> : null}
        {notice ? <AppBadge label={notice} tone="warning" icon="warning-outline" /> : null}
        <AppButton label="Login as Vendor" leftIcon="log-in-outline" loading={auth.loading} onPress={handleLogin} />
        <AppButton label="Back to Customer App" variant="ghost" leftIcon="arrow-back" onPress={() => router.replace('/(auth)/login' as Href)} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, justifyContent: 'center', paddingVertical: spacing['3xl'] },
  hero: { alignItems: 'center', gap: spacing.md },
  logo: { alignItems: 'center', backgroundColor: colors.neutral.surface, borderRadius: radius.xl, height: 88, justifyContent: 'center', width: 88, ...shadows.floating },
  formCard: { backgroundColor: colors.neutral.surface, borderRadius: radius.xl, gap: spacing.lg, padding: spacing.xl, ...shadows.card },
});

