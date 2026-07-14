import type { Href } from 'expo-router';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
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
import { AppInput } from '@/components/forms/AppInput';
import { PriceTag } from '@/components/food/PriceTag';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useCheckout } from '@/hooks/useCheckout';
import { MobileMoneyProviderModel, PaymentMethodModel } from '@/models/Payment';
import { formatCurrency } from '@/utils/formatCurrency';

const paymentOptions: Array<{ method: PaymentMethodModel; label: string; detail: string; icon: 'cash-outline' | 'phone-portrait-outline' | 'card-outline' }> = [
  { method: 'cashOnDelivery', label: 'Cash on Delivery', detail: 'Payment remains pending until delivery.', icon: 'cash-outline' },
  { method: 'dummyMobileMoney', label: 'Dummy Mobile Money', detail: 'Submit for manual approval.', icon: 'phone-portrait-outline' },
  { method: 'dummyCard', label: 'Dummy Card Payment', detail: 'Submit safe card preview data.', icon: 'card-outline' },
];

const mobileMoneyProviders: MobileMoneyProviderModel[] = ['Orange Money', 'Afrimoney', 'QMoney'];

type PaymentErrors = Partial<Record<'mobileNumber' | 'mobileAmount' | 'mobileReference' | 'cardholderName' | 'cardNumber' | 'expiryDate' | 'cvv' | 'billingAddress' | 'cardAmount', string>>;

function createDummyReference(prefix: string) {
  return `${prefix}-${Date.now().toString().slice(-8)}`;
}

function normalizeDigits(value: string) {
  return value.replace(/\D/g, '');
}

function readAmount(value: string) {
  return Number(value.replace(/,/g, '').trim());
}

function amountMatches(value: string, expectedTotal: number) {
  const amount = readAmount(value);
  return Number.isFinite(amount) && Math.abs(amount - expectedTotal) <= 0.01;
}

export default function CheckoutScreen() {
  const { notes: routeNotes } = useLocalSearchParams<{ notes?: string }>();
  const checkout = useCheckout();
  const [notes, setNotes] = useState(routeNotes ?? 'Call when arriving');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodModel>('cashOnDelivery');
  const [notice, setNotice] = useState('');
  const [paymentErrors, setPaymentErrors] = useState<PaymentErrors>({});
  const [paymentInfoSubmitted, setPaymentInfoSubmitted] = useState(false);
  const [mobileProvider, setMobileProvider] = useState<MobileMoneyProviderModel>('Orange Money');
  const [mobileNumber, setMobileNumber] = useState('');
  const [mobileAmount, setMobileAmount] = useState('');
  const [mobileReference, setMobileReference] = useState(createDummyReference('MM'));
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [cardAmount, setCardAmount] = useState('');
  const [cardReference, setCardReference] = useState(createDummyReference('CARD'));
  const cart = checkout.cart;

  useEffect(() => {
    const nextAmount = String(checkout.total);
    setMobileAmount(nextAmount);
    setCardAmount(nextAmount);
  }, [checkout.total]);

  useEffect(() => {
    setPaymentErrors({});
    setPaymentInfoSubmitted(false);
    setNotice('');
  }, [paymentMethod]);

  function validateMobileMoney() {
    const errors: PaymentErrors = {};
    const mobileDigits = normalizeDigits(mobileNumber);

    if (mobileDigits.length < 8) {
      errors.mobileNumber = 'Enter a valid dummy mobile money number.';
    }

    if (!amountMatches(mobileAmount, checkout.total)) {
      errors.mobileAmount = 'Amount must match the checkout total.';
    }

    if (!mobileReference.trim()) {
      errors.mobileReference = 'Dummy transaction reference is required.';
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validateCard() {
    const errors: PaymentErrors = {};
    const cardDigits = normalizeDigits(cardNumber);
    const cvvDigits = normalizeDigits(cvv);
    const expiryMatch = expiryDate.trim().match(/^(\d{2})\/(\d{2})$/);
    const expiryMonth = expiryMatch ? Number(expiryMatch[1]) : 0;

    if (!cardholderName.trim()) {
      errors.cardholderName = 'Cardholder name is required.';
    }

    if (cardDigits.length < 12 || cardDigits.length > 19) {
      errors.cardNumber = 'Enter a dummy card number between 12 and 19 digits.';
    }

    if (!expiryMatch || expiryMonth < 1 || expiryMonth > 12) {
      errors.expiryDate = 'Use MM/YY format.';
    }

    if (cvvDigits.length < 3 || cvvDigits.length > 4) {
      errors.cvv = 'Enter a dummy 3 or 4 digit CVV.';
    }

    if (!billingAddress.trim()) {
      errors.billingAddress = 'Billing address is required.';
    }

    if (!amountMatches(cardAmount, checkout.total)) {
      errors.cardAmount = 'Amount must match the checkout total.';
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function submitPaymentInformation() {
    const valid = paymentMethod === 'dummyMobileMoney' ? validateMobileMoney() : validateCard();
    setPaymentInfoSubmitted(valid);
    setNotice(valid ? 'Dummy payment information captured for this order.' : 'Fix the payment form before placing the order.');
    return valid;
  }

  async function handlePlaceOrder() {
    if (checkout.placingOrder) return;

    try {
      let amount = checkout.total;

      if (paymentMethod === 'dummyMobileMoney') {
        if (!submitPaymentInformation()) return;
        amount = readAmount(mobileAmount);
      }

      if (paymentMethod === 'dummyCard') {
        if (!submitPaymentInformation()) return;
        amount = readAmount(cardAmount);
      }

      const order = await checkout.placeOrder({
        paymentMethod,
        notes,
        amount,
        transactionReference: paymentMethod === 'dummyMobileMoney' ? mobileReference : paymentMethod === 'dummyCard' ? cardReference : undefined,
        mobileMoneyProvider: paymentMethod === 'dummyMobileMoney' ? mobileProvider : undefined,
        mobileNumber: paymentMethod === 'dummyMobileMoney' ? normalizeDigits(mobileNumber) : undefined,
        cardholderName: paymentMethod === 'dummyCard' ? cardholderName : undefined,
        cardLast4: paymentMethod === 'dummyCard' ? normalizeDigits(cardNumber).slice(-4) : undefined,
        billingAddress: paymentMethod === 'dummyCard' ? billingAddress : undefined,
      });
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
        customerName={checkout.defaultAddress?.recipientName ?? checkout.customerName}
        phone={checkout.defaultAddress?.phone ?? checkout.customerPhone}
        address={checkout.deliveryAddressText || 'Add a delivery address before checkout.'}
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
              imageUrl={item.imageUrl}
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
        {paymentMethod === 'cashOnDelivery' ? (
          <View style={styles.formCard}>
            <SectionHeader title="Cash on Delivery" subtitle="Pay when your order arrives" />
            <PaymentDetailRow label="Customer" value={checkout.customerName} />
            <PaymentDetailRow label="Phone" value={checkout.defaultAddress?.phone ?? checkout.customerPhone} />
            <PaymentDetailRow label="Delivery address" value={checkout.deliveryAddressText || 'Address pending'} />
            <PaymentDetailRow label="Order amount" value={formatCurrency(checkout.total)} />
            <PaymentDetailRow label="Instructions" value={notes || 'No delivery instructions'} />
          </View>
        ) : null}
        {paymentMethod === 'dummyMobileMoney' ? (
          <View style={styles.formCard}>
            <SectionHeader title="Dummy Mobile Money" subtitle="Submit details for manual approval" />
            <View style={styles.providerRow}>
              {mobileMoneyProviders.map((provider) => {
                const active = provider === mobileProvider;
                return (
                  <Pressable key={provider} accessibilityRole="button" onPress={() => setMobileProvider(provider)} style={[styles.providerButton, active && styles.providerButtonActive]}>
                    <AppText variant="caption" tone={active ? 'inverse' : 'primary'} align="center">{provider}</AppText>
                  </Pressable>
                );
              })}
            </View>
            <AppInput label="Mobile number" value={mobileNumber} onChangeText={(value) => { setMobileNumber(value); setPaymentInfoSubmitted(false); }} keyboardType="phone-pad" leftIcon="phone-portrait-outline" error={paymentErrors.mobileNumber} />
            <AppInput label="Amount" value={mobileAmount} onChangeText={(value) => { setMobileAmount(value); setPaymentInfoSubmitted(false); }} keyboardType="number-pad" leftIcon="cash-outline" error={paymentErrors.mobileAmount} helperText={`Must match ${formatCurrency(checkout.total)}`} />
            <AppInput label="Dummy transaction/reference number" value={mobileReference} onChangeText={(value) => { setMobileReference(value); setPaymentInfoSubmitted(false); }} leftIcon="receipt-outline" error={paymentErrors.mobileReference} />
            <AppButton label="Submit Payment Information" leftIcon="checkmark-circle-outline" variant="outline" onPress={submitPaymentInformation} />
            {paymentInfoSubmitted ? <AppBadge label="Mobile money details ready for checkout." tone="success" icon="checkmark-circle-outline" /> : null}
          </View>
        ) : null}
        {paymentMethod === 'dummyCard' ? (
          <View style={styles.formCard}>
            <SectionHeader title="Dummy Card Payment" subtitle="Safe demonstration form" />
            <AppBadge label="University demonstration only. Do not enter real card information." tone="warning" icon="warning-outline" />
            <AppInput label="Cardholder name" value={cardholderName} onChangeText={(value) => { setCardholderName(value); setPaymentInfoSubmitted(false); }} leftIcon="person-outline" error={paymentErrors.cardholderName} />
            <AppInput label="Dummy card number" value={cardNumber} onChangeText={(value) => { setCardNumber(value); setPaymentInfoSubmitted(false); }} keyboardType="number-pad" leftIcon="card-outline" error={paymentErrors.cardNumber} helperText="Only the last four digits are saved." />
            <View style={styles.inlineFields}>
              <View style={styles.inlineField}>
                <AppInput label="Expiry date" value={expiryDate} onChangeText={(value) => { setExpiryDate(value); setPaymentInfoSubmitted(false); }} placeholder="MM/YY" keyboardType="number-pad" leftIcon="calendar-outline" error={paymentErrors.expiryDate} />
              </View>
              <View style={styles.inlineField}>
                <AppInput label="Dummy CVV" value={cvv} onChangeText={(value) => { setCvv(value); setPaymentInfoSubmitted(false); }} keyboardType="number-pad" leftIcon="lock-closed-outline" error={paymentErrors.cvv} helperText="CVV is validated but never saved." />
              </View>
            </View>
            <AppInput label="Billing address" value={billingAddress} onChangeText={(value) => { setBillingAddress(value); setPaymentInfoSubmitted(false); }} leftIcon="home-outline" error={paymentErrors.billingAddress} />
            <AppInput label="Amount" value={cardAmount} onChangeText={(value) => { setCardAmount(value); setPaymentInfoSubmitted(false); }} keyboardType="number-pad" leftIcon="cash-outline" error={paymentErrors.cardAmount} helperText={`Must match ${formatCurrency(checkout.total)}`} />
            <AppInput label="Dummy reference" value={cardReference} onChangeText={(value) => { setCardReference(value); setPaymentInfoSubmitted(false); }} leftIcon="receipt-outline" />
            <AppButton label="Submit Payment Information" leftIcon="checkmark-circle-outline" variant="outline" onPress={submitPaymentInformation} />
            {paymentInfoSubmitted ? <AppBadge label={`Card details ready. Saving last four digits ${normalizeDigits(cardNumber).slice(-4)} only.`} tone="success" icon="checkmark-circle-outline" /> : null}
          </View>
        ) : null}
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
          disabled={!checkout.defaultAddress || checkout.placingOrder}
          onPress={() => void handlePlaceOrder()}
        />
      </View>

      {notice ? <AppBadge label={notice} tone={notice.includes('success') || notice.includes('captured') ? 'success' : 'info'} icon="information-circle-outline" /> : null}
      <AppBadge label="No real payment API, backend API, maps, GPS, or push notifications are used." tone="info" icon="shield-checkmark-outline" />
    </ScreenContainer>
  );
}

function PaymentDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <AppText tone="muted">{label}</AppText>
      <AppText variant="bodyStrong" align="right">{value}</AppText>
    </View>
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
  formCard: {
    backgroundColor: colors.neutral.canvas,
    borderColor: colors.neutral.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  providerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  providerButton: {
    backgroundColor: colors.neutral.surface,
    borderColor: colors.brand.primary,
    borderRadius: radius.md,
    borderWidth: 1,
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  providerButtonActive: {
    backgroundColor: colors.brand.primary,
  },
  inlineFields: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  inlineField: {
    flex: 1,
  },
  detailRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
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
