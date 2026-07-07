import { StyleSheet, View } from 'react-native';

import { AppDivider } from '@/components/common/AppDivider';
import { AppText } from '@/components/common/AppText';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { formatCurrency } from '@/utils/formatCurrency';

type CartSummaryCardProps = {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  total: number;
  title?: string;
};

export function CartSummaryCard({
  subtotal,
  deliveryFee,
  serviceFee,
  discount,
  total,
  title = 'Cart Summary',
}: CartSummaryCardProps) {
  return (
    <View style={styles.card}>
      <AppText variant="sectionTitle">{title}</AppText>
      <View style={styles.rows}>
        <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
        <SummaryRow label="Delivery fee" value={formatCurrency(deliveryFee)} />
        <SummaryRow label="Service fee" value={formatCurrency(serviceFee)} />
        <SummaryRow label="Discount" value={`- ${formatCurrency(discount)}`} tone="success" />
      </View>
      <AppDivider inset />
      <SummaryRow label="Total" value={formatCurrency(total)} strong />
    </View>
  );
}

function SummaryRow({ label, value, strong = false, tone = 'default' }: { label: string; value: string; strong?: boolean; tone?: 'default' | 'success' }) {
  return (
    <View style={styles.row}>
      <AppText variant={strong ? 'bodyStrong' : 'body'} tone={strong ? 'default' : 'muted'}>{label}</AppText>
      <AppText variant={strong ? 'sectionTitle' : 'bodyStrong'} tone={tone === 'success' ? 'success' : 'default'}>{value}</AppText>
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
  rows: {
    gap: spacing.sm,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
});
