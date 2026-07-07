import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ReviewCard } from '@/components/feedback/ReviewCard';
import { RatingBadge } from '@/components/food/RatingBadge';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useFood } from '@/hooks/useFoods';
import { useReviews } from '@/hooks/useReviews';

export default function FoodReviewsScreen() {
  const { foodId } = useLocalSearchParams<{ foodId?: string }>();
  const foodState = useFood(foodId);
  const reviewsState = useReviews(foodId, 'food');
  const reviews = reviewsState.data;
  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const firstError = foodState.error ?? reviewsState.error;

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Food Reviews" subtitle={foodState.data?.name ?? 'Firestore reviews'} leftIcon="arrow-back" onLeftPress={() => router.back()} />
      {foodState.loading || reviewsState.loading ? <LoadingState title="Loading reviews" message="Fetching food reviews from Firestore." /> : null}
      {firstError ? <FriendlyErrorState title="Unable to load reviews" message={firstError} onRetry={async () => { await Promise.all([foodState.retry(), reviewsState.retry()]); }} /> : null}
      {!reviewsState.loading && !firstError && reviews.length === 0 ? <EmptyState title="No food reviews yet" message="Firestore reviews for this meal will appear here." icon="star-outline" /> : null}
      <View style={styles.ratingCard}><View style={styles.foodIcon}><AppIcon name="fast-food-outline" size={42} color={colors.brand.primary} /></View><AppText variant="title">{foodState.data?.name ?? 'Food'}</AppText><RatingBadge rating={average} count={reviews.length} /><View style={styles.photoRow}><AppBadge label="Image placeholders" tone="info" icon="image-outline" /><AppBadge label="Firestore reviews" tone="success" icon="checkmark-circle-outline" /></View></View>
      <SectionHeader title="Customer Reviews" subtitle="Photos shown as placeholders" />
      <View style={styles.list}>{reviews.map((review) => <ReviewCard key={review.id} customerName="YUMMY Customer" rating={review.rating} title="Customer review" comment={review.comment} date={review.createdAt} helpfulCount={review.helpfulCount} imageCount={review.imageUrls?.length} />)}</View>
      <AppButton label="Write Review" leftIcon="create-outline" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] }, ratingCard: { alignItems: 'center', backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.xl, borderWidth: 1, gap: spacing.md, padding: spacing.xl, ...shadows.card }, foodIcon: { alignItems: 'center', backgroundColor: colors.brand.primarySoft, borderRadius: radius.xl, height: 96, justifyContent: 'center', width: 96 }, photoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' }, list: { gap: spacing.md } });
