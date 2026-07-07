import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { AppIconName, colors, radius, spacing } from '@/constants/theme';

type FriendlyErrorStateProps = {
  title: string;
  message: string;
  icon?: AppIconName;
  retryLabel?: string;
  onRetry?: () => void;
};

export function FriendlyErrorState({ title, message, icon = 'alert-circle-outline', retryLabel = 'Try Again', onRetry }: FriendlyErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <AppIcon name={icon} size={32} color={colors.semantic.danger} />
      </View>
      <View style={styles.copy}>
        <AppText variant="sectionTitle" align="center">{title}</AppText>
        <AppText tone="muted" align="center">{message}</AppText>
      </View>
      {onRetry ? <AppButton label={retryLabel} variant="outline" leftIcon="refresh-outline" onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.semantic.dangerSoft,
    borderRadius: radius.lg,
    gap: spacing.lg,
    padding: spacing.xl,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: colors.neutral.surface,
    borderRadius: radius.pill,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  copy: {
    gap: spacing.sm,
  },
});
