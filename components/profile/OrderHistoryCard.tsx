import { Pressable, StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { PriceTag } from '@/components/food/PriceTag';
import { colors, radius, shadows, spacing } from '@/constants/theme';

type OrderHistoryCardProps = {
  orderId: string;
  restaurantName: string;
  foodItems: string[];
  orderDate: string;
  totalAmount: number;
  status: string;
  onPress?: () => void;
  onReorderPress?: () => void;
};

function statusTone(status: string) {
  if (status === 'Delivered') return 'success' as const;
  if (status === 'Preparing' || status === 'Ready') return 'warning' as const;
  return 'info' as const;
}

export function OrderHistoryCard({ orderId, restaurantName, foodItems, orderDate, totalAmount, status, onPress, onReorderPress }: OrderHistoryCardProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.headerRow}>
        <View style={styles.copy}>
          <AppText variant="bodyStrong">{restaurantName}</AppText>
          <AppText variant="caption" tone="muted">Order {orderId} - {orderDate}</AppText>
        </View>
        <AppBadge label={status} tone={statusTone(status)} />
      </View>
      <AppText tone="muted" numberOfLines={2}>{foodItems.join(', ')}</AppText>
      <View style={styles.footerRow}>
        <PriceTag amount={totalAmount} />
        <AppButton label="Reorder" size="sm" variant="outline" fullWidth={false} leftIcon="repeat-outline" onPress={onReorderPress} />
      </View>
    </Pressable>
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
  pressed: {
    opacity: 0.9,
  },
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
});
