import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppText } from '@/components/common/AppText';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { CouponCard } from '@/components/food/CouponCard';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { colors, radius, spacing } from '@/constants/theme';
import { useCoupons } from '@/hooks/useCoupons';
import { mapCouponModel } from '@/utils/firestoreAdapters';

export default function CouponsScreen() {
  const couponsState = useCoupons();
  const [notice, setNotice] = useState('');
  const coupons = couponsState.data.map(mapCouponModel);

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Coupons" subtitle="Savings and promo codes" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      <View style={styles.banner}><AppBadge label="Firestore coupons" tone="warning" icon="sparkles-outline" /><AppText variant="title" tone="inverse">Save more on YUMMY</AppText><AppText tone="inverse">Coupons load from Firestore. Applying a coupon remains UI-only until payment is approved.</AppText></View>
      {couponsState.loading ? <LoadingState title="Loading coupons" message="Fetching available coupons from Firestore." /> : null}
      {couponsState.error ? <FriendlyErrorState title="Unable to load coupons" message={couponsState.error} onRetry={couponsState.retry} /> : null}
      {!couponsState.loading && !couponsState.error && coupons.length === 0 ? <EmptyState title="No coupons available" message="Fresh Firestore coupons will appear here." icon="pricetag-outline" /> : null}
      <SectionHeader title="Available Coupons" subtitle="Discount cards with expiry dates" />
      <View style={styles.list}>{coupons.map((coupon) => <CouponCard key={coupon.id} {...coupon} onApply={() => setNotice(`${coupon.code} is ready for a later checkout phase.`)} />)}</View>
      {notice ? <AppBadge label={notice} tone="info" icon="information-circle-outline" /> : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] }, banner: { backgroundColor: colors.brand.primary, borderRadius: radius.xl, gap: spacing.sm, padding: spacing.xl }, list: { gap: spacing.md } });
