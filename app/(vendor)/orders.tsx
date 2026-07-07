import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { SearchBar } from '@/components/forms/SearchBar';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { VendorBottomNavigation } from '@/components/vendor/VendorBottomNavigation';
import { VendorEntityCard, VendorStatCard } from '@/components/vendor/VendorCards';
import { spacing } from '@/constants/theme';
import { OrderStatusModel } from '@/models/Order';
import { getVendorOrderStatusLabel, useVendorOrderFilters, useVendorOrders, vendorOrderStatuses } from '@/hooks/useVendorOrders';
import { useVendorRestaurant } from '@/hooks/useVendorRestaurant';
import { formatCurrency } from '@/utils/formatCurrency';

export default function VendorOrderManagementScreen() {
  const restaurantState = useVendorRestaurant();
  const ordersState = useVendorOrders(restaurantState.data?.id);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<OrderStatusModel | 'all'>('all');
  const orders = useVendorOrderFilters(ordersState.data, query, status);
  const pendingCount = ordersState.data.filter((order) => order.status === 'pending' || order.status === 'paymentReceived').length;
  const completedCount = ordersState.data.filter((order) => order.status === 'delivered').length;
  const firstError = restaurantState.error ?? ordersState.error;

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Order Management" subtitle="Search, filter, accept, reject" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      {restaurantState.loading || ordersState.loading ? <LoadingState title="Loading orders" message="Fetching restaurant orders from Firestore." /> : null}
      {firstError ? <FriendlyErrorState title="Orders unavailable" message={firstError} onRetry={async () => { await Promise.all([restaurantState.retry(), ordersState.retry()]); }} /> : null}
      <View style={styles.statsGrid}><VendorStatCard label="Total" value={`${ordersState.data.length}`} icon="receipt-outline" /><VendorStatCard label="Pending" value={`${pendingCount}`} icon="time-outline" tone="warning" /><VendorStatCard label="Completed" value={`${completedCount}`} icon="checkmark-circle-outline" tone="success" /></View>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search orders, customer id, or food" />
      <View style={styles.chips}><AppButton label="All" size="sm" fullWidth={false} variant={status === 'all' ? 'primary' : 'outline'} onPress={() => setStatus('all')} />{vendorOrderStatuses.map((item) => <AppButton key={item.value} label={item.label} size="sm" fullWidth={false} variant={status === item.value ? 'primary' : 'outline'} onPress={() => setStatus(item.value)} />)}</View>
      {!ordersState.loading && orders.length === 0 ? <EmptyState title="No orders found" message="Orders matching your filter will appear here." icon="receipt-outline" /> : null}
      <View style={styles.section}><SectionHeader title="Restaurant Orders" subtitle={`${orders.length} visible`} />{orders.map((order) => <VendorEntityCard key={order.id} title={`Order ${order.id}`} subtitle={order.items.map((item) => `${item.quantity}x ${item.name}`).join(', ')} meta={`${formatCurrency(order.total)} - ${order.createdAt}`} badge={getVendorOrderStatusLabel(order.status)} badgeTone={order.status === 'cancelled' ? 'danger' : order.status === 'delivered' ? 'success' : 'warning'} onPress={() => router.push({ pathname: '/(vendor)/orders/[orderId]', params: { orderId: order.id } } as unknown as Href)} primaryActionLabel="Accept" onPrimaryAction={() => ordersState.acceptOrder(order.id)} secondaryActionLabel="Status" onSecondaryAction={() => router.push({ pathname: '/(vendor)/orders/[orderId]/status', params: { orderId: order.id } } as unknown as Href)} dangerActionLabel="Reject" onDangerAction={() => ordersState.rejectOrder(order.id)} />)}</View>
      <AppBadge label="Order tracking remains status/timeline based. No GPS or live map is used." tone="info" icon="checkmark-circle-outline" />
      <VendorBottomNavigation active="orders" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] }, statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, section: { gap: spacing.md } });
