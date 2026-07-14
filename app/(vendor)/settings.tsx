import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { VendorBottomNavigation } from '@/components/vendor/VendorBottomNavigation';
import { VendorActionCard } from '@/components/vendor/VendorCards';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useVendorRestaurant } from '@/hooks/useVendorRestaurant';

export default function VendorSettingsScreen() {
  const auth = useAuth();
  const restaurantState = useVendorRestaurant();

  async function handleLogout() {
    await auth.logout();
    router.replace('/(vendor)/login' as Href);
  }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Vendor Settings" subtitle="Restaurant owner preferences" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      <View style={styles.panel}>
        <SectionHeader title="Account" subtitle={auth.email ?? 'Vendor account'} />
        <AppBadge label={auth.emailVerified ? 'Email verified' : 'Email verification pending'} tone={auth.emailVerified ? 'success' : 'warning'} icon="mail-outline" />
        <AppText tone="muted">Vendor users can manage only the restaurant document connected to their Firebase Auth user id.</AppText>
      </View>
      <View style={styles.section}>
        <SectionHeader title="Settings" />
        <VendorActionCard title="Restaurant Profile" subtitle={restaurantState.data?.name ?? 'Create or edit restaurant profile'} icon="storefront-outline" onPress={() => router.push('/(vendor)/profile' as Href)} />
        <VendorActionCard title="Menu Management" subtitle="Food items and categories" icon="fast-food-outline" onPress={() => router.push('/(vendor)/menu' as Href)} />
        <VendorActionCard title="Order Management" subtitle="Status timeline only, no GPS map" icon="receipt-outline" onPress={() => router.push('/(vendor)/orders' as Href)} />
        <VendorActionCard title="Notifications" subtitle="Vendor notification center" icon="notifications-outline" onPress={() => router.push('/(vendor)/notifications' as Href)} />
        <VendorActionCard title="Reviews" subtitle="View and reply to customer reviews" icon="star-outline" onPress={() => router.push('/(vendor)/reviews' as Href)} />
      </View>
      <View style={styles.panel}><SectionHeader title="Phase 7 Boundaries" /><AppBadge label="No super-admin panel" tone="info" icon="shield-outline" /><AppBadge label="No payment gateway" tone="info" icon="card-outline" /><AppBadge label="No GPS, Google Maps, or live tracking" tone="info" icon="location-outline" /><AppBadge label="No push notifications" tone="info" icon="notifications-outline" /></View>
      <AppButton label="Logout" variant="danger" leftIcon="log-out-outline" loading={auth.loading} onPress={handleLogout} />
      <VendorBottomNavigation active="settings" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] }, section: { gap: spacing.md }, panel: { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, gap: spacing.md, padding: spacing.lg, ...shadows.soft } });
