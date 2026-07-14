import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { VendorBottomNavigation } from '@/components/vendor/VendorBottomNavigation';
import { VendorEntityCard, VendorStatCard } from '@/components/vendor/VendorCards';
import { spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useVendorNotifications } from '@/hooks/useVendorEngagement';

export default function VendorNotificationsScreen() {
  const auth = useAuth();
  const notificationsState = useVendorNotifications(auth.userId ?? undefined);
  const unreadCount = notificationsState.data.filter((notification) => !notification.read).length;

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Vendor Notifications" subtitle="Orders, payments, reviews, stock" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      {notificationsState.loading ? <LoadingState title="Loading notifications" /> : null}
      {notificationsState.error ? <FriendlyErrorState title="Notifications unavailable" message={notificationsState.error} onRetry={notificationsState.retry} /> : null}
      <View style={styles.statsGrid}>
        <VendorStatCard label="Unread" value={`${unreadCount}`} icon="notifications-outline" tone="warning" />
        <VendorStatCard label="Total" value={`${notificationsState.data.length}`} icon="mail-outline" />
      </View>
      {!notificationsState.loading && notificationsState.data.length === 0 ? <EmptyState title="No notifications" message="New orders, payment updates, reviews, and stock notices will appear here." icon="notifications-outline" /> : null}
      <View style={styles.section}><SectionHeader title="Notification Center" />{notificationsState.data.map((notification) => <VendorEntityCard key={notification.id} title={notification.title} subtitle={notification.message} meta={`${notification.type} - ${notification.createdAt}`} badge={notification.read ? 'Read' : 'Unread'} badgeTone={notification.read ? 'success' : 'warning'} primaryActionLabel="Mark Read" onPrimaryAction={() => notificationsState.markRead(notification.id)} />)}</View>
      <VendorBottomNavigation active="settings" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  section: { gap: spacing.md },
});
