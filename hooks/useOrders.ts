import { useCallback } from 'react';

import { OrderModel } from '@/models/Order';
import { orderRepository } from '@/repositories/OrderRepository';
import { useAuth } from '@/hooks/useAuth';
import { useFirestoreData } from '@/hooks/useFirestoreData';

export function useOrders() {
  const { userId } = useAuth();
  const loader = useCallback(async () => (userId ? orderRepository.listByCustomer(userId) : []), [userId]);
  return useFirestoreData<OrderModel[]>(`orders:user:${userId ?? 'guest'}`, [], loader);
}

export function useOrder(orderId?: string) {
  const loader = useCallback(async () => (orderId ? orderRepository.getById(orderId) : null), [orderId]);
  return useFirestoreData<OrderModel | null>(`order:${orderId ?? 'none'}`, null, loader);
}
