import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/forms/AppInput';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { isValidEmail } from '@/utils/authValidation';

export default function VendorForgotPasswordScreen() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState('');

  async function handleReset() {
    if (!isValidEmail(email)) {
      setNotice('Enter a valid vendor email address.');
      return;
    }
    try {
      await auth.forgotPassword(email);
      setNotice('Password reset email sent. Check the vendor inbox.');
    } catch {
      setNotice('Unable to send reset email. Check the address and try again.');
    }
  }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Reset Vendor Password" subtitle="Firebase email reset" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      <View style={styles.form}>
        <AppInput label="Vendor email" value={email} onChangeText={(value) => { setEmail(value); setNotice(''); auth.clearError(); }} leftIcon="mail-outline" keyboardType="email-address" autoCapitalize="none" />
      </View>
      {auth.error ? <AppBadge label={auth.error} tone="danger" icon="alert-circle-outline" /> : null}
      {notice ? <AppBadge label={notice} tone={notice.includes('sent') ? 'success' : 'warning'} icon={notice.includes('sent') ? 'mail-outline' : 'warning-outline'} /> : null}
      <AppButton label="Send Reset Email" leftIcon="mail-outline" loading={auth.loading} onPress={handleReset} />
      <AppButton label="Back to Vendor Login" variant="ghost" onPress={() => router.replace('/(vendor)/login' as Href)} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  form: { gap: spacing.lg },
});
