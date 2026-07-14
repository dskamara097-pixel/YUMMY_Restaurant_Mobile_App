import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { usePayments } from '@/hooks/usePayments';
import { formatCurrency } from '@/utils/formatCurrency';

function paymentStatusTone(status: string) {
  if (status === 'paid') return 'success' as const;
  if (status === 'failed') return 'danger' as const;
  if (status === 'refunded') return 'warning' as const;
  return 'info' as const;
}

function paymentStatusLabel(status: string) {
  if (status === 'awaitingApproval') return 'Awaiting Approval';
  if (status === 'paid') return 'Paid';
  if (status === 'failed') return 'Failed';
  if (status === 'refunded') return 'Refunded';
  return 'Pending';
}

function paymentMethodLabel(method: string) {
  if (method === 'cashOnDelivery') return 'Cash on Delivery';
  if (method === 'dummyMobileMoney') return 'Dummy Mobile Money';
  if (method === 'dummyCard') return 'Dummy Card Payment';
  return method;
}

export default function CustomerPaymentScreen() {
  const paymentsState = usePayments();
  const [notice, setNotice] = useState('');

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Payments" subtitle="Dummy payment records" leftIcon="arrow-back" onLeftPress={() => router.back()} rightIcon="cart-outline" onRightPress={() => router.push('/(customer)/checkout' as Href)} />
      <View style={styles.heroCard}>
        <AppBadge label="Assignment payment screen" tone="primary" icon="card-outline" />
        <AppText variant="sectionTitle">Payment History</AppText>
        <AppText tone="muted">This screen shows Firestore dummy payment documents only. No real gateway, card processor, mobile money API, or bank integration is used.</AppText>
      </View>
      {paymentsState.loading ? <LoadingState title="Loading payments" message="Fetching dummy payment records." /> : null}
      {paymentsState.error ? <FriendlyErrorState title="Payments unavailable" message={paymentsState.error} onRetry={paymentsState.retry} /> : null}
      {!paymentsState.loading && !paymentsState.error && paymentsState.data.length === 0 ? <EmptyState title="No payments yet" message="Dummy payment records are created after checkout." icon="card-outline" actionLabel="Go to Checkout" onActionPress={() => router.push('/(customer)/checkout' as Href)} /> : null}
      {paymentsState.data.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader title="Recent Payments" subtitle="Firestore payment documents" />
          {paymentsState.data.map((payment) => (
            <View key={payment.id} style={styles.card}>
              <View style={styles.rowBetween}>
                <AppBadge label={paymentStatusLabel(payment.status)} tone={paymentStatusTone(payment.status)} icon="card-outline" />
                <AppText variant="bodyStrong">{formatCurrency(payment.amount)}</AppText>
              </View>
              <AppText variant="label">Order {payment.orderId}</AppText>
              <AppText tone="muted">Method: {paymentMethodLabel(payment.method)}</AppText>
              <AppText variant="caption" tone="muted">Reference: {payment.transactionReference}</AppText>
            </View>
          ))}
        </View>
      ) : null}
      <AppButton label="Back to Checkout" variant="outline" leftIcon="arrow-back" onPress={() => router.push('/(customer)/checkout' as Href)} />
      {notice ? <AppBadge label={notice} tone="info" icon="information-circle-outline" /> : null}
      <AppButton label="Payment Help" variant="ghost" leftIcon="help-circle-outline" onPress={() => setNotice('Payments are simulated for the university assignment only.')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  heroCard: { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, gap: spacing.md, padding: spacing.lg, ...shadows.soft },
  section: { gap: spacing.md },
  card: { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, gap: spacing.sm, padding: spacing.lg, ...shadows.soft },
  rowBetween: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between' },
});
