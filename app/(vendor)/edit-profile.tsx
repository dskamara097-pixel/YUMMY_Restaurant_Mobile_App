import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/forms/AppInput';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { VendorBottomNavigation } from '@/components/vendor/VendorBottomNavigation';
import { spacing } from '@/constants/theme';
import { useVendorRestaurant } from '@/hooks/useVendorRestaurant';
import { isValidEmail } from '@/utils/authValidation';

type RestaurantForm = {
  name: string;
  ownerName: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  closingHours: string;
  logoUrl: string;
  coverImageUrl: string;
  deliveryTimeMinutes: string;
  deliveryFee: string;
  active: boolean;
};

export default function EditVendorProfileScreen() {
  const restaurantState = useVendorRestaurant();
  const restaurant = restaurantState.data;
  const vendor = restaurantState.vendor;
  const [values, setValues] = useState<RestaurantForm>({
    name: '',
    ownerName: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    openingHours: '08:00',
    closingHours: '22:00',
    logoUrl: '',
    coverImageUrl: '',
    deliveryTimeMinutes: '30',
    deliveryFee: '15000',
    active: true,
  });
  const [notice, setNotice] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (hydrated || restaurantState.loading) return;
    if (restaurant) {
      setValues({
        name: restaurant.name,
        ownerName: vendor?.ownerName ?? '',
        description: restaurant.description,
        phone: restaurant.phone ?? vendor?.phone ?? '',
        email: restaurant.email ?? vendor?.email ?? '',
        address: restaurant.address ?? vendor?.address ?? '',
        openingHours: restaurant.openingHours ?? vendor?.openingHours ?? '08:00',
        closingHours: restaurant.closingHours ?? vendor?.closingHours ?? '22:00',
        logoUrl: restaurant.logoUrl ?? vendor?.logo ?? '',
        coverImageUrl: restaurant.coverImageUrl ?? vendor?.coverImage ?? '',
        deliveryTimeMinutes: String(restaurant.deliveryTimeMinutes),
        deliveryFee: String(restaurant.deliveryFee),
        active: restaurant.active,
      });
    }
    setHydrated(true);
  }, [hydrated, restaurant, restaurantState.loading, vendor]);

  function updateField(field: keyof RestaurantForm, value: string | boolean) {
    setValues((current) => ({ ...current, [field]: value }));
    setNotice('');
  }

  async function handleSave() {
    if (!values.name.trim() || !values.description.trim() || !values.phone.trim() || !values.address.trim()) {
      setNotice('Restaurant name, description, phone, and address are required.');
      return;
    }
    if (values.email.trim() && !isValidEmail(values.email)) {
      setNotice('Enter a valid restaurant email address.');
      return;
    }
    const deliveryTimeMinutes = Number(values.deliveryTimeMinutes);
    const deliveryFee = Number(values.deliveryFee);
    if (!Number.isFinite(deliveryTimeMinutes) || deliveryTimeMinutes < 1) {
      setNotice('Delivery time must be a positive number.');
      return;
    }
    if (!Number.isFinite(deliveryFee) || deliveryFee < 0) {
      setNotice('Delivery fee must be zero or more.');
      return;
    }
    try {
      await restaurantState.saveRestaurant({
        name: values.name,
        ownerName: values.ownerName,
        description: values.description,
        phone: values.phone,
        email: values.email,
        address: values.address,
        openingHours: values.openingHours,
        closingHours: values.closingHours,
        logoUrl: values.logoUrl,
        coverImageUrl: values.coverImageUrl,
        deliveryTimeMinutes,
        deliveryFee,
        active: values.active,
      });
      setNotice('Restaurant profile saved to Firestore.');
    } catch (error) {
      const nextError = error as { message?: string };
      setNotice(nextError.message ?? 'Unable to save restaurant profile.');
    }
  }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Edit Restaurant" subtitle="Profile, hours, images, availability" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      <View style={styles.form}>
        <AppInput label="Restaurant name" value={values.name} onChangeText={(value) => updateField('name', value)} leftIcon="storefront-outline" />
        <AppInput label="Owner name" value={values.ownerName} onChangeText={(value) => updateField('ownerName', value)} leftIcon="person-outline" />
        <AppInput label="Description" value={values.description} onChangeText={(value) => updateField('description', value)} leftIcon="reader-outline" multiline numberOfLines={3} textAlignVertical="top" />
        <AppInput label="Phone number" value={values.phone} onChangeText={(value) => updateField('phone', value)} leftIcon="call-outline" keyboardType="phone-pad" />
        <AppInput label="Email" value={values.email} onChangeText={(value) => updateField('email', value)} leftIcon="mail-outline" autoCapitalize="none" keyboardType="email-address" />
        <AppInput label="Address" value={values.address} onChangeText={(value) => updateField('address', value)} leftIcon="location-outline" multiline />
        <AppInput label="Opening hours" value={values.openingHours} onChangeText={(value) => updateField('openingHours', value)} leftIcon="time-outline" />
        <AppInput label="Closing hours" value={values.closingHours} onChangeText={(value) => updateField('closingHours', value)} leftIcon="time-outline" />
        <AppInput label="Logo URL" value={values.logoUrl} onChangeText={(value) => updateField('logoUrl', value)} leftIcon="image-outline" autoCapitalize="none" />
        <AppInput label="Cover image URL" value={values.coverImageUrl} onChangeText={(value) => updateField('coverImageUrl', value)} leftIcon="images-outline" autoCapitalize="none" />
        <AppInput label="Estimated delivery minutes" value={values.deliveryTimeMinutes} onChangeText={(value) => updateField('deliveryTimeMinutes', value)} leftIcon="time-outline" keyboardType="number-pad" />
        <AppInput label="Delivery fee" value={values.deliveryFee} onChangeText={(value) => updateField('deliveryFee', value)} leftIcon="cash-outline" keyboardType="number-pad" />
      </View>
      <View style={styles.actions}>
        <AppButton label={values.active ? 'OPEN' : 'CLOSED'} variant={values.active ? 'primary' : 'outline'} fullWidth={false} leftIcon={values.active ? 'lock-open-outline' : 'lock-closed-outline'} onPress={() => updateField('active', !values.active)} />
        <AppButton label="Save Restaurant Profile" fullWidth={false} leftIcon="save-outline" loading={restaurantState.loading} onPress={handleSave} />
      </View>
      {restaurantState.error ? <AppBadge label={restaurantState.error} tone="danger" icon="alert-circle-outline" /> : null}
      {notice ? <AppBadge label={notice} tone={notice.includes('saved') ? 'success' : 'warning'} icon={notice.includes('saved') ? 'checkmark-circle-outline' : 'warning-outline'} /> : null}
      <VendorBottomNavigation active="dashboard" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  form: { gap: spacing.lg },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
});
