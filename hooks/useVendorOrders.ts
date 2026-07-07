import { useCallback, useMemo } from 'react';

import { OrderModel, OrderStatusModel } from '@/models/Order';
import { orderRepository } from '@/repositories/OrderRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';

export const vendorOrderStatuses: Array<{ label: string; value: OrderStatusModel }> = [
  { label: 'Pending', value: 'pending' },
  { label: 'Payment Received', value: 'paymentReceived' },
  { label: 'Preparing', value: 'preparing' },
  { label: 'Ready', value: 'ready' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

export function getVendorOrderStatusLabel(status: OrderStatusModel) {
  return vendorOrderStatuses.find((item) => item.value === status)?.label ?? 'Pending';
}

export function useVendorOrders(restaurantId?: string) {
  const loader = useCallback(async () => (restaurantId ? orderRepository.listByRestaurant(restaurantId) : []), [restaurantId]);
  const state = useFirestoreData<OrderModel[]>(`vendor-orders:${restaurantId ?? 'none'}`, [], loader);
  const retry = state.retry;

  const updateStatus = useCallback(async (orderId: string, status: OrderStatusModel) => {
    await orderRepository.updateStatus(orderId, status);
    await retry();
  }, [retry]);

  const acceptOrder = useCallback((orderId: string) => updateStatus(orderId, 'preparing'), [updateStatus]);
  const rejectOrder = useCallback((orderId: string) => updateStatus(orderId, 'cancelled'), [updateStatus]);

  return { ...state, updateStatus, acceptOrder, rejectOrder };
}

export function useVendorOrder(orderId?: string) {
  const loader = useCallback(async () => (orderId ? orderRepository.getById(orderId) : null), [orderId]);
  return useFirestoreData<OrderModel | null>(`vendor-order:${orderId ?? 'none'}`, null, loader);
}

export function useVendorOrderFilters(orders: OrderModel[], query: string, status: OrderStatusModel | 'all') {
  return useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = status === 'all' || order.status === status;
      const source = [order.id, order.customerId, order.items.map((item) => item.name).join(' ')].join(' ').toLowerCase();
      const matchesQuery = !normalizedQuery || source.includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [orders, query, status]);
}
