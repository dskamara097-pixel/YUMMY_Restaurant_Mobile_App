import { CartItemModel } from '@/models/Cart';
import { PaymentStatusModel } from '@/models/Payment';

export type OrderStatusModel =
  | 'pending'
  | 'pendingPaymentVerification'
  | 'paymentConfirmed'
  | 'paymentRejected'
  | 'paymentReceived'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'waitingForRider'
  | 'pickedUp'
  | 'outForDelivery'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface OrderModel {
  id: string;
  customerId: string;
  customerName?: string;
  restaurantId: string;
  restaurantName?: string;
  items: CartItemModel[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  total: number;
  status: OrderStatusModel;
  paymentStatus: PaymentStatusModel;
  paymentId?: string;
  riderId?: string;
  deliveryAddressId: string;
  notes?: string;
  customerConfirmedDelivery?: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

