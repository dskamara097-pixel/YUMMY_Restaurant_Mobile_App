import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { NotificationCard } from '@/components/profile/NotificationCard';
import { spacing } from '@/constants/theme';
import { useNotifications } from '@/hooks/useNotifications';
import { mapNotificationModel } from '@/utils/firestoreAdapters';

function openNotificationTarget(orderId?: string) { if (orderId) router.push({ pathname: '/(customer)/tracking/[orderId]', params: { orderId } } as unknown as Href); }

export default function NotificationsScreen() {
  const notificationsState = useNotifications();
  const notifications = notificationsState.data.map(mapNotificationModel);

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Notifications" subtitle="Customer updates" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      {notificationsState.loading ? <LoadingState title="Loading notifications" message="Fetching notification documents from Firestore." /> : null}
      {notificationsState.error ? <FriendlyErrorState title="Unable to load notifications" message={notificationsState.error} onRetry={notificationsState.retry} /> : null}
      {!notificationsState.loading && !notificationsState.error && notifications.length === 0 ? <EmptyState title="No notifications" message="Payment, order, and system notification documents will appear here." icon="notifications-outline" /> : null}
      {notifications.length > 0 ? <View style={styles.section}><SectionHeader title="Recent Notifications" subtitle="Tap order updates to view tracking" /><View style={styles.list}>{notifications.map((notification) => <NotificationCard key={notification.id} title={notification.title} message={notification.message} time={notification.time} type={notification.type} read={notification.read} onPress={() => openNotificationTarget(notification.orderId)} />)}</View></View> : null}
      <AppBadge label="Firestore notification documents only. Push notifications are not implemented." tone="info" icon="information-circle-outline" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] }, section: { gap: spacing.md }, list: { gap: spacing.md } });
