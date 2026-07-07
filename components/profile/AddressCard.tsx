import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { colors, radius, shadows, spacing } from '@/constants/theme';

type AddressCardProps = {
  label: string;
  recipient: string;
  phone: string;
  address: string;
  isDefault?: boolean;
  onEditPress?: () => void;
  onDeletePress?: () => void;
};

export function AddressCard({ label, recipient, phone, address, isDefault = false, onEditPress, onDeletePress }: AddressCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <AppIcon name="location-outline" color={colors.brand.primary} />
        </View>
        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <AppText variant="bodyStrong">{label}</AppText>
            {isDefault ? <AppBadge label="Default" tone="success" /> : null}
          </View>
          <AppText variant="caption" tone="muted">{recipient} - {phone}</AppText>
        </View>
      </View>
      <AppText tone="muted">{address}</AppText>
      <View style={styles.actions}>
        <AppButton label="Edit" variant="outline" size="sm" fullWidth={false} leftIcon="create-outline" onPress={onEditPress} />
        <AppButton label="Delete" variant="ghost" size="sm" fullWidth={false} leftIcon="trash-outline" onPress={onDeletePress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral.surface,
    borderColor: colors.neutral.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
    ...shadows.soft,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
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
    gap: spacing.xs,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
