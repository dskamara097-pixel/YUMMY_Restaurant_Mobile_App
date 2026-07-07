import { PropsWithChildren } from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';

import { colors, typography } from '@/constants/theme';

type AppTextVariant = keyof typeof typography;
type AppTextTone = 'default' | 'muted' | 'primary' | 'inverse' | 'success' | 'warning' | 'danger';

type AppTextProps = PropsWithChildren<TextProps & {
  variant?: AppTextVariant;
  tone?: AppTextTone;
  align?: TextStyle['textAlign'];
}>;

const toneColor: Record<AppTextTone, string> = {
  default: colors.neutral.ink,
  muted: colors.neutral.muted,
  primary: colors.brand.primary,
  inverse: colors.neutral.surface,
  success: colors.semantic.success,
  warning: colors.semantic.warning,
  danger: colors.semantic.danger,
};

export function AppText({
  children,
  variant = 'body',
  tone = 'default',
  align,
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      {...props}
      style={[
        styles.base,
        typography[variant],
        { color: toneColor[tone], textAlign: align },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});