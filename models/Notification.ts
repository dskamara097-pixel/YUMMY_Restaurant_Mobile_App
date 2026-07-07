export interface NotificationModel {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'payment' | 'order' | 'promotion' | 'system';
  read: boolean;
  orderId?: string;
  createdAt: string;
}

