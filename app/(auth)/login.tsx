import { Link, useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { AppInput } from '@/components/forms/AppInput';
import { PasswordInput } from '@/components/forms/PasswordInput';
import { AuthScreenLayout } from '@/components/layout/AuthScreenLayout';
import { spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { FormErrors, hasErrors, LoginFormValues, validateLogin } from '@/utils/authValidation';

export default function LoginScreen() {
  const router = useRouter();
  const auth = useAuth();
  const [values, setValues] = useState<LoginFormValues>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors<LoginFormValues>>({});
  const [notice, setNotice] = useState('');

  function updateField(field: keyof LoginFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setNotice('');
    auth.clearError();
  }

  async function handleSubmit() {
    const nextErrors = validateLogin(values);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      return;
    }

    try {
      const user = await auth.login(values);
      if (user && !user.emailVerified) {
        setNotice('Login successful. Please verify your email to unlock protected account actions.');
      }
      router.replace('/(customer)/home');
    } catch {
      setNotice('');
    }
  }

  return (
    <AuthScreenLayout
      title="Login to your account"
      description="Use your Firebase email and password to access your YUMMY customer account."
    >
      <AppBadge label="Firebase Email/Password Auth" tone="success" icon="shield-checkmark-outline" />
      <View style={styles.form}>
        <AppInput
          label="Email"
          placeholder="customer@example.com"
          leftIcon="mail-outline"
          value={values.email}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(text) => updateField('email', text)}
        />
        <PasswordInput
          label="Password"
          placeholder="Enter password"
          value={values.password}
          error={errors.password}
          onChangeText={(text) => updateField('password', text)}
        />
        <Link href="/(auth)/forgot-password" asChild>
          <Pressable accessibilityRole="link" style={styles.forgotLink}>
            <AppText variant="caption" tone="primary">Forgot password?</AppText>
          </Pressable>
        </Link>
      </View>
      {auth.error ? <AppBadge label={auth.error} tone="danger" icon="alert-circle-outline" /> : null}
      {notice ? <AppBadge label={notice} tone="warning" icon="mail-unread-outline" /> : null}
      <View style={styles.actions}>
        <AppButton label="Login" leftIcon="person-outline" loading={auth.loading} onPress={handleSubmit} />
        <Link href="/(auth)/register" asChild>
          <AppButton label="Create a new account" variant="outline" leftIcon="add" disabled={auth.loading} />
        </Link>
        <Link href={"/(vendor)/login" as Href} asChild>
          <AppButton label="Restaurant vendor login" variant="ghost" leftIcon="storefront-outline" disabled={auth.loading} />
        </Link>
        <Link href={"/(admin)/login" as Href} asChild>
          <AppButton label="Administrator login" variant="ghost" leftIcon="shield-checkmark-outline" disabled={auth.loading} />
        </Link>
      </View>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    minHeight: 32,
    justifyContent: 'center',
  },
  actions: {
    gap: spacing.md,
  },
});



