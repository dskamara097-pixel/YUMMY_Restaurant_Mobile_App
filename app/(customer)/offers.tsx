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
import { useOffers } from '@/hooks/useOffers';
import { mapOfferModel } from '@/utils/firestoreAdapters';

export default function OffersScreen() {
  const offersState = useOffers();
  const offers = offersState.data.map(mapOfferModel);
  const featured = offers.filter((offer) => offer.featured);

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Offers" subtitle="Deals and campaigns" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      {offersState.loading ? <LoadingState title="Loading offers" message="Fetching campaigns from Firestore." /> : null}
      {offersState.error ? <FriendlyErrorState title="Unable to load offers" message={offersState.error} onRetry={offersState.retry} /> : null}
      {!offersState.loading && !offersState.error && offers.length === 0 ? <EmptyState title="No offers today" message="Limited Firestore offers and campaigns will appear here." icon="gift-outline" /> : null}
      <View style={styles.campaignCard}><AppBadge label="Featured campaign" tone="warning" icon="megaphone-outline" /><AppText variant="title" tone="inverse">YUMMY Deal Week</AppText><AppText tone="inverse">Daily deals, restaurant promotions, and campaign cards from Firestore.</AppText></View>
      <SectionHeader title="Daily Deals" />
      <View style={styles.list}>{offers.map((offer) => <OfferCard key={offer.id} {...offer} />)}</View>
      <SectionHeader title="Featured Campaigns" />
      <View style={styles.list}>{featured.map((offer) => <OfferCard key={`featured-${offer.id}`} {...offer} />)}</View>
    </ScreenContainer>
  );
}

function OfferCard({ title, description, badgeLabel, restaurantName, expiryDate }: { title: string; description: string; badgeLabel: string; restaurantName?: string; expiryDate: string }) {
  return <View style={styles.offerCard}><AppBadge label={badgeLabel} tone="primary" icon="gift-outline" /><AppText variant="sectionTitle">{title}</AppText><AppText tone="muted">{description}</AppText><View style={styles.metaRow}>{restaurantName ? <AppBadge label={restaurantName} icon="storefront-outline" /> : null}<AppBadge label={expiryDate} tone="warning" icon="time-outline" /></View><AppButton label="View Offer" variant="outline" leftIcon="eye-outline" /></View>;
}

const styles = StyleSheet.create({ screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] }, campaignCard: { backgroundColor: colors.brand.primary, borderRadius: radius.xl, gap: spacing.sm, padding: spacing.xl, ...shadows.card }, list: { gap: spacing.md }, offerCard: { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, gap: spacing.md, padding: spacing.lg, ...shadows.soft }, metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm } });
