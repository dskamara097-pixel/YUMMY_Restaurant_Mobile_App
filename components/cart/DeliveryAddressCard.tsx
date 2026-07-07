import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { colors, radius, shadows, spacing } from '@/constants/theme';

type DeliveryAddressCardProps = {
  customerName: string;
  phone: string;
  address: string;
  onChangePress?: () => void;
};

export function DeliveryAddressCard({ customerName, phone, address, onChangePress }: DeliveryAddressCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <AppIcon name="location-outline" color={colors.brand.primary} />
        </View>
        <View style={styles.titleCopy}>
          <AppText variant="sectionTitle">Delivery Address</AppText>
          <AppText variant="caption" tone="muted">No maps or GPS in this phase</AppText>
        </View>
      </View>
      <View style={styles.infoStack}>
        <AppBadge label={customerName} icon="person-outline" tone="primary" />
        <AppText variant="bodyStrong">{phone}</AppText>
        <AppText tone="muted">{address}</AppText>
      </View>
      <AppButton label="Change Address" variant="outline" leftIcon="create-outline" onPress={onChangePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral.surface,
    borderColor: colors.neutral.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.lg,
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
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  titleCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  infoStack: {
    gap: spacing.sm,
  },
});
