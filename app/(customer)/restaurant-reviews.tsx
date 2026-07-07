import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ReviewCard } from '@/components/feedback/ReviewCard';
import { RatingBadge } from '@/components/food/RatingBadge';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { AppText } from '@/components/common/AppText';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useRestaurant } from '@/hooks/useRestaurants';
import { useReviews } from '@/hooks/useReviews';

export default function RestaurantReviewsScreen() {
  const { restaurantId } = useLocalSearchParams<{ restaurantId?: string }>();
  const restaurantState = useRestaurant(restaurantId);
  const reviewsState = useReviews(restaurantId, 'restaurant');
  const reviews = reviewsState.data;
  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const firstError = restaurantState.error ?? reviewsState.error;

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Restaurant Reviews" subtitle={restaurantState.data?.name ?? 'Firestore reviews'} leftIcon="arrow-back" onLeftPress={() => router.back()} />
      {restaurantState.loading || reviewsState.loading ? <LoadingState title="Loading reviews" message="Fetching restaurant reviews from Firestore." /> : null}
      {firstError ? <FriendlyErrorState title="Unable to load reviews" message={firstError} onRetry={async () => { await Promise.all([restaurantState.retry(), reviewsState.retry()]); }} /> : null}
      {!reviewsState.loading && !firstError && reviews.length === 0 ? <EmptyState title="No restaurant reviews yet" message="Firestore reviews for this restaurant will appear here." icon="star-outline" /> : null}
      <View style={styles.ratingCard}><AppText variant="display" tone="primary">{average.toFixed(1)}</AppText><RatingBadge rating={average} count={reviews.length} /><AppText tone="muted">Based on Firestore customer reviews.</AppText><View style={styles.statsRow}><AppBadge label="Helpful badges ready" tone="success" icon="thumbs-up-outline" /><AppBadge label="Firestore reviews" tone="info" icon="cloud-outline" /></View></View>
      <SectionHeader title="Customer Reviews" subtitle="Helpful badges included" />
      <View style={styles.list}>{reviews.map((review) => <ReviewCard key={review.id} customerName="YUMMY Customer" rating={review.rating} title="Customer review" comment={review.comment} date={review.createdAt} helpfulCount={review.helpfulCount} imageCount={review.imageUrls?.length} />)}</View>
      <AppButton label="Write Review" leftIcon="create-outline" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] }, ratingCard: { alignItems: 'center', backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.xl, borderWidth: 1, gap: spacing.md, padding: spacing.xl, ...shadows.card }, statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' }, list: { gap: spacing.md } });
