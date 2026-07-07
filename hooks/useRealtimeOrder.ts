import { useEffect, useMemo, useState } from 'react';

import { OrderModel } from '@/models/Order';
import { orderRepository } from '@/repositories/OrderRepository';

export function useRealtimeOrder(orderId?: string) {
  const [data, setData] = useState<OrderModel | null>(null);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setData(null);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError(null);

    try {
      const unsubscribe = orderRepository.subscribeToOrder(
        orderId,
        (order) => {
          setData(order);
          setLoading(false);
        },
        (message) => {
          setError(message);
          setLoading(false);
        },
      );

      return unsubscribe;
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : 'Unable to subscribe to order updates.';
      setError(message);
      setLoading(false);
      return undefined;
    }
  }, [orderId]);

  return useMemo(() => ({ data, loading, error }), [data, error, loading]);
}
