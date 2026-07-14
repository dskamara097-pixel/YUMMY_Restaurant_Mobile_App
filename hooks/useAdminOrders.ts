import { useCallback, useMemo } from 'react';

import { OrderModel, OrderStatusModel } from '@/models/Order';
import { PaymentModel } from '@/models/Payment';
import { notificationRepository } from '@/repositories/NotificationRepository';
import { orderRepository } from '@/repositories/OrderRepository';
import { paymentRepository } from '@/repositories/PaymentRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { vendorOrderStatuses } from '@/hooks/useVendorOrders';

export const adminOrderStatuses = vendorOrderStatuses;

const orderNotifications: Partial<Record<OrderStatusModel, { title: string; message: string; type: 'order' | 'payment' }>> = {
  paymentConfirmed: {
    title: 'Payment received',
    message: 'Your dummy payment has been approved. The restaurant can begin preparing your order.',
    type: 'payment',
  },
  paymentRejected: {
    title: 'Payment rejected',
    message: 'Your dummy payment was rejected. Please contact support or retry checkout.',
    type: 'payment',
  },
  preparing: {
    title: 'Food preparation started',
    message: 'The restaurant has started preparing your order.',
    type: 'order',
  },
  ready: {
    title: 'Food ready',
    message: 'Your order is ready for delivery handoff.',
    type: 'order',
  },
  outForDelivery: {
    title: 'Order out for delivery',
    message: 'Your order is on the way.',
    type: 'order',
  },
  delivered: {
    title: 'Order delivered',
    message: 'Your order has been marked delivered. Confirm delivery when you receive it.',
    type: 'order',
  },
};

function paymentForOrder(order: OrderModel, payments: PaymentModel[]) {
  return payments.find((payment) => payment.id === order.paymentId) ?? payments.find((payment) => payment.orderId === order.id) ?? null;
}

function sortByCreatedAt<TItem extends { createdAt?: string }>(items: TItem[]) {
  return [...items].sort((left, right) => new Date(right.createdAt ?? 0).getTime() - new Date(left.createdAt ?? 0).getTime());
}

async function notifyOrderCustomer(order: OrderModel, status: OrderStatusModel) {
  const notification = orderNotifications[status];

  if (!notification) return;

  if (notification.type === 'payment') {
    await notificationRepository.createPaymentNotification(order.customerId, order.id, notification.title, notification.message);
  } else {
    await notificationRepository.createOrderNotification(order.customerId, order.id, notification.title, notification.message);
  }
}

export function useAdminOrders() {
  const orderLoader = useCallback(() => orderRepository.list().then(sortByCreatedAt), []);
  const paymentLoader = useCallback(() => paymentRepository.list().then(sortByCreatedAt), []);
  const state = useFirestoreData<OrderModel[]>('admin-orders', [], orderLoader);
  const paymentsState = useFirestoreData<PaymentModel[]>('admin-payments:orders', [], paymentLoader);
  const retry = state.retry;
  const retryAll = useCallback(async () => {
    await Promise.all([state.retry(), paymentsState.retry()]);
  }, [paymentsState, state]);

  const updateStatus = useCallback(async (orderId: string, status: OrderStatusModel) => {
    const order = state.data.find((item) => item.id === orderId);
    await orderRepository.updateStatus(orderId, status);

    if (order) {
      await notifyOrderCustomer(order, status);
    }

    await retry();
  }, [retry, state.data]);

  const approvePayment = useCallback(async (order: OrderModel) => {
    const payment = paymentForOrder(order, paymentsState.data);

    if (payment) {
      await paymentRepository.updateStatus(payment.id, 'paid');
    }

    await orderRepository.update(order.id, {
      paymentId: payment?.id ?? order.paymentId,
      paymentStatus: 'paid',
      status: 'paymentConfirmed',
    });
    await notifyOrderCustomer(order, 'paymentConfirmed');
    await retryAll();
  }, [paymentsState.data, retryAll]);

  const rejectPayment = useCallback(async (order: OrderModel) => {
    const payment = paymentForOrder(order, paymentsState.data);

    if (payment) {
      await paymentRepository.updateStatus(payment.id, 'rejected', 'Rejected by administrator.');
    }

    await orderRepository.update(order.id, {
      paymentId: payment?.id ?? order.paymentId,
      paymentStatus: 'rejected',
      status: 'paymentRejected',
    });
    await notifyOrderCustomer(order, 'paymentRejected');
    await retryAll();
  }, [paymentsState.data, retryAll]);

  const setProgressStatus = useCallback(async (order: OrderModel, status: OrderStatusModel) => {
    const nextData: Partial<OrderModel> = { status };

    if (status === 'delivered') {
      nextData.customerConfirmedDelivery = false;
    }

    await orderRepository.update(order.id, nextData);
    await notifyOrderCustomer(order, status);
    await retry();
  }, [retry]);

  const paymentsByOrderId = useMemo(() => {
    const map = new Map<string, PaymentModel>();
    paymentsState.data.forEach((payment) => {
      map.set(payment.orderId, payment);
    });
    return map;
  }, [paymentsState.data]);

  return {
    ...state,
    loading: state.loading || paymentsState.loading,
    error: state.error ?? paymentsState.error,
    payments: paymentsState.data,
    paymentsByOrderId,
    retry: retryAll,
    updateStatus,
    approvePayment,
    rejectPayment,
    setProgressStatus,
  };
}

export function useAdminOrderFilters(orders: OrderModel[], query: string, status: OrderStatusModel | 'all') {
  return useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return orders.filter((order) => {
      const source = [order.id, order.customerId, order.restaurantId, order.customerName, order.restaurantName, order.items.map((item) => item.name).join(' ')].join(' ').toLowerCase();
      return (status === 'all' || order.status === status) && (!normalizedQuery || source.includes(normalizedQuery));
    });
  }, [orders, query, status]);
}
