import { NotificationModel } from '@/models/Notification';
import { FirestoreRepository } from '@/repositories/Repository';
import { FIRESTORE_COLLECTIONS } from '@/utils/constants';

export class NotificationRepository extends FirestoreRepository<NotificationModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.notifications);
  }

  listByUser(userId: string) {
    return this.list({ filters: [{ field: 'userId', value: userId }], sort: [{ field: 'createdAt', direction: 'desc' }] });
  }

  listUnreadByUser(userId: string) {
    return this.list({ filters: [{ field: 'userId', value: userId }, { field: 'read', value: false }], sort: [{ field: 'createdAt', direction: 'desc' }] });
  }

  createOrderNotification(userId: string, orderId: string, title: string, message: string) {
    return this.create({ userId, orderId, title, message, type: 'order', read: false, createdAt: new Date().toISOString() });
  }

  createPaymentNotification(userId: string, orderId: string, title: string, message: string) {
    return this.create({ userId, orderId, title, message, type: 'payment', read: false, createdAt: new Date().toISOString() });
  }

  createPromotionNotification(userId: string, title: string, message: string) {
    return this.create({ userId, title, message, type: 'promotion', read: false, createdAt: new Date().toISOString() });
  }

  markRead(notificationId: string) {
    return this.update(notificationId, { read: true });
  }
}

export const notificationRepository = new NotificationRepository();
