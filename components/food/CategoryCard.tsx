import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { colors, radius, shadows, spacing } from '@/constants/theme';

type CategoryCardProps = {
  title: string;
  subtitle?: string;
  imageSource?: ImageSourcePropType;
  selected?: boolean;
  onPress?: () => void;
};

export function CategoryCard({ title, subtitle, imageSource, selected = false, onPress }: CategoryCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.card, selected && styles.selected, pressed && styles.pressed]}
    >
      <View style={styles.imageWrap}>
        {imageSource ? <Image source={imageSource} style={styles.image} /> : <AppIcon name="restaurant-outline" size={26} color={colors.brand.primary} />}
      </View>
      <View style={styles.copy}>
        <AppText variant="label" numberOfLines={1}>{title}</AppText>
        {subtitle ? <AppText variant="caption" tone="muted" numberOfLines={1}>{subtitle}</AppText> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.neutral.surface,
    borderColor: colors.neutral.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    ...shadows.soft,
  },
  selected: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.brand.primarySoft,
  },
  pressed: {
    opacity: 0.86,
  },
  imageWrap: {
    alignItems: 'center',
    backgroundColor: colors.neutral.surfaceWarm,
    borderRadius: radius.md,
    height: 54,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 54,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
});