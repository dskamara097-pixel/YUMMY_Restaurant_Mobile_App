import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { colors, radius, shadows, spacing } from '@/constants/theme';

type CouponCardProps = {
  code: string;
  title: string;
  description: string;
  discount: string;
  expiryDate: string;
  restaurantName?: string;
  onApply?: () => void;
};

export function CouponCard({ code, title, description, discount, expiryDate, restaurantName, onApply }: CouponCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.copy}>
          <AppBadge label={discount} tone="warning" icon="pricetag-outline" />
          <AppText variant="sectionTitle">{title}</AppText>
          <AppText tone="muted">{description}</AppText>
        </View>
      </View>
      <View style={styles.codeBox}>
        <AppText variant="label" tone="primary">{code}</AppText>
        <AppText variant="caption" tone="muted">Expires {expiryDate}</AppText>
      </View>
      {restaurantName ? <AppBadge label={restaurantName} tone="info" icon="storefront-outline" /> : null}
      <AppButton label="Apply" leftIcon="checkmark-circle-outline" onPress={onApply} />
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
    gap: spacing.md,
  },
  copy: {
    gap: spacing.sm,
  },
  codeBox: {
    backgroundColor: colors.brand.primarySoft,
    borderRadius: radius.md,
    gap: spacing.xs,
    padding: spacing.md,
  },
});
