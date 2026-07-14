import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/forms/AppInput';
import { PasswordInput } from '@/components/forms/PasswordInput';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppHeader } from '@/components/layout/AppHeader';
import { spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { restaurantRepository } from '@/repositories/RestaurantRepository';
import { userRepository } from '@/repositories/UserRepository';
import { vendorRepository } from '@/repositories/VendorRepository';
import { isValidEmail } from '@/utils/authValidation';

type VendorRegistrationForm = {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  password: string;
  confirmPassword: string;
};

const initialForm: VendorRegistrationForm = {
  businessName: '',
  ownerName: '',
  email: '',
  phone: '',
  address: '',
  description: '',
  password: '',
  confirmPassword: '',
};

export default function VendorRegisterScreen() {
  const auth = useAuth();
  const [form, setForm] = useState(initialForm);
  const [notice, setNotice] = useState('');

  function updateField(field: keyof VendorRegistrationForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setNotice('');
    auth.clearError();
  }

  async function handleRegister() {
    if (!form.businessName.trim() || !form.ownerName.trim() || !form.phone.trim() || !form.address.trim()) {
      setNotice('Business name, owner name, phone, and address are required.');
      return;
    }
    if (!isValidEmail(form.email)) {
      setNotice('Enter a valid vendor email address.');
      return;
    }
    if (form.password.length < 8 || form.password !== form.confirmPassword) {
      setNotice('Password must be at least 8 characters and match confirmation.');
      return;
    }

    try {
      const user = await auth.register({ email: form.email, password: form.password, displayName: form.ownerName });
      if (!user) throw new Error('Firebase vendor account was not created.');
      const timestamp = new Date().toISOString();
      await userRepository.ensureVendorUserProfile({
        id: user.uid,
        fullName: form.ownerName,
        username: form.email.split('@')[0],
        email: form.email,
        phone: form.phone,
        address: form.address,
      });
      const restaurant = await restaurantRepository.create({
        ownerId: user.uid,
        name: form.businessName.trim(),
        description: form.description.trim() || `${form.businessName} restaurant profile`,
        categoryIds: [],
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        address: form.address.trim(),
        deliveryTimeMinutes: 30,
        deliveryFee: 15000,
        rating: 0,
        reviewsCount: 0,
        active: true,
        status: 'pending',
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      await vendorRepository.saveProfile({
        id: user.uid,
        userId: user.uid,
        restaurantId: restaurant.id,
        businessName: form.businessName.trim(),
        ownerName: form.ownerName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        description: form.description.trim() || `${form.businessName} restaurant profile`,
        isOpen: true,
        verified: false,
        rating: 0,
        totalOrders: 0,
        createdAt: timestamp,
      });
      router.replace('/(vendor)/dashboard' as Href);
    } catch (error) {
      const nextError = error as { message?: string };
      setNotice(nextError.message ?? 'Unable to create vendor account.');
    }
  }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Vendor Registration" subtitle="Create restaurant owner account" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      <View style={styles.form}>
        <AppInput label="Restaurant name" value={form.businessName} onChangeText={(value) => updateField('businessName', value)} leftIcon="storefront-outline" />
        <AppInput label="Owner name" value={form.ownerName} onChangeText={(value) => updateField('ownerName', value)} leftIcon="person-outline" />
        <AppInput label="Email" value={form.email} onChangeText={(value) => updateField('email', value)} leftIcon="mail-outline" keyboardType="email-address" autoCapitalize="none" />
        <AppInput label="Phone" value={form.phone} onChangeText={(value) => updateField('phone', value)} leftIcon="call-outline" keyboardType="phone-pad" />
        <AppInput label="Address" value={form.address} onChangeText={(value) => updateField('address', value)} leftIcon="location-outline" multiline />
        <AppInput label="Description" value={form.description} onChangeText={(value) => updateField('description', value)} leftIcon="reader-outline" multiline />
        <PasswordInput label="Password" value={form.password} onChangeText={(value) => updateField('password', value)} />
        <PasswordInput label="Confirm Password" value={form.confirmPassword} onChangeText={(value) => updateField('confirmPassword', value)} />
      </View>
      {auth.error ? <AppBadge label={auth.error} tone="danger" icon="alert-circle-outline" /> : null}
      {notice ? <AppBadge label={notice} tone="warning" icon="warning-outline" /> : null}
      <AppButton label="Create Vendor Account" leftIcon="storefront-outline" loading={auth.loading} onPress={handleRegister} />
      <AppButton label="Already have an account" variant="ghost" onPress={() => router.replace('/(vendor)/login' as Href)} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  form: { gap: spacing.lg },
});
