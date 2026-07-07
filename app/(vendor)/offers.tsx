import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/forms/AppInput';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { VendorBottomNavigation } from '@/components/vendor/VendorBottomNavigation';
import { VendorEntityCard } from '@/components/vendor/VendorCards';
import { spacing } from '@/constants/theme';
import { useVendorCoupons, useVendorOffers } from '@/hooks/useVendorOffers';
import { useVendorRestaurant } from '@/hooks/useVendorRestaurant';

type PromoForm = { title: string; description: string; code: string; discountValue: string; expiresAt: string; active: boolean };
const emptyForm: PromoForm = { title: '', description: '', code: '', discountValue: '10', expiresAt: '2026-12-31', active: true };

export default function VendorOffersScreen() {
  const restaurantState = useVendorRestaurant();
  const couponsState = useVendorCoupons(restaurantState.data?.id, restaurantState.data?.name);
  const offersState = useVendorOffers(restaurantState.data?.id, restaurantState.data?.name);
  const [form, setForm] = useState<PromoForm>(emptyForm);
  const [notice, setNotice] = useState('');
  const firstError = restaurantState.error ?? couponsState.error ?? offersState.error;

  function updateField(field: keyof PromoForm, value: string | boolean) { setForm((current) => ({ ...current, [field]: value })); setNotice(''); }

  async function saveCoupon() {
    const discountValue = Number(form.discountValue);
    if (!form.title.trim() || !form.description.trim() || !form.code.trim()) { setNotice('Coupon title, description, and code are required.'); return; }
    if (!Number.isFinite(discountValue) || discountValue <= 0) { setNotice('Discount must be greater than zero.'); return; }
    await couponsState.saveCoupon({ code: form.code, title: form.title, description: form.description, discountType: 'percentage', discountValue, expiresAt: form.expiresAt, active: form.active });
    setNotice('Coupon saved to Firestore.');
    setForm(emptyForm);
  }

  async function saveOffer() {
    if (!form.title.trim() || !form.description.trim()) { setNotice('Offer title and description are required.'); return; }
    await offersState.saveOffer({ title: form.title, description: form.description, badgeLabel: form.code || 'Vendor offer', discountLabel: `${form.discountValue}% off`, expiresAt: form.expiresAt, featured: true, active: form.active });
    setNotice('Offer saved to Firestore.');
    setForm(emptyForm);
  }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Coupons & Offers" subtitle="Restaurant promotions" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      {restaurantState.loading || couponsState.loading || offersState.loading ? <LoadingState title="Loading promotions" message="Fetching vendor coupons and offers." /> : null}
      {firstError ? <FriendlyErrorState title="Promotions unavailable" message={firstError} onRetry={async () => { await Promise.all([restaurantState.retry(), couponsState.retry(), offersState.retry()]); }} /> : null}
      <View style={styles.form}>
        <AppInput label="Title" value={form.title} onChangeText={(value) => updateField('title', value)} leftIcon="gift-outline" />
        <AppInput label="Description" value={form.description} onChangeText={(value) => updateField('description', value)} leftIcon="reader-outline" />
        <AppInput label="Coupon code or badge" value={form.code} onChangeText={(value) => updateField('code', value)} leftIcon="pricetag-outline" autoCapitalize="characters" />
        <AppInput label="Discount percentage" value={form.discountValue} onChangeText={(value) => updateField('discountValue', value)} leftIcon="trending-down-outline" keyboardType="number-pad" />
        <AppInput label="Expiry date" value={form.expiresAt} onChangeText={(value) => updateField('expiresAt', value)} leftIcon="calendar-outline" />
        <View style={styles.actions}><AppButton label={form.active ? 'Active' : 'Hidden'} fullWidth={false} variant={form.active ? 'primary' : 'outline'} onPress={() => updateField('active', !form.active)} /><AppButton label="Save Coupon" fullWidth={false} leftIcon="pricetag-outline" onPress={saveCoupon} /><AppButton label="Save Offer" fullWidth={false} variant="secondary" leftIcon="gift-outline" onPress={saveOffer} /></View>
      </View>
      {notice ? <AppBadge label={notice} tone={notice.includes('Firestore') ? 'success' : 'warning'} icon={notice.includes('Firestore') ? 'checkmark-circle-outline' : 'warning-outline'} /> : null}
      {couponsState.data.length === 0 && offersState.data.length === 0 ? <EmptyState title="No promotions yet" message="Create coupons and offers for your restaurant." icon="gift-outline" /> : null}
      <View style={styles.section}><SectionHeader title="Coupons" subtitle={`${couponsState.data.length} records`} />{couponsState.data.map((coupon) => <VendorEntityCard key={coupon.id} title={coupon.code} subtitle={coupon.title} meta={`${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : ' SLE'} off until ${coupon.expiresAt}`} badge={coupon.active ? 'Active' : 'Hidden'} badgeTone={coupon.active ? 'success' : 'warning'} dangerActionLabel="Delete" onDangerAction={() => couponsState.deleteCoupon(coupon.id)} />)}</View>
      <View style={styles.section}><SectionHeader title="Offers" subtitle={`${offersState.data.length} records`} />{offersState.data.map((offer) => <VendorEntityCard key={offer.id} title={offer.title} subtitle={offer.description} meta={`${offer.discountLabel} until ${offer.expiresAt}`} badge={offer.active ? 'Active' : 'Hidden'} badgeTone={offer.active ? 'success' : 'warning'} dangerActionLabel="Delete" onDangerAction={() => offersState.deleteOffer(offer.id)} />)}</View>
      <VendorBottomNavigation active="offers" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] }, form: { gap: spacing.lg }, actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, section: { gap: spacing.md } });
