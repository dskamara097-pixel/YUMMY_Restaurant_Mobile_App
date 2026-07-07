import { StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { AppIconName, colors, radius, spacing } from '@/constants/theme';

type BadgeTone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'info';

type AppBadgeProps = {
  label: string;
  tone?: BadgeTone;
  icon?: AppIconName;
};

const badgeColors: Record<BadgeTone, { background: string; foreground: string }> = {
  primary: { background: colors.brand.primarySoft, foreground: colors.brand.primaryDark },
  success: { background: colors.semantic.successSoft, foreground: colors.semantic.success },
  warning: { background: colors.semantic.warningSoft, foreground: colors.semantic.warning },
  danger: { background: colors.semantic.dangerSoft, foreground: colors.semantic.danger },
  neutral: { background: colors.neutral.surfaceWarm, foreground: colors.neutral.body },
  info: { background: colors.semantic.infoSoft, foreground: colors.semantic.info },
};

export function AppBadge({ label, tone = 'neutral', icon }: AppBadgeProps) {
  const palette = badgeColors[tone];

  return (
    <View style={[styles.badge, { backgroundColor: palette.background }]}>
      {icon ? <AppIcon name={icon} size={14} color={palette.foreground} /> : null}
      <AppText variant="caption" style={{ color: palette.foreground }} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: 28,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
});