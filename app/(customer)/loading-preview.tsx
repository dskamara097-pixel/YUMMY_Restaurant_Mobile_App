import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { spacing } from '@/constants/theme';

export default function LoadingPreviewScreen() {
  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Loading States" subtitle="Reusable skeleton previews" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      <View style={styles.section}><SectionHeader title="Restaurant Cards" /><LoadingSkeleton variant="restaurant" count={2} /></View>
      <View style={styles.section}><SectionHeader title="Food Cards" /><LoadingSkeleton variant="food" count={2} /></View>
      <View style={styles.section}><SectionHeader title="Profile" /><LoadingSkeleton variant="profile" count={1} /></View>
      <View style={styles.section}><SectionHeader title="Orders" /><LoadingSkeleton variant="orders" count={2} /></View>
      <View style={styles.section}><SectionHeader title="Search" /><LoadingSkeleton variant="search" count={2} /></View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  section: { gap: spacing.md },
});
