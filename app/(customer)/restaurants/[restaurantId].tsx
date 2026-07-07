import type { Href } from 'expo-router';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppDivider } from '@/components/common/AppDivider';
import { AppIcon } from '@/components/common/AppIcon';
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
import { useFoodsByRestaurant } from '@/hooks/useFoods';
import { useRestaurant, useRestaurants } from '@/hooks/useRestaurants';
import { mapFoodModel, mapRestaurantModel } from '@/utils/firestoreAdapters';

function openFood(foodId: string) { router.push({ pathname: '/(customer)/foods/[foodId]', params: { foodId } } as unknown as Href); }

export default function RestaurantDetailsScreen() {
  const { restaurantId } = useLocalSearchParams<{ restaurantId?: string }>();
  const restaurantState = useRestaurant(restaurantId);
  const restaurantsState = useRestaurants();
  const categoriesState = useCategories();
  const foodsState = useFoodsByRestaurant(restaurantId);
  const firstError = restaurantState.error ?? foodsState.error ?? categoriesState.error;

  if (restaurantState.loading || foodsState.loading || categoriesState.loading) {
    return <ScreenContainer contentStyle={styles.centeredScreen}><LoadingState title="Loading restaurant" message="Fetching restaurant details from Firestore." /></ScreenContainer>;
  }

  if (firstError) {
    return <ScreenContainer contentStyle={styles.centeredScreen}><FriendlyErrorState title="Unable to load restaurant" message={firstError} onRetry={async () => { await Promise.all([restaurantState.retry(), foodsState.retry(), categoriesState.retry()]); }} /></ScreenContainer>;
  }

  if (!restaurantState.data) {
    return <ScreenContainer contentStyle={styles.centeredScreen}><EmptyState title="Restaurant not found" message="This Firestore restaurant document is not available." icon="restaurant-outline" actionLabel="Back to Home" onActionPress={() => router.replace('/(customer)/home' as Href)} /></ScreenContainer>;
  }

  const restaurant = mapRestaurantModel(restaurantState.data, categoriesState.data);
  const menuItems = foodsState.data.map((food) => mapFoodModel(food, restaurantsState.data, categoriesState.data));
  const menuCategoryIds = new Set(foodsState.data.map((food) => food.categoryId));
  const menuCategories = categoriesState.data.filter((category) => menuCategoryIds.has(category.id));

  return (
    <ScreenContainer scroll padded={false} contentStyle={styles.screen}>
      <View style={styles.cover}><AppHeader title="Restaurant" leftIcon="arrow-back" onLeftPress={() => router.back()} rightIcon="heart-outline" /><View style={styles.coverContent}><View style={styles.coverIcon}><AppIcon name="restaurant-outline" size={54} color={colors.brand.primary} /></View><AppBadge label="Firestore restaurant" tone="info" /></View></View>
      <View style={styles.content}>
        <View style={styles.identityRow}><ProfileAvatar name={restaurant.name} size={72} /><View style={styles.identityCopy}><AppText variant="title" numberOfLines={2}>{restaurant.name}</AppText><AppText tone="muted">{restaurant.category} restaurant</AppText><RatingBadge rating={restaurant.rating} count={restaurant.reviewsCount} /></View></View>
        <View style={styles.metaGrid}><AppBadge label={restaurant.deliveryTime} icon="time-outline" tone="primary" /><AppBadge label={restaurant.distance} icon="location-outline" /><AppBadge label={`Delivery SLE ${restaurant.deliveryFee}`} icon="bicycle-outline" /></View>
        <AppText tone="muted">{restaurant.description}</AppText>
        <AppButton label="View Reviews" variant="outline" leftIcon="star-outline" onPress={() => router.push({ pathname: '/(customer)/restaurant-reviews', params: { restaurantId: restaurant.id } } as unknown as Href)} />
        <AppDivider inset />
        <View style={styles.section}><SectionHeader title="Menu Categories" subtitle="Firestore menu groups" /><View style={styles.chipRow}>{menuCategories.map((category) => <AppBadge key={category.id} label={category.name} icon="restaurant-outline" tone="primary" />)}</View></View>
        <View style={styles.section}><SectionHeader title="Food Menu" subtitle={`${menuItems.length} meals available`} /><View style={styles.foodList}>{menuItems.map((food) => <FoodCard key={food.id} name={food.name} description={food.description} price={food.price} category={food.category} rating={food.rating} available={food.availability} onPress={() => openFood(food.id)} onOrderPress={() => openFood(food.id)} />)}</View></View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.neutral.canvas },
  centeredScreen: { justifyContent: 'center' },
  cover: { backgroundColor: colors.brand.primary, gap: spacing.xl, minHeight: 280, padding: spacing.xl, paddingTop: spacing['2xl'] },
  coverContent: { alignItems: 'center', flex: 1, gap: spacing.lg, justifyContent: 'center' },
  coverIcon: { alignItems: 'center', backgroundColor: colors.neutral.surface, borderRadius: radius.xl, height: 124, justifyContent: 'center', width: 124, ...shadows.card },
  content: { gap: spacing.xl, padding: spacing.xl },
  identityRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.lg },
  identityCopy: { flex: 1, gap: spacing.sm },
  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  section: { gap: spacing.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  foodList: { gap: spacing.md },
});
