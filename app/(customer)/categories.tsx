import type { Href } from 'expo-router';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { CategoryCard } from '@/components/food/CategoryCard';
import { FoodCard } from '@/components/food/FoodCard';
import { AppHeader } from '@/components/layout/AppHeader';
import { CustomerBottomNavigation } from '@/components/layout/CustomerBottomNavigation';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useCategories } from '@/hooks/useCategories';
import { useFoods } from '@/hooks/useFoods';
import { useRestaurants } from '@/hooks/useRestaurants';
import { mapFoodModel, mapRestaurantModel } from '@/utils/firestoreAdapters';

function openFood(foodId: string) {
  router.push({ pathname: '/(customer)/foods/[foodId]', params: { foodId } } as unknown as Href);
}

export default function CategoriesScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const categoriesState = useCategories();
  const restaurantsState = useRestaurants({ filters: [{ field: 'active', value: true }], sort: [{ field: 'name' }] });
  const foodsState = useFoods({ filters: [{ field: 'available', value: true }], sort: [{ field: 'name' }] });
  const [selectedCategory, setSelectedCategory] = useState(params.category ?? 'all');

  const selectedFilter = selectedCategory === 'all' ? null : selectedCategory;
  const restaurants = restaurantsState.data.map((restaurant) => mapRestaurantModel(restaurant, categoriesState.data));
  const foods = foodsState.data.map((food) => mapFoodModel(food, restaurantsState.data, categoriesState.data));
  const matchingFoods = useMemo(() => foods.filter((food) => !selectedFilter || foodsState.data.find((item) => item.id === food.id)?.categoryId === selectedFilter), [foods, foodsState.data, selectedFilter]);
  const matchingRestaurants = useMemo(() => restaurants.filter((restaurant) => !selectedFilter || restaurantsState.data.find((item) => item.id === restaurant.id)?.categoryIds.includes(selectedFilter)), [restaurants, restaurantsState.data, selectedFilter]);
  const isLoading = categoriesState.loading || restaurantsState.loading || foodsState.loading;
  const firstError = categoriesState.error ?? restaurantsState.error ?? foodsState.error;

  async function retryAll() {
    await Promise.all([categoriesState.retry(), restaurantsState.retry(), foodsState.retry()]);
  }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Categories" subtitle="Browse meals by craving" leftIcon="arrow-back" onLeftPress={() => router.back()} rightIcon="search" onRightPress={() => router.push('/(customer)/search' as Href)} />

      {isLoading ? <LoadingState title="Loading categories" message="Fetching categories, restaurants, and foods from Firestore." /> : null}
      {firstError ? <FriendlyErrorState title="Unable to load categories" message={firstError} onRetry={retryAll} /> : null}

      <View style={styles.filterRow}>
        <Pressable accessibilityRole="button" accessibilityState={{ selected: selectedCategory === 'all' }} onPress={() => setSelectedCategory('all')}><AppBadge label="All" icon="grid-outline" tone={selectedCategory === 'all' ? 'primary' : 'neutral'} /></Pressable>
        {categoriesState.data.map((category) => <Pressable key={category.id} accessibilityRole="button" accessibilityState={{ selected: selectedCategory === category.id }} onPress={() => setSelectedCategory(category.id)}><AppBadge label={category.name} icon="restaurant-outline" tone={selectedCategory === category.id ? 'primary' : 'neutral'} /></Pressable>)}
      </View>

      <View style={styles.categoryGrid}>
        {categoriesState.data.map((category) => <View key={category.id} style={styles.categoryCell}><CategoryCard title={category.name} subtitle={category.description ?? 'Browse meals'} selected={selectedCategory === category.id} onPress={() => setSelectedCategory(category.id)} /></View>)}
      </View>

      {!isLoading && !firstError && categoriesState.data.length === 0 ? <EmptyState title="No categories yet" message="Create category documents in Firestore to populate this screen." icon="grid-outline" /> : null}

      <View style={styles.section}>
        <SectionHeader title="Restaurants" subtitle={`${matchingRestaurants.length} Firestore results`} />
        <View style={styles.restaurantList}>{matchingRestaurants.map((restaurant) => <Pressable key={restaurant.id} accessibilityRole="button" onPress={() => router.push({ pathname: '/(customer)/restaurants/[restaurantId]', params: { restaurantId: restaurant.id } } as unknown as Href)} style={({ pressed }) => [styles.restaurantCard, pressed && styles.pressed]}><View style={styles.logoPlaceholder}><AppText variant="label" tone="inverse" numberOfLines={1}>{restaurant.name.slice(0, 2).toUpperCase()}</AppText></View><View style={styles.restaurantCopy}><AppText variant="bodyStrong" numberOfLines={1}>{restaurant.name}</AppText><AppText tone="muted" numberOfLines={2}>{restaurant.description}</AppText><View style={styles.metaRow}><AppBadge label={restaurant.deliveryTime} icon="time-outline" /><AppBadge label={restaurant.distance} icon="location-outline" /></View></View></Pressable>)}</View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Category Meals" subtitle="Tap a meal to preview details" />
        <View style={styles.foodList}>{matchingFoods.map((food) => <FoodCard key={food.id} name={food.name} description={food.description} price={food.price} category={food.category} rating={food.rating} available={food.availability} onPress={() => openFood(food.id)} onOrderPress={() => openFood(food.id)} />)}</View>
      </View>

      <AppButton label="Search this category" leftIcon="search" onPress={() => router.push({ pathname: '/(customer)/search', params: { category: selectedCategory } } as unknown as Href)} />
      <CustomerBottomNavigation active="categories" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  categoryCell: { flex: 1, minWidth: 148 },
  section: { gap: spacing.md },
  restaurantList: { gap: spacing.md },
  restaurantCard: { alignItems: 'center', backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, flexDirection: 'row', gap: spacing.md, padding: spacing.md, ...shadows.soft },
  pressed: { opacity: 0.88 },
  logoPlaceholder: { alignItems: 'center', backgroundColor: colors.brand.primary, borderRadius: radius.lg, height: 58, justifyContent: 'center', width: 58 },
  restaurantCopy: { flex: 1, gap: spacing.sm },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  foodList: { gap: spacing.md },
});
