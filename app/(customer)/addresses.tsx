import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { AddressCard } from '@/components/profile/AddressCard';
import { spacing } from '@/constants/theme';
import { useAddresses } from '@/hooks/useAddresses';
import { mapAddressModel } from '@/utils/firestoreAdapters';

export default function SavedAddressesScreen() {
  const addressesState = useAddresses();
  const [notice, setNotice] = useState('');
  const addresses = addressesState.data.map(mapAddressModel);

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Saved Addresses" subtitle="Delivery locations" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      {addressesState.loading ? <LoadingState title="Loading addresses" message="Fetching delivery addresses from Firestore." /> : null}
      {addressesState.error ? <FriendlyErrorState title="Unable to load addresses" message={addressesState.error} onRetry={addressesState.retry} /> : null}
      {!addressesState.loading && !addressesState.error && addresses.length === 0 ? <EmptyState title="No saved addresses" message="Firestore addresses for your account will appear here." icon="location-outline" /> : null}
      <View style={styles.section}><SectionHeader title="Address List" subtitle="Firestore saved addresses" /><View style={styles.list}>{addresses.map((address) => <AddressCard key={address.id} label={address.label} recipient={address.recipient} phone={address.phone} address={address.address} isDefault={address.isDefault} onEditPress={() => setNotice('Address editing will be completed in a later Firestore write workflow.')} onDeletePress={() => setNotice('Address deletion will be completed in a later Firestore write workflow.')} />)}</View></View>
      <AppButton label="Add New Address" leftIcon="add-circle-outline" onPress={() => setNotice('Address creation UI will be connected in a later write workflow.')} />
      {notice ? <AppBadge label={notice} tone="info" icon="information-circle-outline" /> : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] }, section: { gap: spacing.md }, list: { gap: spacing.md } });
