import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { VendorBottomNavigation } from '@/components/vendor/VendorBottomNavigation';
import { VendorActionCard, VendorStatCard } from '@/components/vendor/VendorCards';
import { spacing } from '@/constants/theme';
import { useVendorAnalytics } from '@/hooks/useVendorAnalytics';
import { useVendorCategories, useVendorFoods } from '@/hooks/useVendorMenu';
import { useVendorOrders } from '@/hooks/useVendorOrders';
import { useVendorRestaurant } from '@/hooks/useVendorRestaurant';

export default function VendorMenuScreen() {
  const restaurantState = useVendorRestaurant();
  const foodsState = useVendorFoods(restaurantState.data?.id);
  const categoriesState = useVendorCategories(restaurantState.data?.id);
  const ordersState = useVendorOrders(restaurantState.data?.id);
  const analytics = useVendorAnalytics(ordersState.data, foodsState.data);
  const firstError = restaurantState.error ?? foodsState.error ?? categoriesState.error;

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Menu Management" subtitle="Food, categories, and availability" leftIcon="arrow-back" onLeftPress={() => router.back()} rightIcon="add-outline" onRightPress={() => router.push('/(vendor)/foods/add' as Href)} />
      {restaurantState.loading || foodsState.loading || categoriesState.loading ? <LoadingState title="Loading menu" message="Fetching vendor menu data from Firestore." /> : null}
      {firstError ? <FriendlyErrorState title="Menu unavailable" message={firstError} onRetry={async () => { await Promise.all([restaurantState.retry(), foodsState.retry(), categoriesState.retry()]); }} /> : null}
      {!restaurantState.data && !restaurantState.loading ? <EmptyState title="Restaurant required" message="Create your restaurant profile before managing menu items." icon="storefront-outline" actionLabel="Create Restaurant" onActionPress={() => router.push('/(vendor)/edit-profile' as Href)} /> : null}
      {restaurantState.data ? <>
        <View style={styles.statsGrid}><VendorStatCard label="Food Items" value={`${analytics.menuItems}`} icon="fast-food-outline" /><VendorStatCard label="Available" value={`${analytics.availableFoods}`} icon="checkmark-circle-outline" tone="success" /><VendorStatCard label="Categories" value={`${categoriesState.data.length}`} icon="grid-outline" tone="info" /></View>
        <View style={styles.section}><SectionHeader title="Menu Tools" /><VendorActionCard title="Food Management" subtitle="Edit, delete, and toggle availability" icon="fast-food-outline" badge={`${foodsState.data.length} items`} onPress={() => router.push('/(vendor)/food-management' as Href)} /><VendorActionCard title="Add Food" subtitle="Create a new Firestore food document" icon="add-circle-outline" onPress={() => router.push('/(vendor)/foods/add' as Href)} /><VendorActionCard title="Category Management" subtitle="Create and organize restaurant categories" icon="grid-outline" badge={`${categoriesState.data.length} groups`} onPress={() => router.push('/(vendor)/categories' as Href)} /></View>
        <AppBadge label="Food CRUD is scoped to the signed-in vendor restaurant." tone="info" icon="shield-checkmark-outline" />
      </> : null}
      <VendorBottomNavigation active="menu" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] }, statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }, section: { gap: spacing.md } });
