import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppText } from '@/components/common/AppText';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { FoodCard } from '@/components/food/FoodCard';
import { RatingBadge } from '@/components/food/RatingBadge';
import { AppHeader } from '@/components/layout/AppHeader';
import { CustomerBottomNavigation } from '@/components/layout/CustomerBottomNavigation';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useCategories } from '@/hooks/useCategories';
import { useFavorites } from '@/hooks/useFavorites';
import { useFoods } from '@/hooks/useFoods';
import { useRestaurants } from '@/hooks/useRestaurants';
import { mapFoodModel, mapRestaurantModel } from '@/utils/firestoreAdapters';

function openRestaurant(restaurantId: string) { router.push({ pathname: '/(customer)/restaurants/[restaurantId]', params: { restaurantId } } as unknown as Href); }
function openFood(foodId: string) { router.push({ pathname: '/(customer)/foods/[foodId]', params: { foodId } } as unknown as Href); }

export default function FavoritesScreen() {
  const favoritesState = useFavorites();
  const restaurantsState = useRestaurants();
  const foodsState = useFoods();
  const categoriesState = useCategories();
  const restaurantIds = new Set(favoritesState.data.filter((favorite) => favorite.targetType === 'restaurant').map((favorite) => favorite.targetId));
  const foodIds = new Set(favoritesState.data.filter((favorite) => favorite.targetType === 'food').map((favorite) => favorite.targetId));
  const favoriteRestaurants = restaurantsState.data.filter((restaurant) => restaurantIds.has(restaurant.id)).map((restaurant) => mapRestaurantModel(restaurant, categoriesState.data));
  const favoriteFoods = foodsState.data.filter((food) => foodIds.has(food.id)).map((food) => mapFoodModel(food, restaurantsState.data, categoriesState.data));
  const isLoading = favoritesState.loading || restaurantsState.loading || foodsState.loading || categoriesState.loading;
  const firstError = favoritesState.error ?? restaurantsState.error ?? foodsState.error ?? categoriesState.error;
  const isEmpty = favoriteRestaurants.length === 0 && favoriteFoods.length === 0;

  async function retryAll() { await Promise.all([favoritesState.retry(), restaurantsState.retry(), foodsState.retry(), categoriesState.retry()]); }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Favorites" subtitle="Saved meals and restaurants" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      {isLoading ? <LoadingState title="Loading favorites" message="Fetching saved Firestore items." /> : null}
      {firstError ? <FriendlyErrorState title="Unable to load favorites" message={firstError} onRetry={retryAll} /> : null}
      {!isLoading && !firstError && isEmpty ? <EmptyState title="No favorites yet" message="Saved Firestore restaurants and meals will appear here." icon="heart-outline" actionLabel="Browse restaurants" onActionPress={() => router.push('/(customer)/home' as Href)} /> : null}

      {favoriteRestaurants.length > 0 ? <View style={styles.section}><SectionHeader title="Saved Restaurants" subtitle={`${favoriteRestaurants.length} saved`} /><View style={styles.list}>{favoriteRestaurants.map((restaurant) => <Pressable key={restaurant.id} accessibilityRole="button" onPress={() => openRestaurant(restaurant.id)} style={({ pressed }) => [styles.restaurantCard, pressed && styles.pressed]}><View style={styles.logoPlaceholder}><AppText variant="label" tone="inverse" numberOfLines={1}>{restaurant.name.slice(0, 2).toUpperCase()}</AppText></View><View style={styles.restaurantCopy}><AppText variant="bodyStrong" numberOfLines={1}>{restaurant.name}</AppText><AppText tone="muted" numberOfLines={1}>{restaurant.category} - {restaurant.deliveryTime}</AppText><RatingBadge rating={restaurant.rating} count={restaurant.reviewsCount} /></View><AppBadge label="Saved" tone="success" icon="heart" /></Pressable>)}</View></View> : null}
      {favoriteFoods.length > 0 ? <View style={styles.section}><SectionHeader title="Saved Meals" subtitle={`${favoriteFoods.length} saved`} /><View style={styles.list}>{favoriteFoods.map((food) => <View key={food.id} style={styles.savedFoodWrap}><FoodCard name={food.name} description={food.description} price={food.price} category={food.category} rating={food.rating} available={food.availability} onPress={() => openFood(food.id)} onOrderPress={() => openFood(food.id)} /></View>)}</View></View> : null}
      <CustomerBottomNavigation active="favorites" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  section: { gap: spacing.md },
  list: { gap: spacing.md },
  restaurantCard: { alignItems: 'center', backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, flexDirection: 'row', gap: spacing.md, padding: spacing.md, ...shadows.soft },
  pressed: { opacity: 0.88 },
  logoPlaceholder: { alignItems: 'center', backgroundColor: colors.brand.primary, borderRadius: radius.lg, height: 58, justifyContent: 'center', width: 58 },
  restaurantCopy: { flex: 1, gap: spacing.sm },
  savedFoodWrap: { gap: spacing.sm },
});
