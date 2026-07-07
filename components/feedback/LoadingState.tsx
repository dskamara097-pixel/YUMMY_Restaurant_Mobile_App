import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { colors, spacing } from '@/constants/theme';

type LoadingStateProps = {
  title?: string;
  message?: string;
};

export function LoadingState({ title = 'Loading', message }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.brand.primary} />
      <View style={styles.copy}>
        <AppText variant="sectionTitle" align="center">{title}</AppText>
        {message ? <AppText tone="muted" align="center">{message}</AppText> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.lg,
    justifyContent: 'center',
    padding: spacing['2xl'],
  },
  copy: {
    gap: spacing.sm,
  },
});