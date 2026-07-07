import { useCallback } from 'react';

import { PaymentModel } from '@/models/Payment';
import { paymentRepository } from '@/repositories/PaymentRepository';
import { useAuth } from '@/hooks/useAuth';
import { useFirestoreData } from '@/hooks/useFirestoreData';

export function usePayments() {
  const { userId } = useAuth();
  const loader = useCallback(async () => (userId ? paymentRepository.listByUser(userId) : []), [userId]);
  return useFirestoreData<PaymentModel[]>(`payments:user:${userId ?? 'guest'}`, [], loader);
}
