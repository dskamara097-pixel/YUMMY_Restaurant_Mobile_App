import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { FoodCard } from '@/components/food/FoodCard';
import { RatingBadge } from '@/components/food/RatingBadge';
import { SearchBar } from '@/components/forms/SearchBar';
import { CustomerBottomNavigation } from '@/components/layout/CustomerBottomNavigation';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { AppIconName, colors, radius, shadows, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { useFoods } from '@/hooks/useFoods';
import { useOffers } from '@/hooks/useOffers';
import { useRestaurants } from '@/hooks/useRestaurants';
import { FoodItem, Restaurant } from '@/types';
import { mapFoodModel, mapOfferModel, mapRestaurantModel } from '@/utils/firestoreAdapters';

function openRestaurant(restaurantId: string) {
  router.push({ pathname: '/(customer)/restaurants/[restaurantId]', params: { restaurantId } } as unknown as Href);
}

function openFood(foodId: string) {
  router.push({ pathname: '/(customer)/foods/[foodId]', params: { foodId } } as unknown as Href);
}

function RestaurantSummaryCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Pressable accessibilityRole="button" onPress={() => openRestaurant(restaurant.id)} style={({ pressed }) => [styles.restaurantCard, pressed && styles.pressed]}>
      <ProfileAvatar name={restaurant.name} size={58} />
      <View style={styles.restaurantCopy}>
        <View style={styles.cardTitleRow}>
          <AppText variant="bodyStrong" numberOfLines={1}>{restaurant.name}</AppText>
          <RatingBadge rating={restaurant.rating} count={restaurant.reviewsCount} />
        </View>
        <AppText tone="muted" numberOfLines={2}>{restaurant.description}</AppText>
        <View style={styles.metaRow}>
          <AppBadge label={restaurant.deliveryTime} icon="time-outline" />
          <AppBadge label={restaurant.distance} icon="location-outline" />
        </View>
      </View>
    </Pressable>
  );
}

function MealCard({ food }: { food: FoodItem }) {
  return <FoodCard name={food.name} description={food.description} price={food.price} category={food.category} rating={food.rating} available={food.availability} onPress={() => openFood(food.id)} onOrderPress={() => openFood(food.id)} />;
}

export default function CustomerHomeScreen() {
  const auth = useAuth();
  const categoriesState = useCategories();
  const restaurantsState = useRestaurants({ filters: [{ field: 'active', value: true }], sort: [{ field: 'rating', direction: 'desc' }] });
  const foodsState = useFoods({ filters: [{ field: 'available', value: true }], sort: [{ field: 'name' }] });
  const offersState = useOffers();

  const restaurants = restaurantsState.data.map((restaurant) => mapRestaurantModel(restaurant, categoriesState.data));
  const foods = foodsState.data.map((food) => mapFoodModel(food, restaurantsState.data, categoriesState.data));
  const offers = offersState.data.map(mapOfferModel);
  const popularRestaurants = restaurants.filter((restaurant) => restaurant.popular).slice(0, 4);
  const featuredMeals = foods.filter((food) => food.featured).slice(0, 3);
  const recommendedMeals = foods.filter((food) => food.recommended).slice(0, 3);
  const isLoading = categoriesState.loading || restaurantsState.loading || foodsState.loading || offersState.loading;
  const firstError = categoriesState.error ?? restaurantsState.error ?? foodsState.error ?? offersState.error;

  async function retryAll() {
    await Promise.all([categoriesState.retry(), restaurantsState.retry(), foodsState.retry(), offersState.retry()]);
  }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <View style={styles.heroHeader}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}><AppIcon name="restaurant-outline" size={24} color={colors.neutral.surface} /></View>
          <View style={styles.brandCopy}>
            <AppText variant="caption" tone="muted">Good evening, {(auth.displayName ?? 'Customer').split(' ')[0]}</AppText>
            <AppText variant="title" numberOfLines={1}>YUMMY</AppText>
          </View>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Open profile" onPress={() => router.push('/(customer)/profile' as Href)}>
          <ProfileAvatar name={auth.displayName ?? 'YUMMY Customer'} size={48} />
        </Pressable>
      </View>

      <SearchBar value="" placeholder="Search meals, restaurants, or categories" onFocus={() => router.push('/(customer)/search' as Href)} />

      <View style={styles.promoBanner}>
        <View style={styles.promoCopy}>
          <AppBadge label="Firestore live" tone="warning" icon="flame-outline" />
          <AppText variant="title" tone="inverse">Warm meals, fast delivery.</AppText>
          <AppText tone="inverse">Discover restaurants and meals from the YUMMY Firestore database.</AppText>
        </View>
        <View style={styles.promoIcon}><AppIcon name="fast-food-outline" size={42} color={colors.brand.primary} /></View>
      </View>

      {isLoading ? <LoadingState title="Loading YUMMY" message="Fetching restaurants, meals, categories, and offers from Firestore." /> : null}
      {firstError ? <FriendlyErrorState title="Unable to load menu" message={firstError} onRetry={retryAll} /> : null}
      {!isLoading && !firstError && restaurants.length === 0 && foods.length === 0 ? <EmptyState title="No Firestore menu yet" message="Add restaurants, categories, foods, and offers in Firestore to populate the home screen." icon="restaurant-outline" /> : null}

      <View style={styles.section}>
        <SectionHeader title="Food Categories" actionLabel="View all" onActionPress={() => router.push('/(customer)/categories' as Href)} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {categoriesState.data.slice(0, 8).map((category) => (
            <Pressable key={category.id} onPress={() => router.push({ pathname: '/(customer)/search', params: { category: category.id } } as unknown as Href)} style={styles.categoryItem}>
              <CategoryPreview title={category.name} subtitle={category.description ?? 'Browse meals'} icon={(category.iconName ?? 'restaurant-outline') as AppIconName} />
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}><SectionHeader title="Popular Restaurants" subtitle="Highly rated kitchens" /><View style={styles.cardList}>{popularRestaurants.map((restaurant) => <RestaurantSummaryCard key={restaurant.id} restaurant={restaurant} />)}</View></View>
      <View style={styles.section}><SectionHeader title="Featured Meals" subtitle="Fresh picks from Firestore" /><View style={styles.cardList}>{featuredMeals.map((food) => <MealCard key={food.id} food={food} />)}</View></View>
      <View style={styles.section}><SectionHeader title="Recommended Meals" subtitle="Personalization-ready Firestore picks" /><View style={styles.cardList}>{recommendedMeals.map((food) => <MealCard key={food.id} food={food} />)}</View></View>
      <View style={styles.section}>
        <SectionHeader title="Special Offers" subtitle="Promotions from Firestore" />
        <View style={styles.offerGrid}>{offers.map((offer) => <Pressable key={offer.id} accessibilityRole="button" style={({ pressed }) => [styles.offerCard, pressed && styles.pressed]}><AppBadge label={offer.badgeLabel} tone="primary" icon="pricetag-outline" /><AppText variant="bodyStrong">{offer.title}</AppText><AppText tone="muted" numberOfLines={2}>{offer.description}</AppText></Pressable>)}</View>
      </View>

      <CustomerBottomNavigation active="home" />
    </ScreenContainer>
  );
}

function CategoryPreview({ title, subtitle, icon }: { title: string; subtitle: string; icon: AppIconName }) {
  return <View style={styles.categoryPreview}><View style={styles.categoryIconWrap}><AppIcon name={icon} size={24} color={colors.brand.primary} /></View><AppText variant="label" numberOfLines={1}>{title}</AppText><AppText variant="caption" tone="muted" numberOfLines={1}>{subtitle}</AppText></View>;
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  heroHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  brandRow: { alignItems: 'center', flex: 1, flexDirection: 'row', gap: spacing.md },
  brandMark: { alignItems: 'center', backgroundColor: colors.brand.primary, borderRadius: radius.lg, height: 52, justifyContent: 'center', width: 52, ...shadows.soft },
  brandCopy: { flex: 1, gap: spacing.xs },
  promoBanner: { alignItems: 'center', backgroundColor: colors.brand.primary, borderRadius: radius.xl, flexDirection: 'row', gap: spacing.lg, overflow: 'hidden', padding: spacing.xl, ...shadows.card },
  promoCopy: { flex: 1, gap: spacing.sm },
  promoIcon: { alignItems: 'center', backgroundColor: colors.neutral.surface, borderRadius: radius.xl, height: 86, justifyContent: 'center', width: 86 },
  section: { gap: spacing.md },
  horizontalList: { gap: spacing.md, paddingRight: spacing.xl },
  categoryItem: { width: 150 },
  categoryPreview: { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, gap: spacing.sm, minHeight: 140, padding: spacing.md, ...shadows.soft },
  categoryIconWrap: { alignItems: 'center', backgroundColor: colors.brand.primarySoft, borderRadius: radius.md, height: 54, justifyContent: 'center', width: 54 },
  cardList: { gap: spacing.md },
  restaurantCard: { alignItems: 'center', backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, flexDirection: 'row', gap: spacing.md, padding: spacing.md, ...shadows.soft },
  pressed: { opacity: 0.88 },
  restaurantCopy: { flex: 1, gap: spacing.sm },
  cardTitleRow: { alignItems: 'flex-start', gap: spacing.sm },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  offerGrid: { gap: spacing.md },
  offerCard: { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, gap: spacing.sm, padding: spacing.lg, ...shadows.soft },
});
