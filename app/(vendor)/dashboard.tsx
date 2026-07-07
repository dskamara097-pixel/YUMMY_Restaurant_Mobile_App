import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { VendorBottomNavigation } from '@/components/vendor/VendorBottomNavigation';
import { VendorActionCard, VendorStatCard } from '@/components/vendor/VendorCards';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useVendorAnalytics } from '@/hooks/useVendorAnalytics';
import { useVendorFoods } from '@/hooks/useVendorMenu';
import { useVendorOrders } from '@/hooks/useVendorOrders';
import { useVendorRestaurant } from '@/hooks/useVendorRestaurant';
import { formatCurrency } from '@/utils/formatCurrency';

export default function VendorDashboardScreen() {
  const restaurantState = useVendorRestaurant();
  const restaurant = restaurantState.data;
  const foodsState = useVendorFoods(restaurant?.id);
  const ordersState = useVendorOrders(restaurant?.id);
  const analytics = useVendorAnalytics(ordersState.data, foodsState.data);
  const firstError = restaurantState.error ?? foodsState.error ?? ordersState.error;

  async function retryAll() { await Promise.all([restaurantState.retry(), foodsState.retry(), ordersState.retry()]); }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Vendor Dashboard" subtitle={restaurant?.name ?? 'Restaurant owner workspace'} leftIcon="arrow-back" onLeftPress={() => router.back()} />
      {restaurantState.loading ? <LoadingState title="Loading vendor workspace" message="Fetching your restaurant profile from Firestore." /> : null}
      {firstError ? <FriendlyErrorState title="Vendor data unavailable" message={firstError} onRetry={retryAll} /> : null}
      {!restaurant && !restaurantState.loading ? <View style={styles.setupCard}><AppText variant="title">Create your restaurant profile</AppText><AppText tone="muted">Vendor tools unlock after your restaurant document is created.</AppText><AppButton label="Set Up Restaurant" leftIcon="storefront-outline" onPress={() => router.push('/(vendor)/edit-profile' as Href)} /></View> : null}
      {restaurant ? <>
        <View style={styles.heroCard}><AppBadge label={restaurant.active ? 'Active restaurant' : 'Hidden from customers'} tone={restaurant.active ? 'success' : 'warning'} icon="storefront-outline" /><AppText variant="title">{restaurant.name}</AppText><AppText tone="muted">{restaurant.description}</AppText></View>
        <View style={styles.statsGrid}>
          <VendorStatCard label="Sales" value={formatCurrency(analytics.salesTotal)} icon="cash-outline" tone="success" />
          <VendorStatCard label="Orders" value={`${analytics.totalOrders}`} icon="receipt-outline" />
          <VendorStatCard label="Pending" value={`${analytics.pendingOrders}`} icon="time-outline" tone="warning" />
          <VendorStatCard label="Menu" value={`${analytics.menuItems}`} icon="fast-food-outline" tone="info" />
        </View>
        <View style={styles.section}><SectionHeader title="Management" subtitle="Firestore-backed vendor actions" />
          <VendorActionCard title="Restaurant Profile" subtitle="View and update restaurant identity" icon="storefront-outline" onPress={() => router.push('/(vendor)/profile' as Href)} />
          <VendorActionCard title="Menu Management" subtitle="Food items, categories, and availability" icon="fast-food-outline" badge={`${analytics.availableFoods} available`} onPress={() => router.push('/(vendor)/menu' as Href)} />
          <VendorActionCard title="Order Management" subtitle="Accept, reject, and update order status" icon="receipt-outline" badge={`${analytics.pendingOrders} pending`} onPress={() => router.push('/(vendor)/orders' as Href)} />
          <VendorActionCard title="Coupons & Offers" subtitle="Manage restaurant promotions" icon="gift-outline" onPress={() => router.push('/(vendor)/offers' as Href)} />
          <VendorActionCard title="Analytics" subtitle="Sales and order summary" icon="analytics-outline" onPress={() => router.push('/(vendor)/analytics' as Href)} />
        </View>
      </> : null}
      <AppBadge label="No admin panel, payments, maps, GPS, or push notifications were added." tone="info" icon="information-circle-outline" />
      <VendorBottomNavigation active="dashboard" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  setupCard: { backgroundColor: colors.neutral.surface, borderRadius: radius.lg, gap: spacing.md, padding: spacing.xl, ...shadows.card },
  heroCard: { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.xl, borderWidth: 1, gap: spacing.md, padding: spacing.xl, ...shadows.card },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  section: { gap: spacing.md },
});
