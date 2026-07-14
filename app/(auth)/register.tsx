import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { AppInput } from '@/components/forms/AppInput';
import { PasswordInput } from '@/components/forms/PasswordInput';
import { AuthScreenLayout } from '@/components/layout/AuthScreenLayout';
import { colors, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { userRepository } from '@/repositories/UserRepository';
import { FormErrors, hasErrors, RegisterFormValues, validateRegistration } from '@/utils/authValidation';

export default function RegisterScreen() {
  const auth = useAuth();
  const [values, setValues] = useState<RegisterFormValues>({
    fullName: '',
    address: '',
    phone: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors<RegisterFormValues>>({});
  const [submitted, setSubmitted] = useState(false);

  const passwordRuleMet = useMemo(() => values.password.length >= 8, [values.password]);

  function updateField(field: keyof RegisterFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitted(false);
    auth.clearError();
  }

  async function handleSubmit() {
    const nextErrors = validateRegistration(values);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      return;
    }

    try {
      const existingUsername = await userRepository.getByUsername(values.username);
      if (existingUsername) {
        setErrors((current) => ({ ...current, username: 'This username is already taken.' }));
        return;
      }
      const user = await auth.register({
        email: values.email,
        password: values.password,
        displayName: values.fullName,
      });
      if (user) {
        await userRepository.ensureCustomerProfile({
          id: user.uid,
          fullName: values.fullName,
          username: values.username,
          email: values.email,
          phone: values.phone,
          address: values.address,
        });
      }
      setSubmitted(true);
    } catch {
      setSubmitted(false);
    }
  }

  return (
    <AuthScreenLayout
      title="Create customer account"
      description="Create a Firebase email/password account for YUMMY. A verification email is sent after registration."
    >
      <View style={styles.form}>
        <AppInput
          label="Full Name"
          placeholder="Enter full name"
          leftIcon="person-outline"
          value={values.fullName}
          error={errors.fullName}
          onChangeText={(text) => updateField('fullName', text)}
        />
        <AppInput
          label="Address"
          placeholder="Enter delivery address"
          leftIcon="location-outline"
          value={values.address}
          error={errors.address}
          onChangeText={(text) => updateField('address', text)}
        />
        <AppInput
          label="Phone Number *"
          placeholder="Enter phone number"
          leftIcon="call-outline"
          value={values.phone}
          error={errors.phone}
          helperText="Required by the assignment. Firestore persistence comes later."
          keyboardType="phone-pad"
          onChangeText={(text) => updateField('phone', text)}
        />
        <AppInput
          label="Username"
          placeholder="Choose username"
          leftIcon="at-outline"
          value={values.username}
          error={errors.username}
          helperText="Username profile storage will be handled in the Firestore phase."
          autoCapitalize="none"
          onChangeText={(text) => updateField('username', text)}
        />
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
          placeholder="Create password"
          value={values.password}
          error={errors.password}
          helperText="Must contain at least 8 characters."
          onChangeText={(text) => updateField('password', text)}
        />
        <PasswordInput
          label="Confirm Password"
          placeholder="Re-enter password"
          value={values.confirmPassword}
          error={errors.confirmPassword}
          onChangeText={(text) => updateField('confirmPassword', text)}
        />
        <View style={[styles.ruleBox, passwordRuleMet && styles.ruleBoxMet]}>
          <AppBadge
            label={passwordRuleMet ? 'Password rule met' : 'At least 8 characters'}
            tone={passwordRuleMet ? 'success' : 'warning'}
            icon={passwordRuleMet ? 'checkmark-circle-outline' : 'warning-outline'}
          />
          <AppText variant="caption" tone="muted">
            Duplicate account prevention is handled by Firebase email uniqueness.
          </AppText>
        </View>
      </View>
      {auth.error ? <AppBadge label={auth.error} tone="danger" icon="alert-circle-outline" /> : null}
      {submitted ? <AppBadge label="Account created. Check your email for verification." tone="success" icon="mail-outline" /> : null}
      <View style={styles.actions}>
        <AppButton label="Create Account" leftIcon="add" loading={auth.loading} onPress={handleSubmit} />
        <Link href="/(auth)/login" asChild>
          <AppButton label="Already have an account" variant="ghost" disabled={auth.loading} />
        </Link>
      </View>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg,
  },
  ruleBox: {
    backgroundColor: colors.semantic.warningSoft,
    borderColor: colors.neutral.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  ruleBoxMet: {
    backgroundColor: colors.semantic.successSoft,
  },
  actions: {
    gap: spacing.md,
  },
});
