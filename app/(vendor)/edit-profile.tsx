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

type RestaurantForm = { name: string; description: string; deliveryTimeMinutes: string; deliveryFee: string };

export default function EditVendorProfileScreen() {
  const restaurantState = useVendorRestaurant();
  const [values, setValues] = useState<RestaurantForm>({ name: '', description: '', deliveryTimeMinutes: '30', deliveryFee: '15000' });
  const [notice, setNotice] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (hydrated || restaurantState.loading) return;
    if (restaurantState.data) {
      setValues({ name: restaurantState.data.name, description: restaurantState.data.description, deliveryTimeMinutes: String(restaurantState.data.deliveryTimeMinutes), deliveryFee: String(restaurantState.data.deliveryFee) });
    }
    setHydrated(true);
  }, [hydrated, restaurantState.data, restaurantState.loading]);

  function updateField(field: keyof RestaurantForm, value: string) { setValues((current) => ({ ...current, [field]: value })); setNotice(''); }

  async function handleSave() {
    if (!values.name.trim() || !values.description.trim()) { setNotice('Restaurant name and description are required.'); return; }
    const deliveryTimeMinutes = Number(values.deliveryTimeMinutes);
    const deliveryFee = Number(values.deliveryFee);
    if (!Number.isFinite(deliveryTimeMinutes) || deliveryTimeMinutes < 1) { setNotice('Delivery time must be a positive number.'); return; }
    if (!Number.isFinite(deliveryFee) || deliveryFee < 0) { setNotice('Delivery fee must be zero or more.'); return; }
    try {
      await restaurantState.saveRestaurant({ name: values.name, description: values.description, deliveryTimeMinutes, deliveryFee });
      setNotice('Restaurant profile saved to Firestore.');
    } catch (error) {
      const nextError = error as { message?: string };
      setNotice(nextError.message ?? 'Unable to save restaurant profile.');
    }
  }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Edit Restaurant" subtitle="Profile management" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      <View style={styles.form}>
        <AppInput label="Restaurant name" value={values.name} onChangeText={(value) => updateField('name', value)} leftIcon="storefront-outline" />
        <AppInput label="Description" value={values.description} onChangeText={(value) => updateField('description', value)} leftIcon="reader-outline" multiline numberOfLines={3} textAlignVertical="top" />
        <AppInput label="Estimated delivery minutes" value={values.deliveryTimeMinutes} onChangeText={(value) => updateField('deliveryTimeMinutes', value)} leftIcon="time-outline" keyboardType="number-pad" />
        <AppInput label="Delivery fee" value={values.deliveryFee} onChangeText={(value) => updateField('deliveryFee', value)} leftIcon="cash-outline" keyboardType="number-pad" />
      </View>
      {restaurantState.error ? <AppBadge label={restaurantState.error} tone="danger" icon="alert-circle-outline" /> : null}
      {notice ? <AppBadge label={notice} tone={notice.includes('saved') ? 'success' : 'warning'} icon={notice.includes('saved') ? 'checkmark-circle-outline' : 'warning-outline'} /> : null}
      <AppButton label="Save Restaurant Profile" leftIcon="save-outline" loading={restaurantState.loading} onPress={handleSave} />
      <VendorBottomNavigation active="dashboard" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] }, form: { gap: spacing.lg } });
