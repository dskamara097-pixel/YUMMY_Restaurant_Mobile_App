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
    return this.list({ filters: [{ field: 'customerId', value: customerId }] })
      .then((orders) => orders.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()));
  }

  listByRestaurant(restaurantId: string) {
    return this.list({ filters: [{ field: 'restaurantId', value: restaurantId }] })
      .then((orders) => orders.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()));
  }

  listByRestaurantStatus(restaurantId: string, status: OrderStatusModel) {
    return this.listByRestaurant(restaurantId)
      .then((orders) => orders.filter((order) => order.status === status));
  }

  listAssignedToRider(riderId: string) {
    return this.list({ filters: [{ field: 'riderId', value: riderId }] })
      .then((orders) => orders.sort((left, right) => new Date(right.updatedAt ?? 0).getTime() - new Date(left.updatedAt ?? 0).getTime()));
  }

  updateStatus(orderId: string, status: OrderStatusModel) {
    return this.update(orderId, { status });
  }

  markDelivered(orderId: string) {
    return this.update(orderId, { status: 'delivered' });
  }

  confirmCustomerDelivery(orderId: string) {
    return this.update(orderId, {
      status: 'completed',
      customerConfirmedDelivery: true,
      completedAt: new Date().toISOString(),
    });
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
