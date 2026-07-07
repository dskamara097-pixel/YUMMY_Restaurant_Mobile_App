import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { spacing } from '@/constants/theme';

type PlaceholderScreenProps = PropsWithChildren<{
  title: string;
  description: string;
}>;

export function PlaceholderScreen({
  title,
  description,
  children,
}: PlaceholderScreenProps) {
  return (
    <ScreenContainer>
      <View style={styles.content}>
        <AppText variant="caption" tone="primary" style={styles.eyebrow}>
          Phase 3 Foundation
        </AppText>
        <AppText variant="title">{title}</AppText>
        <AppText tone="muted">{description}</AppText>
        {children ? <View style={styles.children}>{children}</View> : null}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  eyebrow: {
    textTransform: 'uppercase',
  },
  children: {
    marginTop: spacing.xl,
  },
});