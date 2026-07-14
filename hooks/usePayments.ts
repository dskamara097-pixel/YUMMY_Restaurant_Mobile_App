import { useCallback, useMemo } from 'react';

import { PaymentModel } from '@/models/Payment';
import { paymentRepository } from '@/repositories/PaymentRepository';
import { useAuth } from '@/hooks/useAuth';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { samplePaymentModels } from '@/utils/sampleModelFallbacks';

export function usePayments() {
  const { userId } = useAuth();
  const initialPayments = useMemo(() => samplePaymentModels.map((payment) => ({ ...payment, userId: userId ?? payment.userId })), [userId]);
  const loader = useCallback(async () => {
    if (!userId) return initialPayments;

    const payments = await paymentRepository.listByUser(userId);
    return payments.length > 0 ? payments : initialPayments;
  }, [initialPayments, userId]);
  return useFirestoreData<PaymentModel[]>(`payments:user:${userId ?? 'guest'}`, initialPayments, loader);
}
