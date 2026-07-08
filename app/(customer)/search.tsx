import type { Href } from 'expo-router';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppDivider } from '@/components/common/AppDivider';
import { AppText } from '@/components/common/AppText';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { FoodCard } from '@/components/food/FoodCard';
import { RatingBadge } from '@/components/food/RatingBadge';
import { SearchBar } from '@/components/forms/SearchBar';
import { AppHeader } from '@/components/layout/AppHeader';
import { CustomerBottomNavigation } from '@/components/layout/CustomerBottomNavigation';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useCategories } from '@/hooks/useCategories';
import { useFoods } from '@/hooks/useFoods';
import { useRestaurants } from '@/hooks/useRestaurants';
import { mapFoodModel, mapRestaurantModel } from '@/utils/firestoreAdapters';
import { getRestaurantLogoSource } from '@/utils/localImages';

function openFood(foodId: string) { router.push({ pathname: '/(customer)/foods/[foodId]', params: { foodId } } as unknown as Href); }
function openRestaurant(restaurantId: string) { router.push({ pathname: '/(customer)/restaurants/[restaurantId]', params: { restaurantId } } as unknown as Href); }

export default function SearchScreen() {
  const params = useLocalSearchParams<{ category?: string; query?: string }>();
  const [query, setQuery] = useState(params.query ?? '');
  const normalizedQuery = query.trim().toLowerCase();
  const categoriesState = useCategories();
  const restaurantsState = useRestaurants({ filters: [{ field: 'active', value: true }], sort: [{ field: 'name' }] });
  const foodsState = useFoods({ filters: [{ field: 'available', value: true }], sort: [{ field: 'name' }] });
  const restaurants = restaurantsState.data.map((restaurant) => mapRestaurantModel(restaurant, categoriesState.data));
  const foods = foodsState.data.map((food) => mapFoodModel(food, restaurantsState.data, categoriesState.data));
  const selectedCategoryId = params.category;
  const results = useMemo(() => {
    const restaurantResults = restaurants.filter((restaurant) => {
      const source = [restaurant.name, restaurant.category, restaurant.description].join(' ').toLowerCase();
      const categoryMatch = !selectedCategoryId || selectedCategoryId === 'all' || restaurantsState.data.find((item) => item.id === restaurant.id)?.categoryIds.includes(selectedCategoryId);
      return categoryMatch && (!normalizedQuery || source.includes(normalizedQuery));
    });
    const foodResults = foods.filter((food) => {
      const source = [food.name, food.category, food.description, food.restaurantName].join(' ').toLowerCase();
      const categoryMatch = !selectedCategoryId || selectedCategoryId === 'all' || foodsState.data.find((item) => item.id === food.id)?.categoryId === selectedCategoryId;
      return categoryMatch && (!normalizedQuery || source.includes(normalizedQuery));
    });
    return { restaurants: restaurantResults, foods: foodResults };
  }, [foods, foodsState.data, normalizedQuery, restaurants, restaurantsState.data, selectedCategoryId]);
  const suggestions = foods.map((food) => food.name).filter((name) => !normalizedQuery || name.toLowerCase().includes(normalizedQuery)).slice(0, 4);
  const hasResults = results.restaurants.length > 0 || results.foods.length > 0;
  const isLoading = categoriesState.loading || restaurantsState.loading || foodsState.loading;
  const firstError = categoriesState.error ?? restaurantsState.error ?? foodsState.error;

  async function retryAll() { await Promise.all([categoriesState.retry(), restaurantsState.retry(), foodsState.retry()]); }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Search" subtitle="Find meals and restaurants" leftIcon="arrow-back" onLeftPress={() => router.back()} rightIcon="options-outline" onRightPress={() => router.push('/(customer)/search-filters' as Href)} />
      <SearchBar value={query} placeholder="Search YUMMY" autoFocus onChangeText={setQuery} onClear={() => setQuery('')} />
      <View style={styles.chipRow}><Pressable onPress={() => router.push('/(customer)/search-filters' as Href)}><AppBadge label="Filters" tone="primary" icon="funnel-outline" /></Pressable><Pressable onPress={() => router.push('/(customer)/search-sorting' as Href)}><AppBadge label="Sort" tone="primary" icon="swap-vertical-outline" /></Pressable></View>
      {isLoading ? <LoadingState title="Searching Firestore" message="Loading restaurants and meals." /> : null}
      {firstError ? <FriendlyErrorState title="Search unavailable" message={firstError} onRetry={retryAll} /> : null}
      {normalizedQuery ? <View style={styles.section}><SectionHeader title="Suggestions" /><View style={styles.suggestionList}>{suggestions.map((suggestion) => <Pressable key={suggestion} accessibilityRole="button" onPress={() => setQuery(suggestion)} style={styles.suggestionRow}><AppText>{suggestion}</AppText><AppBadge label="Meal" tone="info" /></Pressable>)}</View></View> : null}
      <AppDivider inset />
      {!isLoading && !firstError && !hasResults ? <EmptyState title="No matches found" message="Try another restaurant, meal, category, filter, or sorting option." icon="search" actionLabel="Clear search" onActionPress={() => setQuery('')} /> : <><View style={styles.section}><SectionHeader title="Restaurant Results" subtitle={`${results.restaurants.length} matches`} /><View style={styles.resultList}>{results.restaurants.map((restaurant) => <Pressable key={restaurant.id} accessibilityRole="button" onPress={() => openRestaurant(restaurant.id)} style={({ pressed }) => [styles.restaurantResult, pressed && styles.pressed]}><View style={styles.logoPlaceholder}><Image source={getRestaurantLogoSource(restaurant.logoUrl)} style={styles.logoImage} /></View><View style={styles.resultCopy}><AppText variant="bodyStrong" numberOfLines={1}>{restaurant.name}</AppText><AppText tone="muted" numberOfLines={1}>{restaurant.category} - {restaurant.deliveryTime}</AppText></View><RatingBadge rating={restaurant.rating} /></Pressable>)}</View></View><View style={styles.section}><SectionHeader title="Meal Results" subtitle={`${results.foods.length} matches`} /><View style={styles.resultList}>{results.foods.map((food) => <FoodCard key={food.id} name={food.name} description={food.description} price={food.price} category={food.category} rating={food.rating} available={food.availability} imageUrl={food.imageUrl} onPress={() => openFood(food.id)} onOrderPress={() => openFood(food.id)} />)}</View></View></>}
      <CustomerBottomNavigation active="search" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  section: { gap: spacing.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  suggestionList: { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, overflow: 'hidden', ...shadows.soft },
  suggestionRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between', minHeight: 52, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  resultList: { gap: spacing.md },
  restaurantResult: { alignItems: 'center', backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, flexDirection: 'row', gap: spacing.md, padding: spacing.md, ...shadows.soft },
  pressed: { opacity: 0.88 },
  logoPlaceholder: { alignItems: 'center', backgroundColor: colors.brand.primary, borderRadius: radius.lg, height: 52, justifyContent: 'center', overflow: 'hidden', width: 52 },
  logoImage: { height: '100%', width: '100%' },
  resultCopy: { flex: 1, gap: spacing.xs },
});

