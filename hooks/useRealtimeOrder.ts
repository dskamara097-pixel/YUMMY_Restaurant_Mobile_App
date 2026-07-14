import { useCallback, useEffect, useMemo, useState } from 'react';

import { OrderModel } from '@/models/Order';
import { orderRepository } from '@/repositories/OrderRepository';
import { sampleOrderModels } from '@/utils/sampleModelFallbacks';

export function useRealtimeOrder(orderId?: string) {
  const fallbackOrder = useMemo(() => sampleOrderModels.find((order) => order.id === orderId) ?? sampleOrderModels[0] ?? null, [orderId]);
  const [data, setData] = useState<OrderModel | null>(fallbackOrder);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelivery, setConfirmingDelivery] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setData(fallbackOrder);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError(null);

    try {
      const unsubscribe = orderRepository.subscribeToOrder(
        orderId,
        (order) => {
          setData(order ?? fallbackOrder);
          setLoading(false);
        },
        () => {
          setData(fallbackOrder);
          setError(null);
          setLoading(false);
        },
      );

      return unsubscribe;
    } catch {
      setData(fallbackOrder);
      setError(null);
      setLoading(false);
      return undefined;
    }
  }, [fallbackOrder, orderId]);

  const confirmDelivery = useCallback(async () => {
    if (!orderId) return;

    setConfirmingDelivery(true);

    try {
      const nextOrder = await orderRepository.confirmCustomerDelivery(orderId);
      setData(nextOrder ?? data);
    } finally {
      setConfirmingDelivery(false);
    }
  }, [data, orderId]);

  return useMemo(
    () => ({ data, loading, error, confirmingDelivery, confirmDelivery }),
    [confirmDelivery, confirmingDelivery, data, error, loading],
  );
}
