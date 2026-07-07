import { CartItemModel } from '@/models/Cart';
import { PaymentStatusModel } from '@/models/Payment';

export type OrderStatusModel = 'pending' | 'paymentReceived' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface OrderModel {
  id: string;
  customerId: string;
  restaurantId: string;
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
  createdAt: string;
  updatedAt?: string;
}

