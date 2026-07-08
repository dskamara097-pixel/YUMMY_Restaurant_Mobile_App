import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CartItemCard } from '@/components/cart/CartItemCard';
import { CartSummaryCard } from '@/components/cart/CartSummaryCard';
import { DeliveryAddressCard } from '@/components/cart/DeliveryAddressCard';
import { OrderNotesCard } from '@/components/cart/OrderNotesCard';
import { PromoCodeCard } from '@/components/cart/PromoCodeCard';
import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useAddresses } from '@/hooks/useAddresses';
import { useCart } from '@/hooks/useCart';
import { CHECKOUT_FEES } from '@/hooks/useCheckout';

export default function ShoppingCartScreen() {
  const cart = useCart();
  const addressesState = useAddresses();
  const [notes, setNotes] = useState('Leave at gate');
  const [addressNotice, setAddressNotice] = useState('');
  const [promoNotice, setPromoNotice] = useState('');
  const defaultAddress = addressesState.data.find((address) => address.isDefault) ?? addressesState.data[0] ?? null;
  const hasItems = cart.items.length > 0;
  const deliveryFee = hasItems ? CHECKOUT_FEES.deliveryFee : 0;
  const serviceFee = hasItems ? CHECKOUT_FEES.serviceFee : 0;
  const discount = hasItems ? CHECKOUT_FEES.discount : 0;
  const total = Math.max(0, cart.subtotal + deliveryFee + serviceFee - discount);

  if (cart.loading) {
    return <ScreenContainer contentStyle={styles.emptyScreen}><LoadingState title="Loading cart" message="Fetching your Firestore cart." /></ScreenContainer>;
  }

  if (cart.error) {
    return <ScreenContainer contentStyle={styles.emptyScreen}><FriendlyErrorState title="Cart unavailable" message={cart.error} onRetry={cart.retry} /></ScreenContainer>;
  }

  if (!hasItems) {
    return (
      <ScreenContainer contentStyle={styles.emptyScreen}>
        <View style={styles.emptyIllustration}>
          <AppIcon name="cart-outline" size={64} color={colors.brand.primary} />
        </View>
        <EmptyState
          title="Your cart is empty"
          message="Browse restaurants and add meals to start a new order."
          icon="restaurant-outline"
          actionLabel="Browse Restaurants"
          onActionPress={() => router.replace('/(customer)/home' as Href)}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader
        title="Shopping Cart"
        subtitle="Review your order"
        leftIcon="arrow-back"
        onLeftPress={() => router.back()}
        rightIcon="home-outline"
        onRightPress={() => router.push('/(customer)/home' as Href)}
      />

      <View style={styles.statusCard}>
        <AppBadge label={`${cart.items.length} Firestore item${cart.items.length === 1 ? '' : 's'}`} tone="primary" icon="cart-outline" />
        <AppText variant="bodyStrong">Production cart workflow</AppText>
        <AppText tone="muted">Quantity updates, removals, subtotal, and checkout totals are backed by Firestore repositories.</AppText>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Items in Cart" subtitle="Ready for checkout" />
        <View style={styles.list}>
          {cart.items.map((item) => (
            <CartItemCard
              key={item.foodId}
              name={item.name}
              restaurantName={item.restaurantName ?? item.restaurantId}
              unitPrice={item.unitPrice}
              quantity={item.quantity}
              imageUrl={item.imageUrl}
              onIncrease={() => void cart.updateQuantity(item.foodId, item.quantity + 1)}
              onDecrease={() => void cart.updateQuantity(item.foodId, item.quantity - 1)}
              onRemove={() => void cart.removeItem(item.foodId)}
            />
          ))}
        </View>
      </View>

      <PromoCodeCard onApply={(code) => setPromoNotice(code ? `${code} is saved as a placeholder promo action.` : 'Enter a promo code first.')} />
      {promoNotice ? <AppBadge label={promoNotice} tone="info" icon="pricetag-outline" /> : null}

      <DeliveryAddressCard
        customerName={defaultAddress?.recipientName ?? 'Delivery customer'}
        phone={defaultAddress?.phone ?? 'Phone pending'}
        address={defaultAddress ? [defaultAddress.addressLine, defaultAddress.city, defaultAddress.country].filter(Boolean).join(', ') : 'Add a saved delivery address before checkout.'}
        onChangePress={() => {
          setAddressNotice('Open saved addresses to manage delivery details.');
          router.push('/(customer)/addresses' as Href);
        }}
      />
      {addressNotice ? <AppBadge label={addressNotice} tone="info" icon="information-circle-outline" /> : null}

      <OrderNotesCard value={notes} onChangeText={setNotes} />

      <CartSummaryCard
        subtotal={cart.subtotal}
        deliveryFee={deliveryFee}
        serviceFee={serviceFee}
        discount={discount}
        total={total}
      />

      <AppButton
        label="Proceed to Checkout"
        rightIcon="chevron-forward"
        loading={cart.mutating}
        onPress={() => router.push({ pathname: '/(customer)/checkout', params: { notes } } as unknown as Href)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  emptyScreen: {
    alignItems: 'center',
    gap: spacing.lg,
    justifyContent: 'center',
  },
  emptyIllustration: {
    alignItems: 'center',
    backgroundColor: colors.brand.primarySoft,
    borderRadius: radius.xl,
    height: 132,
    justifyContent: 'center',
    width: 132,
    ...shadows.card,
  },
  statusCard: {
    backgroundColor: colors.semantic.infoSoft,
    borderRadius: radius.lg,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  section: {
    gap: spacing.md,
  },
  list: {
    gap: spacing.md,
  },
});

