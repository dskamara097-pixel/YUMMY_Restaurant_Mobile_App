import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { colors, radius, spacing } from '@/constants/theme';

type ErrorStateProps = {
  title?: string;
  message: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function ErrorState({
  title = 'Something went wrong',
  message,
  actionLabel = 'Try again',
  onActionPress,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <AppIcon name="alert-circle-outline" size={32} color={colors.semantic.danger} />
      </View>
      <View style={styles.copy}>
        <AppText variant="sectionTitle" align="center">{title}</AppText>
        <AppText tone="muted" align="center">{message}</AppText>
      </View>
      {onActionPress ? <AppButton label={actionLabel} onPress={onActionPress} variant="outline" /> : null}
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
  iconWrap: {
    alignItems: 'center',
    backgroundColor: colors.semantic.dangerSoft,
    borderRadius: radius.pill,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  copy: {
    gap: spacing.sm,
  },
});