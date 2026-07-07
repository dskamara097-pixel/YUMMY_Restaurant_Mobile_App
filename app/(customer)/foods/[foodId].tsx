import type { Href } from 'expo-router';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { QuantityStepper } from '@/components/cart/QuantityStepper';
import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppDivider } from '@/components/common/AppDivider';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { FoodCard } from '@/components/food/FoodCard';
import { PriceTag } from '@/components/food/PriceTag';
import { RatingBadge } from '@/components/food/RatingBadge';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useCart } from '@/hooks/useCart';
import { useCategories } from '@/hooks/useCategories';
import { useFood, useFoods } from '@/hooks/useFoods';
import { useRestaurants } from '@/hooks/useRestaurants';
import { mapFoodModel } from '@/utils/firestoreAdapters';

function openFood(foodId: string) {
  router.push({ pathname: '/(customer)/foods/[foodId]', params: { foodId } } as unknown as Href);
}

export default function FoodDetailsScreen() {
  const { foodId } = useLocalSearchParams<{ foodId?: string }>();
  const foodState = useFood(foodId);
  const foodsState = useFoods({ filters: [{ field: 'available', value: true }] });
  const restaurantsState = useRestaurants();
  const categoriesState = useCategories();
  const cart = useCart();
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [cartNotice, setCartNotice] = useState('');
  const firstError = foodState.error ?? foodsState.error ?? restaurantsState.error ?? categoriesState.error;

  const food = foodState.data ? mapFoodModel(foodState.data, restaurantsState.data, categoriesState.data) : null;
  const similarFoods = useMemo(() => (foodState.data
    ? foodsState.data
      .filter((item) => item.categoryId === foodState.data?.categoryId && item.id !== foodState.data.id)
      .slice(0, 3)
      .map((item) => mapFoodModel(item, restaurantsState.data, categoriesState.data))
    : []), [categoriesState.data, foodState.data, foodsState.data, restaurantsState.data]);

  async function handleAddToCart() {
    if (!foodState.data) return;

    try {
      await cart.addFood(foodState.data, quantity, food?.restaurantName);
      setCartNotice(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to your cart.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to add item to cart.';
      setCartNotice(message);
    }
  }

  if (foodState.loading || foodsState.loading || restaurantsState.loading || categoriesState.loading) return <ScreenContainer contentStyle={styles.centeredScreen}><LoadingState title="Loading food" message="Fetching meal details from Firestore." /></ScreenContainer>;
  if (firstError) return <ScreenContainer contentStyle={styles.centeredScreen}><FriendlyErrorState title="Unable to load food" message={firstError} onRetry={async () => { await Promise.all([foodState.retry(), foodsState.retry(), restaurantsState.retry(), categoriesState.retry()]); }} /></ScreenContainer>;
  if (!food) return <ScreenContainer contentStyle={styles.centeredScreen}><EmptyState title="Food not found" message="This Firestore food document is not available." icon="fast-food-outline" actionLabel="Back to Home" onActionPress={() => router.replace('/(customer)/home' as Href)} /></ScreenContainer>;

  return (
    <ScreenContainer scroll padded={false} contentStyle={styles.screen}>
      <View style={styles.imageHero}>
        <AppHeader title="Food Details" leftIcon="arrow-back" onLeftPress={() => router.back()} rightIcon="cart-outline" onRightPress={() => router.push('/(customer)/cart' as Href)} />
        <View style={styles.foodImagePlaceholder}><AppIcon name="fast-food-outline" size={68} color={colors.brand.primary} /></View>
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.titleCopy}>
            <AppBadge label={food.restaurantName ?? 'YUMMY Restaurant'} icon="storefront-outline" tone="primary" />
            <AppText variant="title">{food.name}</AppText>
            <AppText tone="muted">{food.description}</AppText>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Toggle favorite preview" onPress={() => setFavorite((current) => !current)} style={[styles.favoriteButton, favorite && styles.favoriteButtonActive]}>
            <AppIcon name={favorite ? 'heart' : 'heart-outline'} color={favorite ? colors.neutral.surface : colors.brand.primary} />
          </Pressable>
        </View>
        <View style={styles.metaRow}><RatingBadge rating={food.rating ?? 4.5} /><AppBadge label={food.deliveryTime ?? '30-40 min'} icon="time-outline" /><PriceTag amount={food.price} size="lg" /></View>
        <AppDivider inset />
        <View style={styles.section}><SectionHeader title="Ingredients" /><View style={styles.chipRow}>{(food.ingredients ?? []).map((ingredient) => <AppBadge key={ingredient} label={ingredient} />)}</View></View>
        <View style={styles.nutritionCard}><AppIcon name="nutrition-outline" color={colors.semantic.success} /><View style={styles.nutritionCopy}><AppText variant="bodyStrong">Nutrition placeholder</AppText><AppText tone="muted">Nutrition details can be stored in a later menu enrichment phase.</AppText></View></View>
        <View style={styles.quantityCard}><View style={styles.quantityCopy}><AppText variant="bodyStrong">Quantity</AppText><AppText variant="caption" tone="muted">Quantity will be saved to your Firestore cart.</AppText></View><QuantityStepper quantity={quantity} onIncrease={() => setQuantity((current) => current + 1)} onDecrease={() => setQuantity((current) => Math.max(1, current - 1))} /></View>
        <AppButton label="Add to Cart" leftIcon="cart-outline" loading={cart.mutating} onPress={() => void handleAddToCart()} />
        {cartNotice ? <AppBadge label={cartNotice} tone={cartNotice.includes('added') ? 'success' : 'info'} icon="cart-outline" /> : null}
        <AppButton label="View Cart" variant="outline" leftIcon="cart-outline" onPress={() => router.push('/(customer)/cart' as Href)} />
        <AppButton label="View Food Reviews" variant="outline" leftIcon="star-outline" onPress={() => router.push({ pathname: '/(customer)/food-reviews', params: { foodId: food.id } } as unknown as Href)} />
        <View style={styles.section}><SectionHeader title="Similar Foods" subtitle="Firestore suggestions" /><View style={styles.foodList}>{similarFoods.map((item) => <FoodCard key={item.id} name={item.name} description={item.description} price={item.price} category={item.category} rating={item.rating} available={item.availability} onPress={() => openFood(item.id)} onOrderPress={() => openFood(item.id)} />)}</View></View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.neutral.canvas },
  centeredScreen: { justifyContent: 'center' },
  imageHero: { backgroundColor: colors.brand.primary, gap: spacing.xl, minHeight: 310, padding: spacing.xl, paddingTop: spacing['2xl'] },
  foodImagePlaceholder: { alignItems: 'center', alignSelf: 'center', backgroundColor: colors.neutral.surface, borderRadius: radius.xl, flex: 1, justifyContent: 'center', maxHeight: 190, width: '78%', ...shadows.card },
  content: { gap: spacing.xl, padding: spacing.xl },
  titleRow: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.md },
  titleCopy: { flex: 1, gap: spacing.sm },
  favoriteButton: { alignItems: 'center', backgroundColor: colors.brand.primarySoft, borderRadius: radius.pill, height: 48, justifyContent: 'center', width: 48 },
  favoriteButtonActive: { backgroundColor: colors.brand.primary },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  section: { gap: spacing.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  nutritionCard: { alignItems: 'flex-start', backgroundColor: colors.semantic.successSoft, borderRadius: radius.lg, flexDirection: 'row', gap: spacing.md, padding: spacing.lg },
  nutritionCopy: { flex: 1, gap: spacing.xs },
  quantityCard: { alignItems: 'center', backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between', padding: spacing.lg, ...shadows.soft },
  quantityCopy: { flex: 1, gap: spacing.xs },
  foodList: { gap: spacing.md },
});
