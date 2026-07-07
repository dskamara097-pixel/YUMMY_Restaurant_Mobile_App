import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { spacing } from '@/constants/theme';
import { sampleSearchSortOptions } from '@/data/sampleData';

export default function SearchSortingScreen() {
  const [selected, setSelected] = useState(sampleSearchSortOptions[0]);

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Sort Results" subtitle="Search sorting options" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      <View style={styles.section}>
        <SectionHeader title="Sort By" />
        <View style={styles.list}>
          {sampleSearchSortOptions.map((option) => (
            <Pressable key={option} onPress={() => setSelected(option)}>
              <AppBadge label={option} tone={selected === option ? 'primary' : 'neutral'} icon={selected === option ? 'checkmark-circle-outline' : 'swap-vertical-outline'} />
            </Pressable>
          ))}
        </View>
      </View>
      <AppButton label="Apply Sorting" leftIcon="swap-vertical-outline" onPress={() => router.back()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  section: { gap: spacing.md },
  list: { gap: spacing.md },
});
