import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { TrackingTimeline } from '@/components/profile/TrackingTimeline';
import { VendorBottomNavigation } from '@/components/vendor/VendorBottomNavigation';
import { VendorEntityCard } from '@/components/vendor/VendorCards';
import { spacing } from '@/constants/theme';
import { getVendorOrderStatusLabel, useVendorOrder, useVendorOrders, vendorOrderStatuses } from '@/hooks/useVendorOrders';
import { useVendorRestaurant } from '@/hooks/useVendorRestaurant';

const timelineLabels = ['Pending', 'Payment Received', 'Preparing', 'Ready', 'Delivered'];

function timelineSteps(currentLabel: string) {
  const currentIndex = timelineLabels.indexOf(currentLabel);
  return timelineLabels.map((label, index) => ({
    label,
    description: label === 'Pending' ? 'Order is waiting for vendor action.' : `${label} status has been recorded.`,
    completed: currentIndex >= index,
    active: currentIndex === index,
  }));
}

export default function VendorUpdateOrderStatusScreen() {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const orderState = useVendorOrder(orderId);
  const restaurantState = useVendorRestaurant();
  const ordersState = useVendorOrders(restaurantState.data?.id);
  const order = orderState.data;

  async function updateStatus(status: typeof vendorOrderStatuses[number]['value']) {
    if (!order) return;
    await ordersState.updateStatus(order.id, status);
    await orderState.retry();
  }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Update Order Status" subtitle="Timeline/status only" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      {orderState.loading ? <LoadingState title="Loading order" message="Fetching status from Firestore." /> : null}
      {orderState.error ? <FriendlyErrorState title="Status unavailable" message={orderState.error} onRetry={orderState.retry} /> : null}
      {!order && !orderState.loading ? <EmptyState title="Order not found" message="The selected order document is unavailable." icon="receipt-outline" /> : null}
      {order ? <>
        <AppBadge label={`Current: ${getVendorOrderStatusLabel(order.status)}`} tone="primary" icon="time-outline" />
        <View style={styles.section}><SectionHeader title="Delivery Timeline" subtitle="No GPS, Google Maps, or live tracking map" /><TrackingTimeline steps={timelineSteps(getVendorOrderStatusLabel(order.status))} /></View>
        <View style={styles.section}><SectionHeader title="Set New Status" />{vendorOrderStatuses.map((status) => <VendorEntityCard key={status.value} title={status.label} subtitle="Update this Firestore order status" badge={order.status === status.value ? 'Current' : undefined} badgeTone="primary" primaryActionLabel="Set Status" onPrimaryAction={() => updateStatus(status.value)} />)}</View>
      </> : null}
      <AppBadge label="Order tracking remains professional timeline/status based." tone="info" icon="checkmark-circle-outline" />
      <VendorBottomNavigation active="orders" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] }, section: { gap: spacing.md } });
