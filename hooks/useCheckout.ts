import { useCallback, useState } from 'react';

import { APP_CONSTANTS } from '@/utils/constants';
import { PaymentMethodModel } from '@/models/Payment';
import { notificationRepository } from '@/repositories/NotificationRepository';
import { orderRepository } from '@/repositories/OrderRepository';
import { paymentRepository } from '@/repositories/PaymentRepository';
import { useAddresses } from '@/hooks/useAddresses';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

export const CHECKOUT_FEES = {
  deliveryFee: 15000,
  serviceFee: 5000,
  discount: 0,
  estimatedDeliveryTime: '25-40 min',
} as const;

export type PlaceOrderInput = {
  paymentMethod: PaymentMethodModel;
  notes?: string;
};

function generateTransactionReference() {
  return `YUMMY-${Date.now()}`;
}

export function useCheckout() {
  const { userId } = useAuth();
  const cart = useCart();
  const addressesState = useAddresses();
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultAddress = addressesState.data.find((address) => address.isDefault) ?? addressesState.data[0] ?? null;
  const total = Math.max(0, cart.subtotal + CHECKOUT_FEES.deliveryFee + CHECKOUT_FEES.serviceFee - CHECKOUT_FEES.discount);

  const placeOrder = useCallback(async (input: PlaceOrderInput) => {
    setError(null);

    if (!userId) {
      throw new Error('Sign in before placing an order.');
    }

    if (cart.items.length === 0) {
      throw new Error('Your cart is empty. Add food before checkout.');
    }

    if (!defaultAddress) {
      throw new Error('Add a delivery address before placing an order.');
    }

    const restaurantId = cart.data?.restaurantId ?? cart.items[0]?.restaurantId;

    if (!restaurantId) {
      throw new Error('The cart does not include a restaurant reference.');
    }

    setPlacingOrder(true);

    try {
      const paidImmediately = input.paymentMethod !== 'cashOnDelivery';
      const timestamp = new Date().toISOString();
      const order = await orderRepository.create({
        customerId: userId,
        restaurantId,
        items: cart.items,
        subtotal: cart.subtotal,
        deliveryFee: CHECKOUT_FEES.deliveryFee,
        serviceFee: CHECKOUT_FEES.serviceFee,
        discount: CHECKOUT_FEES.discount,
        total,
        status: paidImmediately ? 'paymentReceived' : 'pending',
        paymentStatus: paidImmediately ? 'paid' : 'pending',
        deliveryAddressId: defaultAddress.id,
        notes: input.notes?.trim(),
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      const payment = await paymentRepository.create({
        orderId: order.id,
        userId,
        restaurantId,
        method: input.paymentMethod,
        status: paidImmediately ? 'paid' : 'pending',
        amount: total,
        currency: APP_CONSTANTS.defaultCurrency,
        transactionReference: generateTransactionReference(),
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      await orderRepository.update(order.id, { paymentId: payment.id, paymentStatus: payment.status, status: paidImmediately ? 'paymentReceived' : 'pending' });
      await notificationRepository.createOrderNotification(userId, order.id, 'Order placed', 'Your YUMMY order has been sent to the restaurant.');

      if (paidImmediately) {
        await notificationRepository.createPaymentNotification(userId, order.id, 'Payment received', 'Your dummy payment was approved for this order.');
      }

      await cart.clearCart();
      return { ...order, paymentId: payment.id, paymentStatus: payment.status, status: paidImmediately ? 'paymentReceived' as const : 'pending' as const };
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : 'Unable to place order. Please retry.';
      setError(message);
      throw nextError;
    } finally {
      setPlacingOrder(false);
    }
  }, [cart, defaultAddress, total, userId]);

  return { cart, addressesState, defaultAddress, total, fees: CHECKOUT_FEES, placingOrder, error, placeOrder };
}
