import { useCallback, useMemo } from 'react';

import { OrderModel, OrderStatusModel } from '@/models/Order';
import { orderRepository } from '@/repositories/OrderRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { vendorOrderStatuses } from '@/hooks/useVendorOrders';

export const adminOrderStatuses = vendorOrderStatuses;

export function useAdminOrders() {
  const loader = useCallback(() => orderRepository.list({ sort: [{ field: 'createdAt', direction: 'desc' }] }), []);
  const state = useFirestoreData<OrderModel[]>('admin-orders', [], loader);
  const retry = state.retry;
  const updateStatus = useCallback(async (orderId: string, status: OrderStatusModel) => { await orderRepository.updateStatus(orderId, status); await retry(); }, [retry]);
  return { ...state, updateStatus };
}

export function useAdminOrderFilters(orders: OrderModel[], query: string, status: OrderStatusModel | 'all') {
  return useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return orders.filter((order) => {
      const source = [order.id, order.customerId, order.restaurantId, order.items.map((item) => item.name).join(' ')].join(' ').toLowerCase();
      return (status === 'all' || order.status === status) && (!normalizedQuery || source.includes(normalizedQuery));
    });
  }, [orders, query, status]);
}
