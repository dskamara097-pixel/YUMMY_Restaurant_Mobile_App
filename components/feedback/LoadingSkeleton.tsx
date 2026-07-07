import { StyleSheet, View } from 'react-native';

import { colors, radius, shadows, spacing } from '@/constants/theme';

type LoadingSkeletonProps = {
  variant: 'restaurant' | 'food' | 'profile' | 'orders' | 'search';
  count?: number;
};

export function LoadingSkeleton({ variant, count = 3 }: LoadingSkeletonProps) {
  return (
    <View style={styles.stack}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={`${variant}-${index}`} style={styles.card}>
          {variant === 'profile' ? <View style={styles.avatar} /> : <View style={styles.image} />}
          <View style={styles.copy}>
            <View style={styles.lineLarge} />
            <View style={styles.lineMedium} />
            <View style={styles.lineSmall} />
            {variant === 'search' ? <View style={styles.chipRow}><View style={styles.chip} /><View style={styles.chip} /></View> : null}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.md,
  },
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
  image: {
    backgroundColor: colors.neutral.surfaceWarm,
    borderRadius: radius.md,
    height: 76,
    width: 76,
  },
  avatar: {
    backgroundColor: colors.brand.primarySoft,
    borderRadius: radius.pill,
    height: 76,
    width: 76,
  },
  copy: {
    flex: 1,
    gap: spacing.sm,
    justifyContent: 'center',
  },
  lineLarge: {
    backgroundColor: colors.neutral.line,
    borderRadius: radius.pill,
    height: 14,
    width: '76%',
  },
  lineMedium: {
    backgroundColor: colors.neutral.line,
    borderRadius: radius.pill,
    height: 12,
    width: '58%',
  },
  lineSmall: {
    backgroundColor: colors.neutral.line,
    borderRadius: radius.pill,
    height: 10,
    width: '38%',
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.brand.primarySoft,
    borderRadius: radius.pill,
    height: 24,
    width: 82,
  },
});
