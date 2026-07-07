import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { AppInput } from '@/components/forms/AppInput';
import { colors, radius, shadows, spacing } from '@/constants/theme';

type OrderNotesCardProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function OrderNotesCard({ value, onChangeText }: OrderNotesCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.copy}>
        <AppText variant="sectionTitle">Order Notes</AppText>
        <AppText tone="muted">Examples: Leave at gate, call when arriving, or ring the bell.</AppText>
      </View>
      <AppInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Leave at gate"
        leftIcon="chatbubble-ellipses-outline"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />
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
  copy: {
    gap: spacing.xs,
  },
});
