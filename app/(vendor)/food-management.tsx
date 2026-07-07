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
import { VendorEntityCard } from '@/components/vendor/VendorCards';
import { spacing } from '@/constants/theme';
import { useVendorFoods } from '@/hooks/useVendorMenu';
import { useVendorRestaurant } from '@/hooks/useVendorRestaurant';
import { formatCurrency } from '@/utils/formatCurrency';

export default function VendorFoodManagementScreen() {
  const restaurantState = useVendorRestaurant();
  const foodsState = useVendorFoods(restaurantState.data?.id);
  const firstError = restaurantState.error ?? foodsState.error;

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Food Management" subtitle="Add, edit, delete, and toggle" leftIcon="arrow-back" onLeftPress={() => router.back()} rightIcon="add-outline" onRightPress={() => router.push('/(vendor)/foods/add' as Href)} />
      {restaurantState.loading || foodsState.loading ? <LoadingState title="Loading food" message="Fetching restaurant food items." /> : null}
      {firstError ? <FriendlyErrorState title="Food unavailable" message={firstError} onRetry={async () => { await Promise.all([restaurantState.retry(), foodsState.retry()]); }} /> : null}
      {!foodsState.loading && !firstError && foodsState.data.length === 0 ? <EmptyState title="No food items" message="Add your first food item to begin menu management." icon="fast-food-outline" actionLabel="Add Food" onActionPress={() => router.push('/(vendor)/foods/add' as Href)} /> : null}
      <View style={styles.section}><SectionHeader title="Menu Items" subtitle={`${foodsState.data.length} Firestore records`} />{foodsState.data.map((food) => <VendorEntityCard key={food.id} title={food.name} subtitle={food.description} meta={`${formatCurrency(food.price)} - ${food.ingredients.join(', ') || 'No ingredients listed'}`} badge={food.available ? 'Available' : 'Hidden'} badgeTone={food.available ? 'success' : 'warning'} onPress={() => router.push({ pathname: '/(vendor)/foods/[foodId]', params: { foodId: food.id } } as unknown as Href)} primaryActionLabel={food.available ? 'Hide' : 'Show'} onPrimaryAction={() => foodsState.toggleAvailability(food)} secondaryActionLabel="Edit" onSecondaryAction={() => router.push({ pathname: '/(vendor)/foods/[foodId]', params: { foodId: food.id } } as unknown as Href)} dangerActionLabel="Delete" onDangerAction={() => foodsState.deleteFood(food.id)} />)}</View>
      <AppBadge label="Delete removes the Firestore food document for this vendor restaurant." tone="warning" icon="warning-outline" />
      <VendorBottomNavigation active="menu" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] }, section: { gap: spacing.md } });
