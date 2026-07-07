import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { FoodCard } from '@/components/food/FoodCard';
import { RatingBadge } from '@/components/food/RatingBadge';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useCategories } from '@/hooks/useCategories';
import { useFoods } from '@/hooks/useFoods';
import { useRestaurants } from '@/hooks/useRestaurants';
import { mapFoodModel, mapRestaurantModel } from '@/utils/firestoreAdapters';

function compareNewest(first?: string, second?: string) {
  return new Date(second ?? '').getTime() - new Date(first ?? '').getTime();
}

export default function RecentlyViewedScreen() {
  const restaurantsState = useRestaurants({ filters: [{ field: 'active', value: true }], sort: [{ field: 'updatedAt', direction: 'desc' }] });
  const foodsState = useFoods({ filters: [{ field: 'available', value: true }], sort: [{ field: 'updatedAt', direction: 'desc' }] });
  const categoriesState = useCategories();
  const loading = restaurantsState.loading || foodsState.loading || categoriesState.loading;
  const error = restaurantsState.error ?? foodsState.error ?? categoriesState.error;
  const restaurants = [...restaurantsState.data]
    .sort((first, second) => compareNewest(first.updatedAt ?? first.createdAt, second.updatedAt ?? second.createdAt))
    .slice(0, 5)
    .map((restaurant) => mapRestaurantModel(restaurant, categoriesState.data));
  const foods = [...foodsState.data]
    .sort((first, second) => compareNewest(first.updatedAt ?? first.createdAt, second.updatedAt ?? second.createdAt))
    .slice(0, 6)
    .map((food) => mapFoodModel(food, restaurantsState.data, categoriesState.data));

  function retry() {
    void restaurantsState.retry();
    void foodsState.retry();
    void categoriesState.retry();
  }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Recently Viewed" subtitle="Firestore-ready discovery history" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      {loading ? <LoadingState title="Loading recent items" message="Fetching restaurants and foods from Firestore." /> : null}
      {error ? <FriendlyErrorState title="Recent items unavailable" message={error} onRetry={retry} /> : null}
      {!loading && !error && restaurants.length === 0 && foods.length === 0 ? <EmptyState title="Nothing viewed yet" message="Recently viewed restaurants and foods will appear when Firestore has discovery data." icon="time-outline" /> : null}
      <SectionHeader title="Restaurants" />
      <View style={styles.list}>{restaurants.map((restaurant) => <View key={restaurant.id} style={styles.restaurantCard}><ProfileAvatar name={restaurant.name} size={56} /><View style={styles.copy}><AppText variant="bodyStrong">{restaurant.name}</AppText><AppText tone="muted">{restaurant.category} - {restaurant.deliveryTime}</AppText><RatingBadge rating={restaurant.rating} /></View></View>)}</View>
      <SectionHeader title="Foods" />
      <View style={styles.list}>{foods.map((food) => <FoodCard key={food.id} name={food.name} description={food.description} price={food.price} category={food.category} rating={food.rating} onPress={() => router.push({ pathname: '/(customer)/foods/[foodId]', params: { foodId: food.id } } as unknown as Href)} />)}</View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  list: { gap: spacing.md },
  restaurantCard: { alignItems: 'center', backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, flexDirection: 'row', gap: spacing.md, padding: spacing.md, ...shadows.soft },
  copy: { flex: 1, gap: spacing.sm },
});
