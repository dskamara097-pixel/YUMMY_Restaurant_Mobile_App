export enum UserRoleEnum {
  Customer = 'customer',
  Vendor = 'vendor',
  Admin = 'admin',
  Rider = 'rider',
}

export enum OrderStatusEnum {
  Pending = 'pending',
  PendingPaymentVerification = 'pendingPaymentVerification',
  PaymentConfirmed = 'paymentConfirmed',
  PaymentRejected = 'paymentRejected',
  PaymentReceived = 'paymentReceived',
  Accepted = 'accepted',
  Preparing = 'preparing',
  Ready = 'ready',
  WaitingForRider = 'waitingForRider',
  PickedUp = 'pickedUp',
  OutForDelivery = 'outForDelivery',
  Delivered = 'delivered',
  Completed = 'completed',
  Cancelled = 'cancelled',
}
