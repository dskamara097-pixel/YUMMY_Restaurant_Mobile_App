import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { spacing } from '@/constants/theme';

export default function ErrorPreviewScreen() {
  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Error States" subtitle="Reusable friendly errors" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      <View style={styles.section}>
        <SectionHeader title="Search Error" />
        <FriendlyErrorState title="Could not load results" message="Please check again. This is a reusable UI-only error state." onRetry={() => router.back()} />
      </View>
      <View style={styles.section}>
        <SectionHeader title="Order Error" />
        <FriendlyErrorState title="Order preview unavailable" message="We could not show this static preview right now." icon="receipt-outline" />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  section: { gap: spacing.md },
});
