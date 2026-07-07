import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { CustomerBottomNavigation } from '@/components/layout/CustomerBottomNavigation';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { AccountOptionRow } from '@/components/profile/AccountOptionRow';
import { ProfileInfoCard } from '@/components/profile/ProfileInfoCard';
import { spacing } from '@/constants/theme';
import { useAddresses } from '@/hooks/useAddresses';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { useOrders } from '@/hooks/useOrders';
import { useUserProfile } from '@/hooks/useUserProfile';
import { mapUserProfile } from '@/utils/firestoreAdapters';

export default function ProfileScreen() {
  const auth = useAuth();
  const profileState = useUserProfile();
  const addressesState = useAddresses();
  const ordersState = useOrders();
  const notificationsState = useNotifications();
  const defaultAddress = addressesState.data.find((address) => address.isDefault) ?? addressesState.data[0];
  const profile = mapUserProfile(profileState.data, { displayName: auth.displayName, email: auth.email });
  const addressText = defaultAddress ? [defaultAddress.addressLine, defaultAddress.city, defaultAddress.country].filter(Boolean).join(', ') : 'Address pending';

  async function handleVerifyEmail() { try { await auth.verifyEmail(); } catch {} }
  async function handleRefreshUser() { try { await auth.refreshUser(); } catch {} }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Profile" subtitle="Account and support" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      <ProfileInfoCard fullName={profile.fullName} phone={profile.phone} email={profile.email} address={addressText} onEditPress={() => router.push('/(customer)/edit-profile' as Href)} />
      {profileState.error ? <AppBadge label={profileState.error} tone="danger" icon="alert-circle-outline" /> : null}
      {auth.isAuthenticated ? <View style={styles.authPanel}><AppBadge label={auth.emailVerified ? 'Email verified' : 'Email verification required'} tone={auth.emailVerified ? 'success' : 'warning'} icon={auth.emailVerified ? 'shield-checkmark-outline' : 'mail-unread-outline'} />{auth.emailVerified ? null : <View style={styles.inlineActions}><AppButton label="Send Verification" size="sm" loading={auth.loading} onPress={handleVerifyEmail} /><AppButton label="Refresh" size="sm" variant="outline" disabled={auth.loading} onPress={handleRefreshUser} /></View>}</View> : <AppBadge label="Sign in to load private Firestore profile data." tone="warning" icon="warning-outline" />}
      {auth.error ? <AppBadge label={auth.error} tone="danger" icon="alert-circle-outline" /> : null}
      <View style={styles.section}><SectionHeader title="Account Options" subtitle="Customer account shortcuts" /><View style={styles.list}>
        <AccountOptionRow title="Edit Profile" subtitle="Update Auth and Firestore profile data" icon="create-outline" onPress={() => router.push('/(customer)/edit-profile' as Href)} />
        <AccountOptionRow title="Order History" subtitle="View previous orders" icon="receipt-outline" badge={`${ordersState.data.length}`} onPress={() => router.push('/(customer)/orders' as Href)} />
        <AccountOptionRow title="Saved Addresses" subtitle="Manage delivery locations" icon="location-outline" badge={`${addressesState.data.length}`} onPress={() => router.push('/(customer)/addresses' as Href)} />
        <AccountOptionRow title="Notifications" subtitle="Payment and order updates" icon="notifications-outline" badge={`${notificationsState.data.length}`} onPress={() => router.push('/(customer)/notifications' as Href)} />
        <AccountOptionRow title="Settings" subtitle="Preferences, logout, and account security" icon="settings-outline" onPress={() => router.push('/(customer)/settings' as Href)} />
        <AccountOptionRow title="Help & Support" subtitle="FAQ, call, and chat support" icon="help-circle-outline" onPress={() => router.push('/(customer)/support' as Href)} />
        <AccountOptionRow title="Coupons" subtitle="Available discounts" icon="pricetag-outline" onPress={() => router.push('/(customer)/coupons' as Href)} />
        <AccountOptionRow title="Offers" subtitle="Daily deals and campaigns" icon="gift-outline" onPress={() => router.push('/(customer)/offers' as Href)} />
        <AccountOptionRow title="Recently Viewed" subtitle="Restaurants and meals you opened" icon="time-outline" onPress={() => router.push('/(customer)/recently-viewed' as Href)} />
        <AccountOptionRow title="Recommended" subtitle="Suggested restaurants and meals" icon="sparkles-outline" onPress={() => router.push('/(customer)/recommended' as Href)} />
        <AccountOptionRow title="Loading States" subtitle="Skeleton previews" icon="hourglass-outline" onPress={() => router.push('/(customer)/loading-preview' as Href)} />
        <AccountOptionRow title="Error States" subtitle="Friendly retry UI" icon="alert-circle-outline" onPress={() => router.push('/(customer)/error-preview' as Href)} />
      </View></View>
      <AppBadge label="Profile reads from Firestore users and addresses collections." tone="info" icon="information-circle-outline" />
      <CustomerBottomNavigation active="profile" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] }, authPanel: { gap: spacing.md }, inlineActions: { flexDirection: 'row', gap: spacing.md }, section: { gap: spacing.md }, list: { gap: spacing.md } });
