import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { VendorBottomNavigation } from '@/components/vendor/VendorBottomNavigation';
import { VendorStatCard } from '@/components/vendor/VendorCards';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useVendorRestaurant } from '@/hooks/useVendorRestaurant';
import { formatCurrency } from '@/utils/formatCurrency';

export default function VendorProfileScreen() {
  const restaurantState = useVendorRestaurant();
  const restaurant = restaurantState.data;

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Restaurant Profile" subtitle="Vendor-owned Firestore profile" leftIcon="arrow-back" onLeftPress={() => router.back()} rightIcon="create-outline" onRightPress={() => router.push('/(vendor)/edit-profile' as Href)} />
      {restaurantState.loading ? <LoadingState title="Loading restaurant" message="Fetching your restaurant profile." /> : null}
      {restaurantState.error ? <FriendlyErrorState title="Restaurant unavailable" message={restaurantState.error} onRetry={restaurantState.retry} /> : null}
      {!restaurant && !restaurantState.loading ? <EmptyState title="No restaurant profile" message="Create your restaurant profile before managing menu and orders." icon="storefront-outline" actionLabel="Create Profile" onActionPress={() => router.push('/(vendor)/edit-profile' as Href)} /> : null}
      {restaurant ? <>
        <View style={styles.profileCard}>
          <ProfileAvatar name={restaurant.name} size={76} />
          <View style={styles.profileCopy}>
            <AppBadge label={restaurant.active ? 'Visible to customers' : 'Hidden'} tone={restaurant.active ? 'success' : 'warning'} icon="storefront-outline" />
            <AppText variant="title">{restaurant.name}</AppText>
            <AppText tone="muted">{restaurant.description}</AppText>
          </View>
        </View>
        <View style={styles.statsGrid}>
          <VendorStatCard label="Delivery" value={`${restaurant.deliveryTimeMinutes} min`} icon="time-outline" />
          <VendorStatCard label="Fee" value={formatCurrency(restaurant.deliveryFee)} icon="bicycle-outline" tone="info" />
          <VendorStatCard label="Rating" value={`${restaurant.rating.toFixed(1)}`} icon="star-outline" tone="warning" />
          <VendorStatCard label="Reviews" value={`${restaurant.reviewsCount}`} icon="chatbubble-outline" tone="neutral" />
        </View>
        <View style={styles.section}><SectionHeader title="Profile Actions" /><AppButton label="Edit Restaurant Profile" leftIcon="create-outline" onPress={() => router.push('/(vendor)/edit-profile' as Href)} /><AppButton label={restaurant.active ? 'Hide Restaurant' : 'Activate Restaurant'} variant="outline" leftIcon={restaurant.active ? 'eye-off-outline' : 'eye-outline'} onPress={restaurantState.toggleActive} /></View>
      </> : null}
      <VendorBottomNavigation active="dashboard" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  profileCard: { alignItems: 'center', backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.xl, borderWidth: 1, flexDirection: 'row', gap: spacing.lg, padding: spacing.xl, ...shadows.card },
  profileCopy: { flex: 1, gap: spacing.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  section: { gap: spacing.md },
});
