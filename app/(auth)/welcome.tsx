import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { colors, radius, shadows, spacing } from '@/constants/theme';

export default function WelcomeScreen() {
  return (
    <ScreenContainer contentStyle={styles.screen}>
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <AppIcon name="restaurant-outline" size={42} color={colors.neutral.surface} />
        </View>
        <AppBadge label="Customer access" tone="primary" icon="person-outline" />
        <View style={styles.copy}>
          <AppText variant="title" align="center">Welcome to YUMMY</AppText>
          <AppText tone="muted" align="center">
            Sign in or create your customer account to continue. Admin access is intentionally not included in this phase.
          </AppText>
        </View>
        <View style={styles.actions}>
          <Link href="/(auth)/login" asChild>
            <AppButton label="Login" leftIcon="person-outline" />
          </Link>
          <Link href="/(auth)/register" asChild>
            <AppButton label="Create Account" variant="outline" leftIcon="add" />
          </Link>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.neutral.surface,
    borderColor: colors.neutral.line,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.xl,
    padding: spacing.xl,
    ...shadows.card,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: colors.brand.primary,
    borderRadius: radius.xl,
    height: 86,
    justifyContent: 'center',
    width: 86,
  },
  copy: {
    gap: spacing.sm,
  },
  actions: {
    alignSelf: 'stretch',
    gap: spacing.md,
  },
});
