import { doc, onSnapshot, Unsubscribe } from '@firebase/firestore';

import { getFirebaseFirestore } from '@/firebase/firestore';
import { OrderModel, OrderStatusModel } from '@/models/Order';
import { FirestoreRepository } from '@/repositories/Repository';
import { FIRESTORE_COLLECTIONS } from '@/utils/constants';
import { AppError } from '@/utils/AppError';

export class OrderRepository extends FirestoreRepository<OrderModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.orders);
  }

  listByCustomer(customerId: string) {
    return this.list({ filters: [{ field: 'customerId', value: customerId }], sort: [{ field: 'createdAt', direction: 'desc' }] });
  }

  listByRestaurant(restaurantId: string) {
    return this.list({ filters: [{ field: 'restaurantId', value: restaurantId }], sort: [{ field: 'createdAt', direction: 'desc' }] });
  }

  listByRestaurantStatus(restaurantId: string, status: OrderStatusModel) {
    return this.list({ filters: [{ field: 'restaurantId', value: restaurantId }, { field: 'status', value: status }], sort: [{ field: 'createdAt', direction: 'desc' }] });
  }

  listAssignedToRider(riderId: string) {
    return this.list({ filters: [{ field: 'riderId', value: riderId }], sort: [{ field: 'updatedAt', direction: 'desc' }] });
  }

  updateStatus(orderId: string, status: OrderStatusModel) {
    return this.update(orderId, { status });
  }

  subscribeToOrder(orderId: string, onNext: (order: OrderModel | null) => void, onError: (message: string) => void): Unsubscribe {
    const db = getFirebaseFirestore();

    if (!db) {
      throw new AppError('firebase/configuration', 'Firestore is not configured for realtime order tracking.');
    }

    return onSnapshot(
      doc(db, FIRESTORE_COLLECTIONS.orders, orderId),
      (snapshot) => onNext(snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as OrderModel) : null),
      (error) => onError(error.message),
    );
  }
}

export const orderRepository = new OrderRepository();
