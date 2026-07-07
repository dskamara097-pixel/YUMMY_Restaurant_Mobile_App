import type { Href } from 'expo-router';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppDivider } from '@/components/common/AppDivider';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { RatingBadge } from '@/components/food/RatingBadge';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { TrackingTimeline } from '@/components/profile/TrackingTimeline';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useAddresses } from '@/hooks/useAddresses';
import { useRealtimeOrder } from '@/hooks/useRealtimeOrder';
import { mapOrderStatus } from '@/utils/firestoreAdapters';

const trackingSteps = [
  { label: 'Order Confirmed', description: 'Your restaurant has received the order.' },
  { label: 'Payment Received', description: 'Payment status has been approved for preparation.' },
  { label: 'Preparing', description: 'The kitchen is preparing your meal.' },
  { label: 'Ready', description: 'Your order is ready for delivery handoff.' },
  { label: 'Delivered', description: 'Your order has reached the delivery address.' },
];

const riderPreview = {
  name: 'YUMMY Rider',
  vehicle: 'Delivery rider assignment pending',
  rating: 4.8,
};

function getCurrentTimelineLabel(status?: string) {
  if (status === 'paymentReceived') return 'Payment Received';
  if (status === 'preparing') return 'Preparing';
  if (status === 'ready') return 'Ready';
  if (status === 'delivered') return 'Delivered';
  return 'Order Confirmed';
}

function getStepState(stepLabel: string, currentStatus: string) {
  const order = ['Order Confirmed', 'Payment Received', 'Preparing', 'Ready', 'Delivered'];
  const stepIndex = order.indexOf(stepLabel);
  const currentIndex = order.indexOf(currentStatus);
  return {
    completed: currentIndex >= stepIndex,
    active: currentIndex === stepIndex,
  };
}

export default function OrderTrackingScreen() {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const orderState = useRealtimeOrder(orderId);
  const addressesState = useAddresses();
  const order = orderState.data;
  const deliveryAddress = addressesState.data.find((address) => address.id === order?.deliveryAddressId);
  const deliveryAddressText = deliveryAddress
    ? [deliveryAddress.addressLine, deliveryAddress.city, deliveryAddress.country].filter(Boolean).join(', ')
    : order?.deliveryAddressId ?? 'Delivery address pending';
  const currentTimelineLabel = getCurrentTimelineLabel(order?.status);
  const timelineSteps = trackingSteps.map((step) => ({
    ...step,
    ...getStepState(step.label, currentTimelineLabel),
  }));

  if (orderState.loading) {
    return (
      <ScreenContainer contentStyle={styles.centeredScreen}>
        <LoadingState title="Loading order" message="Listening for realtime Firestore order timeline updates." />
      </ScreenContainer>
    );
  }

  if (orderState.error) {
    return (
      <ScreenContainer contentStyle={styles.centeredScreen}>
        <FriendlyErrorState title="Order unavailable" message={orderState.error} />
      </ScreenContainer>
    );
  }

  if (!order) {
    return (
      <ScreenContainer contentStyle={styles.centeredScreen}>
        <EmptyState title="Order not found" message="This Firestore order could not be found." icon="receipt-outline" actionLabel="Back to Orders" onActionPress={() => router.replace('/(customer)/orders' as Href)} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Order Tracking" subtitle="Realtime timeline only, no GPS map" leftIcon="arrow-back" onLeftPress={() => router.back()} />

      <View style={styles.summaryCard}>
        <AppBadge label={`Order ${order.id}`} tone="primary" icon="receipt-outline" />
        <AppText variant="title">{mapOrderStatus(order.status)}</AppText>
        <AppText tone="muted">Estimated delivery time: 25-40 min</AppText>
      </View>

      <View style={styles.sectionCard}>
        <SectionHeader title="Delivery Progress" subtitle="Approved professional timeline design" />
        <TrackingTimeline steps={timelineSteps} />
      </View>

      <View style={styles.sectionCard}>
        <SectionHeader title="Rider Profile" subtitle="UI placeholder only" />
        <View style={styles.riderRow}>
          <ProfileAvatar name={riderPreview.name} size={64} />
          <View style={styles.riderCopy}>
            <AppText variant="bodyStrong">{riderPreview.name}</AppText>
            <AppText tone="muted">{riderPreview.vehicle}</AppText>
            <RatingBadge rating={riderPreview.rating} />
          </View>
        </View>
        <View style={styles.actionRow}>
          <AppButton label="Call Rider" variant="outline" fullWidth={false} leftIcon="call-outline" />
          <AppButton label="Chat Rider" variant="ghost" fullWidth={false} leftIcon="chatbubble-ellipses-outline" />
        </View>
      </View>

      <View style={styles.sectionCard}>
        <SectionHeader title="Delivery Address" />
        <View style={styles.addressRow}>
          <AppIcon name="location-outline" color={colors.brand.primary} />
          <AppText tone="muted" style={styles.flexText}>{deliveryAddressText}</AppText>
        </View>
      </View>

      <View style={styles.helpCard}>
        <SectionHeader title="Need Help?" subtitle="Support actions are UI only" />
        <AppDivider inset />
        <View style={styles.actionRow}>
          <AppButton label="Contact Support" variant="outline" fullWidth={false} leftIcon="help-circle-outline" onPress={() => router.push('/(customer)/support' as Href)} />
          <AppButton label="Order Help" variant="ghost" fullWidth={false} leftIcon="information-circle-outline" />
        </View>
      </View>

      <AppBadge label="No Google Maps, GPS, or live map tracking is used." tone="info" icon="checkmark-circle-outline" />
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
  summaryCard: {
    backgroundColor: colors.brand.primary,
    borderRadius: radius.xl,
    gap: spacing.sm,
    padding: spacing.xl,
    ...shadows.card,
  },
  sectionCard: {
    backgroundColor: colors.neutral.surface,
    borderColor: colors.neutral.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.lg,
    ...shadows.soft,
  },
  riderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  riderCopy: {
    flex: 1,
    gap: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  addressRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
  flexText: {
    flex: 1,
  },
  helpCard: {
    backgroundColor: colors.semantic.infoSoft,
    borderRadius: radius.lg,
    gap: spacing.md,
    padding: spacing.lg,
  },
});

