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
import { clearFirestoreDataCache } from '@/hooks/useFirestoreData';
import { userRepository } from '@/repositories/UserRepository';
import { isValidEmail } from '@/utils/authValidation';

export default function AdminLoginScreen() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');

  async function handleLogin() {
    setNotice('');
    if (!isValidEmail(email)) { setNotice('Enter a valid admin email address.'); return; }
    if (password.length < 8) { setNotice('Password must be at least 8 characters.'); return; }
    try {
      const user = await auth.login({ email: email.trim(), password });
      const profile = user ? await userRepository.getById(user.uid) : null;
      if (profile?.role !== 'admin') {
        await auth.logout();
        clearFirestoreDataCache();
        setNotice('This account is not registered as an administrator.');
        return;
      }
      router.replace('/(admin)/dashboard' as Href);
    } catch {
      setNotice('Admin login failed. Check credentials and admin role profile.');
    }
  }

  return (
    <ScreenContainer scroll backgroundColor={colors.neutral.ink} contentStyle={styles.screen}>
      <View style={styles.hero}><View style={styles.logo}><AppIcon name="shield-checkmark-outline" size={42} color={colors.neutral.ink} /></View><AppText variant="display" tone="inverse" align="center">YUMMY Admin</AppText><AppText tone="inverse" align="center">Platform management console</AppText></View>
      <View style={styles.formCard}><AppBadge label="Administrator access only" tone="warning" icon="lock-closed-outline" /><AppInput label="Admin email" value={email} onChangeText={setEmail} leftIcon="mail-outline" autoCapitalize="none" keyboardType="email-address" /><PasswordInput label="Password" value={password} onChangeText={setPassword} />{auth.error ? <AppBadge label={auth.error} tone="danger" icon="alert-circle-outline" /> : null}{notice ? <AppBadge label={notice} tone="warning" icon="warning-outline" /> : null}<AppButton label="Login as Admin" leftIcon="log-in-outline" loading={auth.loading} onPress={handleLogin} /><AppButton label="Back to Customer Login" variant="ghost" leftIcon="arrow-back" onPress={() => router.replace('/(auth)/login' as Href)} /></View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ screen: { gap: spacing.xl, justifyContent: 'center', paddingVertical: spacing['3xl'] }, hero: { alignItems: 'center', gap: spacing.md }, logo: { alignItems: 'center', backgroundColor: colors.neutral.surface, borderRadius: radius.xl, height: 88, justifyContent: 'center', width: 88, ...shadows.floating }, formCard: { backgroundColor: colors.neutral.surface, borderRadius: radius.xl, gap: spacing.lg, padding: spacing.xl, ...shadows.card } });
