import { Pressable, StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { AppIconName, colors, radius, shadows, spacing } from '@/constants/theme';

type VendorStatCardProps = {
  label: string;
  value: string;
  icon: AppIconName;
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
};

export function VendorStatCard({ label, value, icon, tone = 'primary' }: VendorStatCardProps) {
  return (
    <View style={styles.statCard}>
      <AppBadge label={label} icon={icon} tone={tone} />
      <AppText variant="title">{value}</AppText>
    </View>
  );
}

type VendorActionCardProps = {
  title: string;
  subtitle: string;
  icon: AppIconName;
  onPress?: () => void;
  badge?: string;
};

export function VendorActionCard({ title, subtitle, icon, onPress, badge }: VendorActionCardProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}>
      <View style={styles.iconWrap}><AppIcon name={icon} color={colors.brand.primary} /></View>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <AppText variant="bodyStrong" numberOfLines={1}>{title}</AppText>
          {badge ? <AppBadge label={badge} tone="info" /> : null}
        </View>
        <AppText tone="muted" numberOfLines={2}>{subtitle}</AppText>
      </View>
      <AppIcon name="chevron-forward" color={colors.neutral.muted} />
    </Pressable>
  );
}

type VendorEntityCardProps = {
  title: string;
  subtitle?: string;
  meta?: string;
  badge?: string;
  badgeTone?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  onPress?: () => void;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  dangerActionLabel?: string;
  onDangerAction?: () => void;
};

export function VendorEntityCard({ title, subtitle, meta, badge, badgeTone = 'neutral', onPress, primaryActionLabel, onPrimaryAction, secondaryActionLabel, onSecondaryAction, dangerActionLabel, onDangerAction }: VendorEntityCardProps) {
  return (
    <Pressable accessibilityRole={onPress ? 'button' : undefined} onPress={onPress} style={({ pressed }) => [styles.entityCard, pressed && onPress && styles.pressed]}>
      <View style={styles.titleRow}>
        <View style={styles.copy}>
          <AppText variant="bodyStrong" numberOfLines={1}>{title}</AppText>
          {subtitle ? <AppText tone="muted" numberOfLines={2}>{subtitle}</AppText> : null}
        </View>
        {badge ? <AppBadge label={badge} tone={badgeTone} /> : null}
      </View>
      {meta ? <AppText variant="caption" tone="muted">{meta}</AppText> : null}
      {primaryActionLabel || secondaryActionLabel || dangerActionLabel ? (
        <View style={styles.actions}>
          {primaryActionLabel ? <AppButton label={primaryActionLabel} size="sm" fullWidth={false} onPress={onPrimaryAction} /> : null}
          {secondaryActionLabel ? <AppButton label={secondaryActionLabel} size="sm" fullWidth={false} variant="outline" onPress={onSecondaryAction} /> : null}
          {dangerActionLabel ? <AppButton label={dangerActionLabel} size="sm" fullWidth={false} variant="danger" onPress={onDangerAction} /> : null}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  statCard: { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, flex: 1, gap: spacing.md, minWidth: 145, padding: spacing.lg, ...shadows.soft },
  actionCard: { alignItems: 'center', backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, flexDirection: 'row', gap: spacing.md, padding: spacing.md, ...shadows.soft },
  entityCard: { backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.lg, borderWidth: 1, gap: spacing.md, padding: spacing.lg, ...shadows.soft },
  iconWrap: { alignItems: 'center', backgroundColor: colors.brand.primarySoft, borderRadius: radius.md, height: 44, justifyContent: 'center', width: 44 },
  copy: { flex: 1, gap: spacing.xs },
  titleRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
});
