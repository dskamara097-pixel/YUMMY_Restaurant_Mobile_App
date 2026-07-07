import type { Href } from 'expo-router';
import { router, useLocalSearchParams } from 'expo-router';
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
import { VendorBottomNavigation } from '@/components/vendor/VendorBottomNavigation';
import { VendorEntityCard, VendorStatCard } from '@/components/vendor/VendorCards';
import { spacing } from '@/constants/theme';
import { getVendorOrderStatusLabel, useVendorOrder, useVendorOrders } from '@/hooks/useVendorOrders';
import { useVendorRestaurant } from '@/hooks/useVendorRestaurant';
import { formatCurrency } from '@/utils/formatCurrency';

export default function VendorOrderDetailsScreen() {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const orderState = useVendorOrder(orderId);
  const restaurantState = useVendorRestaurant();
  const ordersState = useVendorOrders(restaurantState.data?.id);
  const order = orderState.data;

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Order Details" subtitle={orderId ?? 'Firestore order'} leftIcon="arrow-back" onLeftPress={() => router.back()} rightIcon="create-outline" onRightPress={() => orderId ? router.push({ pathname: '/(vendor)/orders/[orderId]/status', params: { orderId } } as unknown as Href) : undefined} />
      {orderState.loading ? <LoadingState title="Loading order" message="Fetching Firestore order details." /> : null}
      {orderState.error ? <FriendlyErrorState title="Order unavailable" message={orderState.error} onRetry={orderState.retry} /> : null}
      {!order && !orderState.loading ? <EmptyState title="Order not found" message="The selected order document is unavailable." icon="receipt-outline" /> : null}
      {order ? <>
        <View style={styles.statsGrid}><VendorStatCard label="Total" value={formatCurrency(order.total)} icon="cash-outline" tone="success" /><VendorStatCard label="Status" value={getVendorOrderStatusLabel(order.status)} icon="time-outline" tone="warning" /><VendorStatCard label="Payment" value={order.paymentStatus} icon="card-outline" tone="info" /></View>
        <View style={styles.section}><SectionHeader title="Items Ordered" />{order.items.map((item) => <VendorEntityCard key={item.foodId} title={item.name} subtitle={`${item.quantity} x ${formatCurrency(item.unitPrice)}`} meta={`Subtotal ${formatCurrency(item.lineTotal)}`} />)}</View>
        <View style={styles.section}><SectionHeader title="Price Breakdown" /><AppText>Subtotal: {formatCurrency(order.subtotal)}</AppText><AppText>Delivery Fee: {formatCurrency(order.deliveryFee)}</AppText><AppText>Service Fee: {formatCurrency(order.serviceFee)}</AppText><AppText>Discount: {formatCurrency(order.discount)}</AppText><AppText variant="bodyStrong">Total: {formatCurrency(order.total)}</AppText></View>
        {order.notes ? <AppBadge label={`Note: ${order.notes}`} tone="info" icon="chatbubble-outline" /> : null}
        <View style={styles.actions}><AppButton label="Accept Order" fullWidth={false} leftIcon="checkmark-circle-outline" onPress={() => ordersState.acceptOrder(order.id)} /><AppButton label="Update Status" fullWidth={false} variant="outline" leftIcon="swap-horizontal-outline" onPress={() => router.push({ pathname: '/(vendor)/orders/[orderId]/status', params: { orderId: order.id } } as unknown as Href)} /><AppButton label="Reject" fullWidth={false} variant="danger" leftIcon="close-circle-outline" onPress={() => ordersState.rejectOrder(order.id)} /></View>
      </> : null}
      <VendorBottomNavigation active="orders" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] }, statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }, section: { gap: spacing.md }, actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm } });
