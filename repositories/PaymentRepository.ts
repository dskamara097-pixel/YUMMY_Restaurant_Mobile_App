import { PaymentModel, PaymentStatusModel } from '@/models/Payment';
import { FirestoreRepository } from '@/repositories/Repository';
import { FIRESTORE_COLLECTIONS } from '@/utils/constants';

export class PaymentRepository extends FirestoreRepository<PaymentModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.payments);
  }

  listByUser(userId: string) {
    return this.list({ filters: [{ field: 'userId', value: userId }] })
      .then((payments) => payments.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()));
  }

  listByOrder(orderId: string) {
    return this.list({ filters: [{ field: 'orderId', value: orderId }] })
      .then((payments) => payments.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()));
  }

  listByRestaurant(restaurantId: string) {
    return this.list({ filters: [{ field: 'restaurantId', value: restaurantId }] })
      .then((payments) => payments.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()));
  }

  updateStatus(paymentId: string, status: PaymentStatusModel, failureReason?: string) {
    return this.update(paymentId, failureReason ? { status, failureReason } : { status });
  }
}

export const paymentRepository = new PaymentRepository();
