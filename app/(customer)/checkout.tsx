import type { Href } from 'expo-router';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CartItemCard } from '@/components/cart/CartItemCard';
import { CartSummaryCard } from '@/components/cart/CartSummaryCard';
import { DeliveryAddressCard } from '@/components/cart/DeliveryAddressCard';
import { OrderNotesCard } from '@/components/cart/OrderNotesCard';
import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppDivider } from '@/components/common/AppDivider';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { PriceTag } from '@/components/food/PriceTag';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useCheckout } from '@/hooks/useCheckout';
import { PaymentMethodModel } from '@/models/Payment';

const paymentOptions: Array<{ method: PaymentMethodModel; label: string; detail: string; icon: 'cash-outline' | 'phone-portrait-outline' | 'card-outline' }> = [
  { method: 'cashOnDelivery', label: 'Cash on Delivery', detail: 'Payment remains pending until delivery.', icon: 'cash-outline' },
  { method: 'dummyMobileMoney', label: 'Dummy Mobile Money', detail: 'Simulates an approved mobile payment.', icon: 'phone-portrait-outline' },
  { method: 'dummyCard', label: 'Dummy Card Payment', detail: 'Simulates an approved card payment.', icon: 'card-outline' },
];

export default function CheckoutScreen() {
  const { notes: routeNotes } = useLocalSearchParams<{ notes?: string }>();
  const checkout = useCheckout();
  const [notes, setNotes] = useState(routeNotes ?? 'Call when arriving');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodModel>('cashOnDelivery');
  const [notice, setNotice] = useState('');
  const cart = checkout.cart;

  async function handlePlaceOrder() {
    try {
      const order = await checkout.placeOrder({ paymentMethod, notes });
      setNotice('Order placed successfully. Opening the timeline tracker.');
      router.replace({ pathname: '/(customer)/tracking/[orderId]', params: { orderId: order.id } } as unknown as Href);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to place order. Please retry.';
      setNotice(message);
    }
  }

  if (cart.loading || checkout.addressesState.loading) {
    return <ScreenContainer contentStyle={styles.centeredScreen}><LoadingState title="Preparing checkout" message="Loading cart and delivery details." /></ScreenContainer>;
  }

  if (cart.error || checkout.error) {
    return <ScreenContainer contentStyle={styles.centeredScreen}><FriendlyErrorState title="Checkout unavailable" message={cart.error ?? checkout.error ?? 'Unable to prepare checkout.'} onRetry={cart.retry} /></ScreenContainer>;
  }

  if (cart.items.length === 0) {
    return <ScreenContainer contentStyle={styles.centeredScreen}><EmptyState title="Your cart is empty" message="Add a meal before checkout." icon="cart-outline" actionLabel="Browse Restaurants" onActionPress={() => router.replace('/(customer)/home' as Href)} /></ScreenContainer>;
  }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader
        title="Checkout"
        subtitle="Create order and dummy payment"
        leftIcon="arrow-back"
        onLeftPress={() => router.back()}
        rightIcon="cart-outline"
        onRightPress={() => router.push('/(customer)/cart' as Href)}
      />

      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <AppIcon name="receipt-outline" color={colors.neutral.surface} size={30} />
        </View>
        <View style={styles.heroCopy}>
          <AppText variant="sectionTitle">Order Summary</AppText>
          <AppText tone="muted">Place Order saves an order, creates a dummy payment record, sends Firestore notifications, and clears the cart.</AppText>
        </View>
      </View>

      <DeliveryAddressCard
        customerName={checkout.defaultAddress?.recipientName ?? 'Delivery customer'}
        phone={checkout.defaultAddress?.phone ?? 'Phone pending'}
        address={checkout.defaultAddress ? [checkout.defaultAddress.addressLine, checkout.defaultAddress.city, checkout.defaultAddress.country].filter(Boolean).join(', ') : 'Add a delivery address before checkout.'}
        onChangePress={() => router.push('/(customer)/addresses' as Href)}
      />

      <View style={styles.section}>
        <SectionHeader title="Items Ordered" subtitle={`${cart.items.length} Firestore item${cart.items.length === 1 ? '' : 's'}`} />
        <View style={styles.list}>
          {cart.items.map((item) => (
            <CartItemCard
              key={item.foodId}
              name={item.name}
              restaurantName={item.restaurantName ?? item.restaurantId}
              unitPrice={item.unitPrice}
              quantity={item.quantity}
              imageSource={item.imageUrl ? { uri: item.imageUrl } : undefined}
            />
          ))}
        </View>
      </View>

      <View style={styles.deliveryCard}>
        <View style={styles.deliveryRow}>
          <View style={styles.deliveryIcon}>
            <AppIcon name="time-outline" color={colors.brand.primary} />
          </View>
          <View style={styles.deliveryCopy}>
            <AppText variant="bodyStrong">Estimated Delivery Time</AppText>
            <AppText tone="muted">{checkout.fees.estimatedDeliveryTime}</AppText>
          </View>
        </View>
        <AppDivider inset />
        <SectionHeader title="Payment Method" subtitle="Dummy payment only, no gateway" />
        <View style={styles.paymentList}>
          {paymentOptions.map((option) => {
            const active = option.method === paymentMethod;
            return (
              <Pressable key={option.method} accessibilityRole="button" onPress={() => setPaymentMethod(option.method)} style={[styles.paymentOption, active && styles.paymentOptionActive]}>
                <AppIcon name={option.icon} color={active ? colors.neutral.surface : colors.brand.primary} />
                <View style={styles.paymentCopy}>
                  <AppText variant="bodyStrong" tone={active ? 'inverse' : 'default'}>{option.label}</AppText>
                  <AppText variant="caption" tone={active ? 'inverse' : 'muted'}>{option.detail}</AppText>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <OrderNotesCard value={notes} onChangeText={setNotes} />

      <CartSummaryCard
        title="Price Breakdown"
        subtotal={cart.subtotal}
        deliveryFee={checkout.fees.deliveryFee}
        serviceFee={checkout.fees.serviceFee}
        discount={checkout.fees.discount}
        total={checkout.total}
      />

      <View style={styles.totalBar}>
        <View style={styles.totalCopy}>
          <AppText variant="caption" tone="muted">Total payable</AppText>
          <PriceTag amount={checkout.total} size="lg" />
        </View>
        <AppButton
          label="Place Order"
          leftIcon="checkmark-circle-outline"
          fullWidth={false}
          loading={checkout.placingOrder}
          disabled={!checkout.defaultAddress}
          onPress={() => void handlePlaceOrder()}
        />
      </View>

      {notice ? <AppBadge label={notice} tone={notice.includes('success') ? 'success' : 'info'} icon="information-circle-outline" /> : null}
      <AppBadge label="No real payment API, backend API, maps, GPS, or push notifications are used." tone="info" icon="shield-checkmark-outline" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  centeredScreen: {
    justifyContent: 'center',
  },
  heroCard: {
    alignItems: 'center',
    backgroundColor: colors.neutral.surface,
    borderColor: colors.neutral.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    ...shadows.soft,
  },
  heroIcon: {
    alignItems: 'center',
    backgroundColor: colors.brand.primary,
    borderRadius: radius.lg,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  heroCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  section: {
    gap: spacing.md,
  },
  list: {
    gap: spacing.md,
  },
  deliveryCard: {
    backgroundColor: colors.neutral.surface,
    borderColor: colors.neutral.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
    ...shadows.soft,
  },
  deliveryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  deliveryIcon: {
    alignItems: 'center',
    backgroundColor: colors.brand.primarySoft,
    borderRadius: radius.md,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  deliveryCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  paymentList: {
    gap: spacing.sm,
  },
  paymentOption: {
    alignItems: 'center',
    backgroundColor: colors.brand.primarySoft,
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  paymentOptionActive: {
    backgroundColor: colors.brand.primary,
  },
  paymentCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  totalBar: {
    alignItems: 'center',
    backgroundColor: colors.neutral.surface,
    borderColor: colors.neutral.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    padding: spacing.lg,
    ...shadows.card,
  },
  totalCopy: {
    flex: 1,
    gap: spacing.sm,
  },
});
