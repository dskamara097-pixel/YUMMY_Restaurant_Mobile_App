import { useCallback } from 'react';

import { OrderModel, OrderStatusModel } from '@/models/Order';
import { orderRepository } from '@/repositories/OrderRepository';
import { useAuth } from '@/hooks/useAuth';
import { useFirestoreData } from '@/hooks/useFirestoreData';

export function useRiderDeliveries() {
  const { userId } = useAuth();
  const loader = useCallback(async () => (userId ? orderRepository.listAssignedToRider(userId) : []), [userId]);
  const state = useFirestoreData<OrderModel[]>(`rider:deliveries:${userId ?? 'guest'}`, [], loader);

  const updateDeliveryStatus = useCallback(async (orderId: string, status: OrderStatusModel) => {
    await orderRepository.updateStatus(orderId, status);
    await state.retry();
  }, [state.retry]);

  return { ...state, updateDeliveryStatus };
}
