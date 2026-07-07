import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { RatingBadge } from '@/components/food/RatingBadge';
import { colors, radius, shadows, spacing } from '@/constants/theme';

type ReviewCardProps = {
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpfulCount: number;
  imageCount?: number;
};

export function ReviewCard({ customerName, rating, title, comment, date, helpfulCount, imageCount }: ReviewCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <AppText variant="label" tone="inverse">{customerName.slice(0, 1)}</AppText>
        </View>
        <View style={styles.copy}>
          <AppText variant="bodyStrong">{customerName}</AppText>
          <AppText variant="caption" tone="muted">{date}</AppText>
        </View>
        <RatingBadge rating={rating} />
      </View>
      <View style={styles.copy}>
        <AppText variant="bodyStrong">{title}</AppText>
        <AppText tone="muted">{comment}</AppText>
      </View>
      <View style={styles.badgeRow}>
        <AppBadge label={`${helpfulCount} helpful`} tone="success" icon="thumbs-up-outline" />
        {imageCount ? <AppBadge label={`${imageCount} photo placeholders`} tone="info" icon="image-outline" /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral.surface,
    borderColor: colors.neutral.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
    ...shadows.soft,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.brand.primary,
    borderRadius: radius.pill,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
