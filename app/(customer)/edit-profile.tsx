import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/forms/AppInput';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { spacing } from '@/constants/theme';
import { useAddresses } from '@/hooks/useAddresses';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { isValidEmail } from '@/utils/authValidation';
import { mapUserProfile } from '@/utils/firestoreAdapters';

type ProfileForm = {
  fullName: string;
  username: string;
  phone: string;
  email: string;
  address: string;
  photoURL: string;
};

type ProfileErrors = Partial<Record<keyof ProfileForm, string>>;

const emptyProfileForm: ProfileForm = {
  fullName: '',
  username: '',
  phone: '',
  email: '',
  address: '',
  photoURL: '',
};

function validateProfile(values: ProfileForm) {
  const errors: ProfileErrors = {};
  if (!values.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!values.username.trim()) errors.username = 'Username is required.';
  if (!values.phone.trim()) errors.phone = 'Phone number is required.';
  if (!values.address.trim()) errors.address = 'Delivery address is required.';
  if (values.email.trim() && !isValidEmail(values.email)) errors.email = 'Enter a valid email address.';
  if (values.photoURL.trim() && !/^https?:\/\//.test(values.photoURL.trim())) {
    errors.photoURL = 'Photo URL must start with http:// or https://.';
  }
  return errors;
}

export default function EditProfileScreen() {
  const auth = useAuth();
  const profileState = useUserProfile();
  const addressesState = useAddresses();
  const defaultAddress = addressesState.data.find((address) => address.isDefault) ?? addressesState.data[0];
  const [values, setValues] = useState<ProfileForm>(emptyProfileForm);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [notice, setNotice] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const loading = auth.loading || profileState.loading || addressesState.loading;

  useEffect(() => {
    if (hydrated || profileState.loading || addressesState.loading) {
      return;
    }

    const profile = mapUserProfile(profileState.data, { displayName: auth.displayName, email: auth.email });
    const addressText = defaultAddress
      ? [defaultAddress.addressLine, defaultAddress.city, defaultAddress.country].filter(Boolean).join(', ')
      : '';

    setValues({
      fullName: profile.fullName === 'YUMMY Customer' ? '' : profile.fullName,
      username: profileState.data?.username ?? '',
      phone: profile.phone === 'Phone pending' ? '' : profile.phone,
      email: profile.email === 'Email pending' ? '' : profile.email,
      address: addressText,
      photoURL: auth.photoURL ?? '',
    });
    setHydrated(true);
  }, [addressesState.loading, auth.displayName, auth.email, auth.photoURL, defaultAddress, hydrated, profileState.data, profileState.loading]);

  function updateField(field: keyof ProfileForm, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setNotice('');
    auth.clearError();
  }

  async function handleSave() {
    const nextErrors = validateProfile(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).some((key) => nextErrors[key as keyof ProfileErrors])) {
      return;
    }

    try {
      await auth.updateProfile({
        displayName: values.fullName.trim(),
        photoURL: values.photoURL.trim() || undefined,
      });
      await profileState.saveProfile({
        fullName: values.fullName,
        username: values.username,
        phone: values.phone,
        email: values.email,
        address: values.address,
      });
      await addressesState.saveDefaultAddress({
        recipientName: values.fullName,
        phone: values.phone,
        addressLine: values.address,
      });
      setNotice('Profile saved to Firebase Auth and Firestore.');
    } catch (error) {
      const nextError = error as { message?: string };
      setNotice(nextError.message ?? 'Unable to save profile. Please try again.');
    }
  }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Edit Profile" subtitle="Firebase profile and Firestore data" leftIcon="arrow-back" onLeftPress={() => router.back()} />

      <View style={styles.form}>
        <AppInput label="Full name" value={values.fullName} onChangeText={(value) => updateField('fullName', value)} leftIcon="person-outline" error={errors.fullName} />
        <AppInput label="Username" value={values.username} onChangeText={(value) => updateField('username', value)} leftIcon="at-outline" autoCapitalize="none" error={errors.username} helperText="Saved to the Firestore user profile." />
        <AppInput label="Phone number" value={values.phone} onChangeText={(value) => updateField('phone', value)} leftIcon="call-outline" keyboardType="phone-pad" error={errors.phone} helperText="Saved to the Firestore user profile and default address." />
        <AppInput label="Email" value={values.email} onChangeText={(value) => updateField('email', value)} leftIcon="mail-outline" keyboardType="email-address" autoCapitalize="none" error={errors.email} helperText="Saved to Firestore profile. Firebase Auth email changes require re-authentication." />
        <AppInput label="Photo URL" value={values.photoURL} onChangeText={(value) => updateField('photoURL', value)} leftIcon="image-outline" autoCapitalize="none" error={errors.photoURL} helperText="Updates Firebase Auth photoURL only. No Storage upload in this phase." />
        <AppInput label="Delivery address" value={values.address} onChangeText={(value) => updateField('address', value)} leftIcon="location-outline" multiline numberOfLines={3} textAlignVertical="top" error={errors.address} helperText="Saved as the default Firestore address document." />
      </View>

      {profileState.error ? <AppBadge label={profileState.error} tone="danger" icon="alert-circle-outline" /> : null}
      {addressesState.error ? <AppBadge label={addressesState.error} tone="danger" icon="alert-circle-outline" /> : null}
      {auth.error ? <AppBadge label={auth.error} tone="danger" icon="alert-circle-outline" /> : null}
      {notice ? <AppBadge label={notice} tone={notice.startsWith('Unable') ? 'danger' : 'success'} icon={notice.startsWith('Unable') ? 'alert-circle-outline' : 'checkmark-circle-outline'} /> : null}
      <AppButton label="Save Changes" leftIcon="save-outline" loading={loading} disabled={!auth.isAuthenticated} onPress={handleSave} />
      {auth.isAuthenticated ? null : <AppBadge label="Sign in before saving Firestore profile data." tone="warning" icon="warning-outline" />}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  form: {
    gap: spacing.lg,
  },
});
