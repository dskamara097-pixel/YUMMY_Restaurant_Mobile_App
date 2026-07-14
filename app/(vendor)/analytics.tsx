import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppText } from '@/components/common/AppText';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { VendorBottomNavigation } from '@/components/vendor/VendorBottomNavigation';
import { VendorStatCard } from '@/components/vendor/VendorCards';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useVendorAnalytics } from '@/hooks/useVendorAnalytics';
import { useVendorFoods } from '@/hooks/useVendorMenu';
import { useVendorOrders } from '@/hooks/useVendorOrders';
import { useVendorRestaurant } from '@/hooks/useVendorRestaurant';
import { formatCurrency } from '@/utils/formatCurrency';

export default function VendorAnalyticsScreen() {
  const restaurantState = useVendorRestaurant();
  const foodsState = useVendorFoods(restaurantState.data?.id);
  const ordersState = useVendorOrders(restaurantState.data?.id);
  const analytics = useVendorAnalytics(ordersState.data, foodsState.data);
  const firstError = restaurantState.error ?? foodsState.error ?? ordersState.error;

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Restaurant Analytics" subtitle="Sales and order summary" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      {restaurantState.loading || foodsState.loading || ordersState.loading ? <LoadingState title="Loading analytics" message="Calculating from Firestore orders and menu data." /> : null}
      {firstError ? <FriendlyErrorState title="Analytics unavailable" message={firstError} onRetry={async () => { await Promise.all([restaurantState.retry(), foodsState.retry(), ordersState.retry()]); }} /> : null}
      <View style={styles.statsGrid}>
        <VendorStatCard label="Sales Summary" value={formatCurrency(analytics.salesTotal)} icon="cash-outline" tone="success" />
        <VendorStatCard label="Daily Sales" value={formatCurrency(analytics.todayRevenue)} icon="calendar-outline" tone="success" />
        <VendorStatCard label="Monthly Sales" value={formatCurrency(analytics.monthlyRevenue)} icon="analytics-outline" tone="success" />
        <VendorStatCard label="Total Orders" value={`${analytics.totalOrders}`} icon="receipt-outline" />
        <VendorStatCard label="Pending" value={`${analytics.pendingOrders}`} icon="time-outline" tone="warning" />
        <VendorStatCard label="Preparing" value={`${analytics.preparingOrders}`} icon="flame-outline" tone="warning" />
        <VendorStatCard label="Ready" value={`${analytics.readyOrders}`} icon="checkmark-circle-outline" tone="info" />
        <VendorStatCard label="Out for Delivery" value={`${analytics.outForDeliveryOrders}`} icon="bicycle-outline" tone="info" />
        <VendorStatCard label="Completed" value={`${analytics.completedOrders}`} icon="checkmark-circle-outline" tone="success" />
        <VendorStatCard label="Cancelled" value={`${analytics.cancelledOrders}`} icon="close-circle-outline" tone="danger" />
        <VendorStatCard label="Average Order" value={formatCurrency(analytics.averageOrderValue)} icon="analytics-outline" tone="info" />
        <VendorStatCard label="Popular Food" value={analytics.mostPopularFood} icon="fast-food-outline" tone="info" />
        <VendorStatCard label="Average Rating" value={`${restaurantState.data?.rating.toFixed(1) ?? '0.0'}`} icon="star-outline" tone="warning" />
      </View>
      <View style={styles.panel}><SectionHeader title="Operational Notes" /><AppText tone="muted">Analytics are calculated locally from the restaurant's Firestore orders and menu items to avoid unnecessary composite indexes.</AppText><AppBadge label="No payment gateway, GPS, or external analytics API is connected." tone="info" icon="card-outline" /></View>
      <VendorBottomNavigation active="dashboard" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] }, statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }, panel: { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, gap: spacing.md, padding: spacing.lg, ...shadows.soft } });
