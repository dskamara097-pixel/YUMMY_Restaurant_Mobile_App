import { StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { colors, radius, spacing } from '@/constants/theme';

type RatingBadgeProps = {
  rating: number;
  count?: number;
};

export function RatingBadge({ rating, count }: RatingBadgeProps) {
  return (
    <View style={styles.badge}>
      <AppIcon name="star" size={14} color={colors.semantic.warning} />
      <AppText variant="caption">{rating.toFixed(1)}</AppText>
      {typeof count === 'number' ? (
        <AppText variant="caption" tone="muted">({count})</AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.neutral.surface,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
});