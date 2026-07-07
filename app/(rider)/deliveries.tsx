import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useRiderDeliveries } from '@/hooks/useRiderDeliveries';
import { formatCurrency } from '@/utils/formatCurrency';
import { mapOrderStatus } from '@/utils/firestoreAdapters';

export default function RiderDeliveriesScreen() {
  const deliveriesState = useRiderDeliveries();

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Assigned Deliveries" subtitle="Timeline/status workflow" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      {deliveriesState.loading ? <LoadingState title="Loading deliveries" message="Fetching assigned Firestore orders." /> : null}
      {deliveriesState.error ? <FriendlyErrorState title="Unable to load deliveries" message={deliveriesState.error} onRetry={deliveriesState.retry} /> : null}
      <View style={styles.section}>
        <SectionHeader title="Orders Assigned to Rider" subtitle="No map or GPS tracking" />
        {deliveriesState.data.length === 0 && !deliveriesState.loading ? <EmptyState title="No deliveries assigned" message="Restaurant or admin assignment will populate this list." icon="bicycle-outline" /> : null}
        {deliveriesState.data.map((order) => (
          <View key={order.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <AppBadge label={mapOrderStatus(order.status)} tone={order.status === 'delivered' ? 'success' : 'primary'} icon="receipt-outline" />
              <AppText variant="caption" tone="muted">{formatCurrency(order.total)}</AppText>
            </View>
            <AppText variant="bodyStrong">Order {order.id}</AppText>
            <AppText tone="muted">Items: {order.items.map((item) => item.name).join(', ')}</AppText>
            <AppText tone="muted">Delivery address: {order.deliveryAddressId}</AppText>
            <AppButton label="Update Delivery Status" variant="outline" leftIcon="time-outline" onPress={() => router.push({ pathname: '/(rider)/delivery-status', params: { orderId: order.id } } as unknown as Href)} />
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  section: { gap: spacing.md },
  card: { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, gap: spacing.md, padding: spacing.lg, ...shadows.soft },
  cardHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
});
