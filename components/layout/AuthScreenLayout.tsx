import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { colors, radius, shadows, spacing } from '@/constants/theme';

type AuthScreenLayoutProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  description: string;
  showBrandMark?: boolean;
}>;

export function AuthScreenLayout({
  eyebrow = 'YUMMY Restaurant',
  title,
  description,
  showBrandMark = true,
  children,
}: AuthScreenLayoutProps) {
  return (
    <ScreenContainer scroll centered={false} contentStyle={styles.screen}>
      <View style={styles.header}>
        {showBrandMark ? (
          <View style={styles.brandMark}>
            <AppIcon name="restaurant-outline" size={30} color={colors.neutral.surface} />
          </View>
        ) : null}
        <View style={styles.copy}>
          <AppText variant="caption" tone="primary" style={styles.eyebrow}>
            {eyebrow}
          </AppText>
          <AppText variant="title">{title}</AppText>
          <AppText tone="muted">{description}</AppText>
        </View>
      </View>
      <View style={styles.body}>{children}</View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing['2xl'],
    justifyContent: 'center',
  },
  header: {
    gap: spacing.lg,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: colors.brand.primary,
    borderRadius: radius.xl,
    height: 68,
    justifyContent: 'center',
    width: 68,
    ...shadows.card,
  },
  copy: {
    gap: spacing.sm,
  },
  eyebrow: {
    textTransform: 'uppercase',
  },
  body: {
    gap: spacing.lg,
  },
});