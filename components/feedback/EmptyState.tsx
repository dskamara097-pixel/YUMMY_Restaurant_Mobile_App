import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { AppIconName, colors, radius, spacing } from '@/constants/theme';

type EmptyStateProps = {
  title: string;
  message: string;
  icon?: AppIconName;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function EmptyState({
  title,
  message,
  icon = 'restaurant-outline',
  actionLabel,
  onActionPress,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <AppIcon name={icon} size={30} color={colors.brand.primary} />
      </View>
      <View style={styles.copy}>
        <AppText variant="sectionTitle" align="center">{title}</AppText>
        <AppText tone="muted" align="center">{message}</AppText>
      </View>
      {actionLabel ? <AppButton label={actionLabel} onPress={onActionPress} variant="ghost" /> : null}
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
    backgroundColor: colors.brand.primarySoft,
    borderRadius: radius.pill,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  copy: {
    gap: spacing.sm,
  },
});