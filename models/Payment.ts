export type PaymentMethodModel = 'cashOnDelivery' | 'dummyMobileMoney' | 'dummyCard';

export type MobileMoneyProviderModel = 'Orange Money' | 'Afrimoney' | 'QMoney';

export type PaymentStatusModel = 'pending' | 'awaitingApproval' | 'paid' | 'rejected' | 'failed' | 'refunded';

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
  provider?: MobileMoneyProviderModel;
  mobileNumber?: string;
  cardholderName?: string;
  cardLast4?: string;
  billingAddress?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt?: string;
}
