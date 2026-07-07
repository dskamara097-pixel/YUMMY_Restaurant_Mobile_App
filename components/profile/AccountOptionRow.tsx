import { Pressable, StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { AppIconName, colors, layout, radius, shadows, spacing } from '@/constants/theme';

type AccountOptionRowProps = {
  title: string;
  subtitle?: string;
  icon: AppIconName;
  badge?: string;
  destructive?: boolean;
  onPress?: () => void;
};

export function AccountOptionRow({ title, subtitle, icon, badge, destructive = false, onPress }: AccountOptionRowProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={[styles.iconWrap, destructive && styles.dangerIcon]}>
        <AppIcon name={icon} size={20} color={destructive ? colors.semantic.danger : colors.brand.primary} />
      </View>
      <View style={styles.copy}>
        <AppText variant="bodyStrong" tone={destructive ? 'danger' : 'default'}>{title}</AppText>
        {subtitle ? <AppText variant="caption" tone="muted" numberOfLines={1}>{subtitle}</AppText> : null}
      </View>
      {badge ? <AppBadge label={badge} tone="info" /> : null}
      <AppIcon name="chevron-forward" size={18} color={colors.neutral.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: colors.neutral.surface,
    borderColor: colors.neutral.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 72,
    padding: spacing.md,
    ...shadows.soft,
  },
  pressed: {
    opacity: 0.88,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: colors.brand.primarySoft,
    borderRadius: radius.md,
    height: layout.minTouchTarget,
    justifyContent: 'center',
    width: layout.minTouchTarget,
  },
  dangerIcon: {
    backgroundColor: colors.semantic.dangerSoft,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
});
