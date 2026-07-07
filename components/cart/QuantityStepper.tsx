import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { colors, layout, radius, spacing } from '@/constants/theme';

type QuantityStepperProps = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
};

export function QuantityStepper({ quantity, onIncrease, onDecrease, min = 1 }: QuantityStepperProps) {
  const cannotDecrease = quantity <= min;

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        accessibilityState={{ disabled: cannotDecrease }}
        disabled={cannotDecrease}
        onPress={onDecrease}
        style={[styles.button, cannotDecrease && styles.disabled]}
      >
        <AppIcon name="remove" size={18} color={colors.neutral.ink} />
      </Pressable>
      <View style={styles.valueWrap}>
        <AppText variant="label" align="center">{quantity}</AppText>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Increase quantity" onPress={onIncrease} style={styles.button}>
        <AppIcon name="add" size={18} color={colors.neutral.ink} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.brand.primarySoft,
    borderRadius: radius.pill,
    height: layout.minTouchTarget,
    justifyContent: 'center',
    width: layout.minTouchTarget,
  },
  disabled: {
    opacity: 0.48,
  },
  valueWrap: {
    alignItems: 'center',
    minWidth: 28,
  },
});
