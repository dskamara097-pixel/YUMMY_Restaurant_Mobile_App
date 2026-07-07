import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { spacing } from '@/constants/theme';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({ title, subtitle, actionLabel, onActionPress }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.copy}>
        <AppText variant="sectionTitle">{title}</AppText>
        {subtitle ? <AppText variant="caption" tone="muted">{subtitle}</AppText> : null}
      </View>
      {actionLabel ? (
        <AppButton
          label={actionLabel}
          onPress={onActionPress}
          variant="ghost"
          size="sm"
          fullWidth={false}
          rightIcon="chevron-forward"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
});