import { PaymentModel, PaymentStatusModel } from '@/models/Payment';
import { FirestoreRepository } from '@/repositories/Repository';
import { FIRESTORE_COLLECTIONS } from '@/utils/constants';

export class PaymentRepository extends FirestoreRepository<PaymentModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.payments);
  }

  listByUser(userId: string) {
    return this.list({ filters: [{ field: 'userId', value: userId }], sort: [{ field: 'createdAt', direction: 'desc' }] });
  }

  listByOrder(orderId: string) {
    return this.list({ filters: [{ field: 'orderId', value: orderId }], sort: [{ field: 'createdAt', direction: 'desc' }] });
  }

  updateStatus(paymentId: string, status: PaymentStatusModel, failureReason?: string) {
    return this.update(paymentId, { status, failureReason });
  }
}

export const paymentRepository = new PaymentRepository();
