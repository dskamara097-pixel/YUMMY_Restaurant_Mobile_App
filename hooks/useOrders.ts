import { useCallback, useMemo } from 'react';

import { OrderModel } from '@/models/Order';
import { orderRepository } from '@/repositories/OrderRepository';
import { useAuth } from '@/hooks/useAuth';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { sampleOrderModels } from '@/utils/sampleModelFallbacks';

export function useOrders() {
  const { userId } = useAuth();
  const initialOrders = useMemo(() => sampleOrderModels.map((order) => ({ ...order, customerId: userId ?? order.customerId })), [userId]);
  const loader = useCallback(async () => {
    if (!userId) return initialOrders;

    const orders = await orderRepository.listByCustomer(userId);
    return orders.length > 0 ? orders : initialOrders;
  }, [initialOrders, userId]);
  return useFirestoreData<OrderModel[]>(`orders:user:${userId ?? 'guest'}`, initialOrders, loader);
}

export function useOrder(orderId?: string) {
  const initialOrder = useMemo(() => sampleOrderModels.find((order) => order.id === orderId) ?? sampleOrderModels[0] ?? null, [orderId]);
  const loader = useCallback(async () => {
    if (!orderId) return initialOrder;

    return (await orderRepository.getById(orderId)) ?? initialOrder;
  }, [initialOrder, orderId]);
  return useFirestoreData<OrderModel | null>(`order:${orderId ?? 'none'}`, initialOrder, loader);
}
