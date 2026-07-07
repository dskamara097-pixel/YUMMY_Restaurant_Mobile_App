import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { AppInput } from '@/components/forms/AppInput';
import { AuthScreenLayout } from '@/components/layout/AuthScreenLayout';
import { spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { ForgotPasswordFormValues, FormErrors, hasErrors, validateForgotPassword } from '@/utils/authValidation';

export default function ForgotPasswordScreen() {
  const auth = useAuth();
  const [values, setValues] = useState<ForgotPasswordFormValues>({ email: '' });
  const [errors, setErrors] = useState<FormErrors<ForgotPasswordFormValues>>({});
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    const nextErrors = validateForgotPassword(values);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      return;
    }

    try {
      await auth.forgotPassword(values.email);
      setSubmitted(true);
    } catch {
      setSubmitted(false);
    }
  }

  return (
    <AuthScreenLayout
      title="Recover access"
      description="Enter your Firebase account email and YUMMY will send a secure password reset link."
    >
      <AppBadge label="Firebase password reset" tone="success" icon="mail-outline" />
      <View style={styles.form}>
        <AppInput
          label="Email"
          placeholder="customer@example.com"
          leftIcon="mail-outline"
          value={values.email}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(text) => {
            setValues({ email: text });
            setErrors({});
            setSubmitted(false);
            auth.clearError();
          }}
        />
        {auth.error ? <AppBadge label={auth.error} tone="danger" icon="alert-circle-outline" /> : null}
        {submitted ? (
          <AppText tone="success">
            Password reset email sent. Check your inbox and return to login.
          </AppText>
        ) : null}
      </View>
      <View style={styles.actions}>
        <AppButton label="Send Reset Link" loading={auth.loading} onPress={handleSubmit} />
        <Link href="/(auth)/login" asChild>
          <AppButton label="Back to Login" variant="outline" leftIcon="arrow-back" disabled={auth.loading} />
        </Link>
      </View>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg,
  },
  actions: {
    gap: spacing.md,
  },
});
