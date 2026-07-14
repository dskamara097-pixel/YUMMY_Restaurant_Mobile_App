import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/forms/AppInput';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { VendorBottomNavigation } from '@/components/vendor/VendorBottomNavigation';
import { VendorEntityCard, VendorStatCard } from '@/components/vendor/VendorCards';
import { spacing } from '@/constants/theme';
import { useVendorReviews } from '@/hooks/useVendorEngagement';
import { useVendorRestaurant } from '@/hooks/useVendorRestaurant';

export default function VendorReviewsScreen() {
  const restaurantState = useVendorRestaurant();
  const reviewsState = useVendorReviews(restaurantState.data?.id);
  const [replyText, setReplyText] = useState('');
  const [replyReviewId, setReplyReviewId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const averageRating = useMemo(() => {
    if (!reviewsState.data.length) return 0;
    return reviewsState.data.reduce((sum, review) => sum + review.rating, 0) / reviewsState.data.length;
  }, [reviewsState.data]);
  const firstError = restaurantState.error ?? reviewsState.error;

  async function saveReply() {
    if (!replyReviewId) return;
    try {
      await reviewsState.replyToReview(replyReviewId, replyText);
      setReplyReviewId(null);
      setReplyText('');
      setNotice('Review reply saved.');
    } catch (error) {
      const nextError = error as { message?: string };
      setNotice(nextError.message ?? 'Unable to save review reply.');
    }
  }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Reviews" subtitle="Ratings and restaurant replies" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      {restaurantState.loading || reviewsState.loading ? <LoadingState title="Loading reviews" /> : null}
      {firstError ? <FriendlyErrorState title="Reviews unavailable" message={firstError} onRetry={async () => { await Promise.all([restaurantState.retry(), reviewsState.retry()]); }} /> : null}
      <View style={styles.statsGrid}>
        <VendorStatCard label="Average Rating" value={averageRating.toFixed(1)} icon="star-outline" tone="warning" />
        <VendorStatCard label="Reviews" value={`${reviewsState.data.length}`} icon="chatbubble-outline" />
      </View>
      {replyReviewId ? <View style={styles.form}><AppInput label="Reply" value={replyText} onChangeText={setReplyText} leftIcon="chatbubble-outline" multiline /><AppButton label="Save Reply" onPress={saveReply} /></View> : null}
      {notice ? <AppBadge label={notice} tone={notice.includes('saved') ? 'success' : 'warning'} icon="information-circle-outline" /> : null}
      {!reviewsState.loading && reviewsState.data.length === 0 ? <EmptyState title="No reviews yet" message="Customer ratings and reviews will appear here." icon="star-outline" /> : null}
      <View style={styles.section}><SectionHeader title="Customer Reviews" />{reviewsState.data.map((review) => <VendorEntityCard key={review.id} title={`${review.rating} stars`} subtitle={review.comment} meta={`Customer ${review.userId} - ${review.createdAt}${review.vendorReply ? ` - Reply: ${review.vendorReply}` : ''}`} badge={review.hidden ? 'Hidden' : 'Visible'} badgeTone={review.hidden ? 'danger' : 'success'} primaryActionLabel="Reply" onPrimaryAction={() => { setReplyReviewId(review.id); setReplyText(review.vendorReply ?? ''); }} />)}</View>
      <VendorBottomNavigation active="settings" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  form: { gap: spacing.lg },
  section: { gap: spacing.md },
});
