import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { spacing } from '@/constants/theme';
import { sampleSearchFilters } from '@/data/sampleData';

export default function SearchFiltersScreen() {
  const [selected, setSelected] = useState<Record<string, string>>({});

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Search Filters" subtitle="Cuisine, price, distance and more" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      {sampleSearchFilters.map((filter) => (
        <View key={filter.id} style={styles.section}>
          <SectionHeader title={filter.label} />
          <View style={styles.chipRow}>
            {filter.values.map((value) => (
              <Pressable key={value} onPress={() => setSelected((current) => ({ ...current, [filter.id]: value }))}>
                <AppBadge label={value} tone={selected[filter.id] === value ? 'primary' : 'neutral'} icon="options-outline" />
              </Pressable>
            ))}
          </View>
        </View>
      ))}
      <AppButton label="Apply Filters" leftIcon="funnel-outline" onPress={() => router.back()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  section: { gap: spacing.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
