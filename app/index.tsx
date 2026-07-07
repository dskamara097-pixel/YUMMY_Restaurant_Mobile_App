import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { colors, radius, shadows, spacing } from '@/constants/theme';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/onboarding');
    }, 1400);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ScreenContainer backgroundColor={colors.brand.primary} contentStyle={styles.screen}>
      <View style={styles.logoWrap}>
        <View style={styles.logoMark}>
          <AppIcon name="restaurant-outline" size={44} color={colors.brand.primary} />
        </View>
        <View style={styles.copy}>
          <AppText variant="display" tone="inverse" align="center">
            YUMMY
          </AppText>
          <AppText tone="inverse" align="center">
            Fresh meals, fast delivery, simple ordering.
          </AppText>
        </View>
      </View>
      <AppText variant="caption" tone="inverse" align="center">
        Restaurant Mobile Application
      </AppText>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing['4xl'],
  },
  logoWrap: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xl,
    justifyContent: 'center',
  },
  logoMark: {
    alignItems: 'center',
    backgroundColor: colors.neutral.surface,
    borderRadius: radius.xl,
    height: 96,
    justifyContent: 'center',
    width: 96,
    ...shadows.floating,
  },
  copy: {
    gap: spacing.sm,
    maxWidth: 300,
  },
});
