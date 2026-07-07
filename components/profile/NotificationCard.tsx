import { Pressable, StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { AppIconName, colors, radius, shadows, spacing } from '@/constants/theme';

type NotificationCardProps = {
  title: string;
  message: string;
  time: string;
  type: 'payment' | 'order' | 'promotion' | 'system';
  read: boolean;
  onPress?: () => void;
};

const typeIcon: Record<NotificationCardProps['type'], AppIconName> = {
  payment: 'card-outline',
  order: 'receipt-outline',
  promotion: 'sparkles-outline',
  system: 'notifications-outline',
};

export function NotificationCard({ title, message, time, type, read, onPress }: NotificationCardProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, !read && styles.unread, pressed && styles.pressed]}>
      <View style={styles.iconWrap}>
        <AppIcon name={typeIcon[type]} color={colors.brand.primary} />
      </View>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <AppText variant="bodyStrong" numberOfLines={1}>{title}</AppText>
          {!read ? <AppBadge label="New" tone="primary" /> : null}
        </View>
        <AppText tone="muted" numberOfLines={2}>{message}</AppText>
        <AppText variant="caption" tone="muted">{time}</AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
    backgroundColor: colors.neutral.surface,
    borderColor: colors.neutral.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    ...shadows.soft,
  },
  unread: {
    borderColor: colors.brand.primary,
  },
  pressed: {
    opacity: 0.88,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: colors.brand.primarySoft,
    borderRadius: radius.md,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  copy: {
    flex: 1,
    gap: spacing.sm,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
});

