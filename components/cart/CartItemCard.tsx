import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { QuantityStepper } from '@/components/cart/QuantityStepper';
import { PriceTag } from '@/components/food/PriceTag';
import { colors, layout, radius, shadows, spacing } from '@/constants/theme';
import { formatCurrency } from '@/utils/formatCurrency';

type CartItemCardProps = {
  name: string;
  restaurantName: string;
  unitPrice: number;
  quantity: number;
  imageSource?: ImageSourcePropType;
  onIncrease?: () => void;
  onDecrease?: () => void;
  onRemove?: () => void;
};

export function CartItemCard({
  name,
  restaurantName,
  unitPrice,
  quantity,
  imageSource,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemCardProps) {
  const subtotal = unitPrice * quantity;

  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        {imageSource ? <Image source={imageSource} style={styles.image} /> : <AppIcon name="fast-food-outline" color={colors.brand.primary} size={30} />}
      </View>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titleWrap}>
            <AppText variant="label" numberOfLines={1}>{name}</AppText>
            <AppText variant="caption" tone="muted" numberOfLines={1}>{restaurantName}</AppText>
          </View>
          {onRemove ? (
            <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${name}`} onPress={onRemove} style={styles.iconButton}>
              <AppIcon name="trash-outline" size={18} color={colors.semantic.danger} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.priceRow}>
          <View style={styles.priceCopy}>
            <AppText variant="caption" tone="muted">Unit price</AppText>
            <AppText variant="label">{formatCurrency(unitPrice)}</AppText>
          </View>
          <View style={styles.priceCopyRight}>
            <AppText variant="caption" tone="muted">Subtotal</AppText>
            <PriceTag amount={subtotal} size="sm" />
          </View>
        </View>

        {onIncrease && onDecrease ? (
          <QuantityStepper quantity={quantity} onIncrease={onIncrease} onDecrease={onDecrease} />
        ) : (
          <AppText variant="caption" tone="muted">Quantity: {quantity}</AppText>
        )}
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
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    ...shadows.soft,
  },
  imageWrap: {
    alignItems: 'center',
    backgroundColor: colors.neutral.surfaceWarm,
    borderRadius: radius.md,
    height: 92,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 92,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  content: {
    flex: 1,
    gap: spacing.md,
  },
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  titleWrap: {
    flex: 1,
    gap: spacing.xs,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: layout.minTouchTarget,
    minWidth: layout.minTouchTarget,
  },
  priceRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  priceCopy: {
    gap: spacing.xs,
  },
  priceCopyRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
});
