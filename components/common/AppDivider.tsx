import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';

type AppDividerProps = {
  vertical?: boolean;
  inset?: boolean;
};

export function AppDivider({ vertical = false, inset = false }: AppDividerProps) {
  return <View style={[vertical ? styles.vertical : styles.horizontal, inset && styles.inset]} />;
}

const styles = StyleSheet.create({
  horizontal: {
    backgroundColor: colors.neutral.line,
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  vertical: {
    backgroundColor: colors.neutral.line,
    height: '100%',
    width: StyleSheet.hairlineWidth,
  },
  inset: {
    marginVertical: spacing.md,
  },
});