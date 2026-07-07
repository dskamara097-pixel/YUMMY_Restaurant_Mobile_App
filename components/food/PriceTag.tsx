import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { colors, radius, spacing } from '@/constants/theme';
import { formatCurrency } from '@/utils/formatCurrency';

type PriceTagProps = {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
};

export function PriceTag({ amount, size = 'md' }: PriceTagProps) {
  return (
    <View style={[styles.tag, styles[size]]}>
      <AppText variant={size === 'lg' ? 'bodyStrong' : 'label'} tone="primary">
        {formatCurrency(amount)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brand.primarySoft,
    borderRadius: radius.pill,
  },
  sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  md: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  lg: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
});