import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { colors, radius, shadows, spacing } from '@/constants/theme';

type ProfileInfoCardProps = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  onEditPress?: () => void;
};

export function ProfileInfoCard({ fullName, phone, email, address, onEditPress }: ProfileInfoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <ProfileAvatar name={fullName} size={82} />
        <View style={styles.identityCopy}>
          <AppBadge label="Customer account" tone="primary" icon="person-outline" />
          <AppText variant="title" numberOfLines={2}>{fullName}</AppText>
          <AppText tone="muted">{phone}</AppText>
        </View>
      </View>
      <View style={styles.details}>
        <Detail label="Email" value={email} />
        <Detail label="Delivery address" value={address} />
      </View>
      <AppButton label="Edit Profile" leftIcon="create-outline" onPress={onEditPress} />
    </View>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <AppText variant="caption" tone="muted">{label}</AppText>
      <AppText variant="bodyStrong">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral.surface,
    borderColor: colors.neutral.line,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.lg,
    ...shadows.card,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.lg,
  },
  identityCopy: {
    flex: 1,
    gap: spacing.sm,
  },
  details: {
    gap: spacing.md,
  },
  detailRow: {
    gap: spacing.xs,
  },
});
