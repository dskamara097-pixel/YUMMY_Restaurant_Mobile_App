import { useCallback, useMemo } from 'react';

import { OrderModel, OrderStatusModel } from '@/models/Order';
import { PaymentModel } from '@/models/Payment';
import { orderRepository } from '@/repositories/OrderRepository';
import { paymentRepository } from '@/repositories/PaymentRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';

export const vendorOrderStatuses: Array<{ label: string; value: OrderStatusModel }> = [
  { label: 'Pending', value: 'pending' },
  { label: 'Pending Payment Verification', value: 'pendingPaymentVerification' },
  { label: 'Payment Confirmed', value: 'paymentConfirmed' },
  { label: 'Payment Rejected', value: 'paymentRejected' },
  { label: 'Payment Received', value: 'paymentReceived' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Preparing', value: 'preparing' },
  { label: 'Ready', value: 'ready' },
  { label: 'Waiting for Rider', value: 'waitingForRider' },
  { label: 'Picked Up', value: 'pickedUp' },
  { label: 'Out for Delivery', value: 'outForDelivery' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export function getVendorOrderStatusLabel(status: OrderStatusModel) {
  return vendorOrderStatuses.find((item) => item.value === status)?.label ?? 'Pending';
}

export function useVendorOrders(restaurantId?: string) {
  const loader = useCallback(async () => (restaurantId ? orderRepository.listByRestaurant(restaurantId) : []), [restaurantId]);
  const paymentLoader = useCallback(async () => (restaurantId ? paymentRepository.listByRestaurant(restaurantId) : []), [restaurantId]);
  const state = useFirestoreData<OrderModel[]>(`vendor-orders:${restaurantId ?? 'none'}`, [], loader);
  const paymentsState = useFirestoreData<PaymentModel[]>(`vendor-payments:${restaurantId ?? 'none'}`, [], paymentLoader);
  const retry = state.retry;
  const retryAll = useCallback(async () => {
    await Promise.all([state.retry(), paymentsState.retry()]);
  }, [paymentsState, state]);

  const updateStatus = useCallback(async (orderId: string, status: OrderStatusModel) => {
    await orderRepository.updateStatus(orderId, status);
    await retryAll();
  }, [retryAll]);

  const acceptOrder = useCallback((orderId: string) => updateStatus(orderId, 'accepted'), [updateStatus]);
  const rejectOrder = useCallback((orderId: string) => updateStatus(orderId, 'cancelled'), [updateStatus]);

  const paymentsByOrderId = useMemo(() => {
    const map = new Map<string, PaymentModel>();
    paymentsState.data.forEach((payment) => map.set(payment.orderId, payment));
    return map;
  }, [paymentsState.data]);

  return { ...state, loading: state.loading || paymentsState.loading, error: state.error ?? paymentsState.error, payments: paymentsState.data, paymentsByOrderId, retry: retryAll, updateStatus, acceptOrder, rejectOrder };
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
