import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { OrderHistoryCard } from '@/components/profile/OrderHistoryCard';
import { spacing } from '@/constants/theme';
import { useOrders } from '@/hooks/useOrders';
import { useRestaurants } from '@/hooks/useRestaurants';
import { mapOrderModel } from '@/utils/firestoreAdapters';

function openTracking(orderId: string) { router.push({ pathname: '/(customer)/tracking/[orderId]', params: { orderId } } as unknown as Href); }

export default function OrderHistoryScreen() {
  const ordersState = useOrders();
  const restaurantsState = useRestaurants();
  const [notice, setNotice] = useState('');
  const orders = ordersState.data.map((order) => mapOrderModel(order, restaurantsState.data));
  const firstError = ordersState.error ?? restaurantsState.error;

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Order History" subtitle="Previous orders" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      {ordersState.loading || restaurantsState.loading ? <LoadingState title="Loading orders" message="Fetching your Firestore order history." /> : null}
      {firstError ? <FriendlyErrorState title="Unable to load orders" message={firstError} onRetry={async () => { await Promise.all([ordersState.retry(), restaurantsState.retry()]); }} /> : null}
      {!ordersState.loading && !firstError && orders.length === 0 ? <EmptyState title="No orders yet" message="Firestore orders for your account will appear here." icon="receipt-outline" /> : null}
      <View style={styles.section}><SectionHeader title="Recent Orders" subtitle="Tap an order to track it" /><View style={styles.list}>{orders.map((order) => <OrderHistoryCard key={order.id} orderId={order.id} restaurantName={order.restaurantName} foodItems={order.foodItems} orderDate={order.orderDate} totalAmount={order.totalAmount} status={order.status} onPress={() => openTracking(order.id)} onReorderPress={() => setNotice('Reorder will be implemented with persistent cart in a later phase.')} />)}</View></View>
      {notice ? <AppBadge label={notice} tone="info" icon="information-circle-outline" /> : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] }, section: { gap: spacing.md }, list: { gap: spacing.md } });
