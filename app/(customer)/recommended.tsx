import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
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

export default function RecommendedScreen() {
  const restaurantsState = useRestaurants({ filters: [{ field: 'active', value: true }], sort: [{ field: 'rating', direction: 'desc' }] });
  const foodsState = useFoods({ filters: [{ field: 'available', value: true }], sort: [{ field: 'createdAt', direction: 'desc' }] });
  const categoriesState = useCategories();
  const loading = restaurantsState.loading || foodsState.loading || categoriesState.loading;
  const error = restaurantsState.error ?? foodsState.error ?? categoriesState.error;
  const restaurants = restaurantsState.data.slice(0, 5).map((restaurant) => mapRestaurantModel(restaurant, categoriesState.data));
  const meals = foodsState.data.filter((food) => food.featured).slice(0, 6).map((food) => mapFoodModel(food, restaurantsState.data, categoriesState.data));
  const trending = foodsState.data.slice(0, 6).map((food) => mapFoodModel(food, restaurantsState.data, categoriesState.data));

  function retry() {
    void restaurantsState.retry();
    void foodsState.retry();
    void categoriesState.retry();
  }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Recommended" subtitle="Firestore-powered suggestions" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      {loading ? <LoadingState title="Loading recommendations" message="Fetching restaurants and meals from Firestore." /> : null}
      {error ? <FriendlyErrorState title="Recommendations unavailable" message={error} onRetry={retry} /> : null}
      {!loading && !error && restaurants.length === 0 && meals.length === 0 ? <EmptyState title="No recommendations yet" message="Recommended restaurants and meals will appear when Firestore has active menu data." icon="sparkles-outline" /> : null}
      <SectionHeader title="Recommended Restaurants" />
      <View style={styles.list}>{restaurants.map((restaurant) => <View key={restaurant.id} style={styles.restaurantCard}><ProfileAvatar name={restaurant.name} size={56} /><View style={styles.copy}><AppBadge label="Recommended" tone="primary" icon="sparkles-outline" /><AppText variant="bodyStrong">{restaurant.name}</AppText><RatingBadge rating={restaurant.rating} /></View></View>)}</View>
      <SectionHeader title="Recommended Meals" />
      <View style={styles.list}>{meals.map((food) => <FoodCard key={food.id} name={food.name} description={food.description} price={food.price} category={food.category} rating={food.rating} onPress={() => router.push({ pathname: '/(customer)/foods/[foodId]', params: { foodId: food.id } } as unknown as Href)} />)}</View>
      <SectionHeader title="Trending Dishes" />
      <View style={styles.list}>{trending.map((food) => <FoodCard key={`trend-${food.id}`} name={food.name} description={food.description} price={food.price} category={food.category} rating={food.rating} onPress={() => router.push({ pathname: '/(customer)/foods/[foodId]', params: { foodId: food.id } } as unknown as Href)} />)}</View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  list: { gap: spacing.md },
  restaurantCard: { alignItems: 'center', backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, flexDirection: 'row', gap: spacing.md, padding: spacing.md, ...shadows.soft },
  copy: { flex: 1, gap: spacing.sm },
});
