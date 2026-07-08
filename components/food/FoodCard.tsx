import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { PriceTag } from '@/components/food/PriceTag';
import { RatingBadge } from '@/components/food/RatingBadge';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { getFoodImageSource } from '@/utils/localImages';

type FoodCardProps = {
  name: string;
  description: string;
  price: number;
  imageSource?: ImageSourcePropType;
  imageUrl?: string;
  category?: string;
  rating?: number;
  available?: boolean;
  onPress?: () => void;
  onOrderPress?: () => void;
};

export function FoodCard({
  name,
  description,
  price,
  imageSource,
  imageUrl,
  category,
  rating,
  available = true,
  onPress,
  onOrderPress,
}: FoodCardProps) {
  const resolvedImageSource = imageSource ?? getFoodImageSource(imageUrl ?? name);

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.imageWrap}>
        <Image source={resolvedImageSource} style={styles.image} />
        <View style={styles.topBadges}>
          {category ? <AppBadge label={category} tone="primary" /> : null}
          {!available ? <AppBadge label="Unavailable" tone="danger" /> : null}
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.copy}>
          <AppText variant="sectionTitle" numberOfLines={1}>{name}</AppText>
          <AppText tone="muted" numberOfLines={2}>{description}</AppText>
        </View>
        <View style={styles.metaRow}>
          <PriceTag amount={price} />
          {typeof rating === 'number' ? <RatingBadge rating={rating} /> : null}
        </View>
        <AppButton
          label="Order"
          leftIcon="cart-outline"
          onPress={onOrderPress}
          disabled={!available}
          size="sm"
        />
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
    overflow: 'hidden',
    ...shadows.card,
  },
  pressed: {
    opacity: 0.9,
  },
  imageWrap: {
    alignItems: 'center',
    aspectRatio: 1.55,
    backgroundColor: colors.neutral.surfaceWarm,
    justifyContent: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  topBadges: {
    flexDirection: 'row',
    gap: spacing.sm,
    left: spacing.md,
    position: 'absolute',
    top: spacing.md,
  },
  content: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  copy: {
    gap: spacing.xs,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
