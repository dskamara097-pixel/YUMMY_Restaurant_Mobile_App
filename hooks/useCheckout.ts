import { useCallback, useState } from 'react';

import { APP_CONSTANTS } from '@/utils/constants';
import { OrderModel } from '@/models/Order';
import { MobileMoneyProviderModel, PaymentMethodModel } from '@/models/Payment';
import { notificationRepository } from '@/repositories/NotificationRepository';
import { orderRepository } from '@/repositories/OrderRepository';
import { paymentRepository } from '@/repositories/PaymentRepository';
import { RepositoryCreateInput } from '@/repositories/Repository';
import { restaurantRepository } from '@/repositories/RestaurantRepository';
import { useAddresses } from '@/hooks/useAddresses';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useUserProfile } from '@/hooks/useUserProfile';
import { mapUserProfile } from '@/utils/firestoreAdapters';

export const CHECKOUT_FEES = {
  deliveryFee: 15000,
  serviceFee: 5000,
  discount: 0,
  estimatedDeliveryTime: '25-40 min',
} as const;

export type PlaceOrderInput = {
  paymentMethod: PaymentMethodModel;
  notes?: string;
  amount: number;
  transactionReference?: string;
  mobileMoneyProvider?: MobileMoneyProviderModel;
  mobileNumber?: string;
  cardholderName?: string;
  cardLast4?: string;
  billingAddress?: string;
};

function generateTransactionReference() {
  return `YUMMY-${Date.now()}`;
}

function assertMatchingAmount(inputAmount: number, expectedAmount: number) {
  if (!Number.isFinite(inputAmount) || inputAmount <= 0) {
    throw new Error('Enter a valid payment amount.');
  }

  if (Math.abs(inputAmount - expectedAmount) > 0.01) {
    throw new Error('Payment amount must match the checkout total.');
  }
}

export function useCheckout() {
  const auth = useAuth();
  const { userId } = auth;
  const cart = useCart();
  const addressesState = useAddresses();
  const profileState = useUserProfile();
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
      assertMatchingAmount(input.amount, total);
      const restaurant = await restaurantRepository.getById(restaurantId);
      if (restaurant && !restaurant.active) {
        throw new Error(`${restaurant.name} is currently closed. You can browse the menu, but new orders are paused until the restaurant opens.`);
      }
      const requiresApproval = input.paymentMethod !== 'cashOnDelivery';
      const timestamp = new Date().toISOString();
      const profile = mapUserProfile(profileState.data, { displayName: auth.displayName, email: auth.email });
      const restaurantName = cart.items.find((item) => item.restaurantName)?.restaurantName;
      const trimmedNotes = input.notes?.trim();
      const transactionReference = input.transactionReference?.trim() || generateTransactionReference();
      const orderInput: RepositoryCreateInput<OrderModel> = {
        customerId: userId,
        customerName: profile.fullName,
        restaurantId,
        items: cart.items,
        subtotal: cart.subtotal,
        deliveryFee: CHECKOUT_FEES.deliveryFee,
        serviceFee: CHECKOUT_FEES.serviceFee,
        discount: CHECKOUT_FEES.discount,
        total,
        status: requiresApproval ? 'pendingPaymentVerification' : 'pending',
        paymentStatus: requiresApproval ? 'awaitingApproval' : 'pending',
        deliveryAddressId: defaultAddress.id,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      if (restaurantName) {
        Object.assign(orderInput, { restaurantName });
      }

      if (trimmedNotes) {
        Object.assign(orderInput, { notes: trimmedNotes });
      }

      const order = await orderRepository.create(orderInput);

      const paymentInput = {
        orderId: order.id,
        userId,
        restaurantId,
        method: input.paymentMethod,
        status: requiresApproval ? 'awaitingApproval' as const : 'pending' as const,
        amount: input.amount,
        currency: APP_CONSTANTS.defaultCurrency,
        transactionReference,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      if (input.paymentMethod === 'dummyMobileMoney') {
        Object.assign(paymentInput, {
          provider: input.mobileMoneyProvider,
          mobileNumber: input.mobileNumber?.trim(),
        });
      }

      if (input.paymentMethod === 'dummyCard') {
        Object.assign(paymentInput, {
          cardholderName: input.cardholderName?.trim(),
          cardLast4: input.cardLast4,
          billingAddress: input.billingAddress?.trim(),
        });
      }

      const payment = await paymentRepository.create(paymentInput);

      await orderRepository.update(order.id, { paymentId: payment.id, paymentStatus: payment.status, status: requiresApproval ? 'pendingPaymentVerification' : 'pending' });
      await notificationRepository.createOrderNotification(userId, order.id, 'Order placed', 'Your YUMMY order has been sent to the restaurant.');

      if (requiresApproval) {
        await notificationRepository.createPaymentNotification(userId, order.id, 'Payment awaiting approval', 'Your dummy payment information is waiting for administrator review.');
      }

      await cart.clearCart();
      return { ...order, paymentId: payment.id, paymentStatus: payment.status, status: requiresApproval ? 'pendingPaymentVerification' as const : 'pending' as const };
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : 'Unable to place order. Please retry.';
      setError(message);
      throw nextError;
    } finally {
      setPlacingOrder(false);
    }
  }, [auth.displayName, auth.email, cart, defaultAddress, profileState.data, total, userId]);

  const profile = mapUserProfile(profileState.data, { displayName: auth.displayName, email: auth.email });
  const deliveryAddressText = defaultAddress ? [defaultAddress.addressLine, defaultAddress.city, defaultAddress.country].filter(Boolean).join(', ') : '';

  return { cart, addressesState, defaultAddress, customerName: profile.fullName, customerPhone: profile.phone, deliveryAddressText, total, fees: CHECKOUT_FEES, placingOrder, error, placeOrder };
}
