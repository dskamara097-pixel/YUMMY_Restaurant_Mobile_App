import { router, useLocalSearchParams } from 'expo-router';
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
import { useRealtimeOrder } from '@/hooks/useRealtimeOrder';
import { useRiderDeliveries } from '@/hooks/useRiderDeliveries';
import { OrderStatusModel } from '@/models/Order';
import { mapOrderStatus } from '@/utils/firestoreAdapters';

const statusOptions: Array<{ status: OrderStatusModel; description: string }> = [
  { status: 'paymentReceived', description: 'Payment is recorded and delivery can be coordinated.' },
  { status: 'preparing', description: 'Restaurant is preparing the order.' },
  { status: 'ready', description: 'Order is ready for pickup or handoff.' },
  { status: 'delivered', description: 'Order reached the customer.' },
  { status: 'cancelled', description: 'Delivery cannot continue.' },
];

export default function RiderDeliveryStatusScreen() {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const orderState = useRealtimeOrder(orderId);
  const deliveriesState = useRiderDeliveries();
  const [notice, setNotice] = useState('');
  const [savingStatus, setSavingStatus] = useState<OrderStatusModel | null>(null);

  async function handleUpdate(status: OrderStatusModel) {
    if (!orderId) return;

    setSavingStatus(status);
    setNotice('');

    try {
      await deliveriesState.updateDeliveryStatus(orderId, status);
      setNotice(`Delivery status updated to ${mapOrderStatus(status)}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update delivery status.';
      setNotice(message);
    } finally {
      setSavingStatus(null);
    }
  }

  if (orderState.loading) {
    return <ScreenContainer contentStyle={styles.centeredScreen}><LoadingState title="Loading delivery" message="Listening for order status updates." /></ScreenContainer>;
  }

  if (orderState.error) {
    return <ScreenContainer contentStyle={styles.centeredScreen}><FriendlyErrorState title="Delivery unavailable" message={orderState.error} /></ScreenContainer>;
  }

  if (!orderState.data) {
    return <ScreenContainer contentStyle={styles.centeredScreen}><EmptyState title="Delivery not found" message="Assigned delivery order is unavailable." icon="receipt-outline" /></ScreenContainer>;
  }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Update Delivery Status" subtitle="No GPS or live map" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      <View style={styles.summaryCard}>
        <AppBadge label={`Order ${orderState.data.id}`} tone="primary" icon="receipt-outline" />
        <AppText variant="title">{mapOrderStatus(orderState.data.status)}</AppText>
        <AppText tone="muted">Use the approved timeline/status workflow. This page does not show maps, route lines, or location tracking.</AppText>
      </View>
      <View style={styles.section}>
        <SectionHeader title="Status Actions" subtitle="Firestore-backed placeholder controls" />
        {statusOptions.map((option) => (
          <View key={option.status} style={styles.statusCard}>
            <View style={styles.statusCopy}>
              <AppText variant="bodyStrong">{mapOrderStatus(option.status)}</AppText>
              <AppText tone="muted">{option.description}</AppText>
            </View>
            <AppButton label="Set" fullWidth={false} variant={orderState.data?.status === option.status ? 'primary' : 'outline'} loading={savingStatus === option.status} onPress={() => void handleUpdate(option.status)} />
          </View>
        ))}
      </View>
      {notice ? <AppBadge label={notice} tone={notice.includes('updated') ? 'success' : 'info'} icon="information-circle-outline" /> : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  centeredScreen: { justifyContent: 'center' },
  summaryCard: { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, gap: spacing.md, padding: spacing.lg, ...shadows.soft },
  section: { gap: spacing.md },
  statusCard: { alignItems: 'center', backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, flexDirection: 'row', gap: spacing.md, padding: spacing.lg, ...shadows.soft },
  statusCopy: { flex: 1, gap: spacing.xs },
});
