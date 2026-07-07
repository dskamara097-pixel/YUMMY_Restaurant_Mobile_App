export type PaymentMethodModel = 'cashOnDelivery' | 'dummyMobileMoney' | 'dummyCard';

export type PaymentStatusModel = 'pending' | 'paid' | 'failed' | 'refunded';

export interface PaymentModel {
  id: string;
  orderId: string;
  userId: string;
  restaurantId: string;
  method: PaymentMethodModel;
  status: PaymentStatusModel;
  amount: number;
  currency: string;
  transactionReference: string;
  failureReason?: string;
  createdAt: string;
  updatedAt?: string;
}
