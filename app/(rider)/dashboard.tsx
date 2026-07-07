import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

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
import { useRiderDeliveries } from '@/hooks/useRiderDeliveries';
import { formatCurrency } from '@/utils/formatCurrency';
import { mapOrderStatus } from '@/utils/firestoreAdapters';

export default function RiderDashboardScreen() {
  const deliveriesState = useRiderDeliveries();
  const activeDeliveries = deliveriesState.data.filter((order) => order.status !== 'delivered' && order.status !== 'cancelled');
  const completedDeliveries = deliveriesState.data.filter((order) => order.status === 'delivered');

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Rider Dashboard" subtitle="Assigned deliveries only" rightIcon="bicycle-outline" />
      <View style={styles.heroCard}>
        <View style={styles.heroIcon}><AppIcon name="navigate-outline" color={colors.neutral.surface} size={30} /></View>
        <View style={styles.heroCopy}>
          <AppText variant="title">Delivery Timeline Workbench</AppText>
          <AppText tone="muted">Riders manage assigned order statuses only. No GPS, Google Maps, or live tracking map is used.</AppText>
        </View>
      </View>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}><AppText variant="caption" tone="muted">Active</AppText><AppText variant="title">{activeDeliveries.length}</AppText></View>
        <View style={styles.statCard}><AppText variant="caption" tone="muted">Completed</AppText><AppText variant="title">{completedDeliveries.length}</AppText></View>
        <View style={styles.statCard}><AppText variant="caption" tone="muted">Value</AppText><AppText variant="title">{formatCurrency(deliveriesState.data.reduce((sum, order) => sum + order.total, 0))}</AppText></View>
      </View>
      {deliveriesState.loading ? <LoadingState title="Loading deliveries" /> : null}
      {deliveriesState.error ? <FriendlyErrorState title="Deliveries unavailable" message={deliveriesState.error} onRetry={deliveriesState.retry} /> : null}
      <View style={styles.section}>
        <SectionHeader title="Next Deliveries" subtitle="Firestore assigned orders" />
        {activeDeliveries.length === 0 && !deliveriesState.loading ? <EmptyState title="No assigned deliveries" message="Assigned rider orders will appear here." icon="bicycle-outline" /> : null}
        {activeDeliveries.slice(0, 3).map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <AppBadge label={mapOrderStatus(order.status)} tone="primary" icon="receipt-outline" />
            <AppText variant="bodyStrong">Order {order.id}</AppText>
            <AppText tone="muted">{order.items.map((item) => item.name).join(', ')}</AppText>
            <AppButton label="Update Status" variant="outline" leftIcon="time-outline" onPress={() => router.push({ pathname: '/(rider)/delivery-status', params: { orderId: order.id } } as unknown as Href)} />
          </View>
        ))}
      </View>
      <AppButton label="View Assigned Deliveries" rightIcon="chevron-forward" onPress={() => router.push('/(rider)/deliveries' as Href)} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  heroCard: { alignItems: 'center', backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, flexDirection: 'row', gap: spacing.md, padding: spacing.lg, ...shadows.soft },
  heroIcon: { alignItems: 'center', backgroundColor: colors.brand.primary, borderRadius: radius.lg, height: 58, justifyContent: 'center', width: 58 },
  heroCopy: { flex: 1, gap: spacing.xs },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  statCard: { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, flex: 1, gap: spacing.xs, minWidth: 110, padding: spacing.lg, ...shadows.soft },
  section: { gap: spacing.md },
  orderCard: { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, gap: spacing.md, padding: spacing.lg, ...shadows.soft },
});
