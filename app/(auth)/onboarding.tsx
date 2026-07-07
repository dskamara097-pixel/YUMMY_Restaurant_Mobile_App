import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { colors, radius, shadows, spacing } from '@/constants/theme';

const highlights = [
  {
    icon: 'restaurant-outline' as const,
    title: 'Order fresh meals',
    message: 'Browse YUMMY favorites, compare categories, and choose exactly what you want.',
  },
  {
    icon: 'bicycle-outline' as const,
    title: 'Fast delivery flow',
    message: 'Checkout captures your phone and address so every order is easy to track.',
  },
  {
    icon: 'card-outline' as const,
    title: 'Simple dummy payment',
    message: 'Mobile Money and card simulations will support the assignment payment flow later.',
  },
];

export default function OnboardingScreen() {
  return (
    <ScreenContainer scroll centered={false} contentStyle={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.brandMark}>
          <AppIcon name="fast-food-outline" size={38} color={colors.neutral.surface} />
        </View>
        <View style={styles.copy}>
          <AppText variant="display">Food ordering, made YUMMY.</AppText>
          <AppText tone="muted">
            A polished mobile restaurant experience for browsing meals, placing orders, and tracking every step.
          </AppText>
        </View>
      </View>

      <View style={styles.list}>
        {highlights.map((item) => (
          <View key={item.title} style={styles.highlight}>
            <View style={styles.highlightIcon}>
              <AppIcon name={item.icon} size={24} color={colors.brand.primary} />
            </View>
            <View style={styles.highlightCopy}>
              <AppText variant="label">{item.title}</AppText>
              <AppText variant="caption" tone="muted">{item.message}</AppText>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Link href="/(auth)/welcome" asChild>
          <AppButton label="Get Started" rightIcon="chevron-forward" />
        </Link>
        <Link href="/(auth)/login" asChild>
          <AppButton label="I already have an account" variant="ghost" />
        </Link>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing['2xl'],
    justifyContent: 'center',
  },
  hero: {
    gap: spacing.xl,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: colors.brand.primary,
    borderRadius: radius.xl,
    height: 82,
    justifyContent: 'center',
    width: 82,
    ...shadows.card,
  },
  copy: {
    gap: spacing.md,
  },
  list: {
    gap: spacing.md,
  },
  highlight: {
    alignItems: 'center',
    backgroundColor: colors.neutral.surface,
    borderColor: colors.neutral.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    ...shadows.soft,
  },
  highlightIcon: {
    alignItems: 'center',
    backgroundColor: colors.brand.primarySoft,
    borderRadius: radius.pill,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  highlightCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  actions: {
    gap: spacing.md,
  },
});
