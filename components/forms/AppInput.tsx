import { ReactNode, useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { AppIconName, colors, layout, radius, spacing, typography } from '@/constants/theme';

type AppInputProps = TextInputProps & {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: AppIconName;
  rightElement?: ReactNode;
};

export function AppInput({
  label,
  error,
  helperText,
  leftIcon,
  rightElement,
  style,
  onFocus,
  onBlur,
  ...props
}: AppInputProps) {
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);

  return (
    <View style={styles.wrapper}>
      {label ? <AppText variant="label">{label}</AppText> : null}
      <View style={[styles.field, focused && styles.focused, hasError && styles.error]}>
        {leftIcon ? (
          <AppIcon
            name={leftIcon}
            size={20}
            color={hasError ? colors.semantic.danger : colors.neutral.muted}
          />
        ) : null}
        <TextInput
          placeholderTextColor={colors.neutral.subtle}
          style={[styles.input, style]}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...props}
        />
        {rightElement}
      </View>
      {error ? (
        <AppText variant="caption" tone="danger">
          {error}
        </AppText>
      ) : helperText ? (
        <AppText variant="caption" tone="muted">
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  field: {
    alignItems: 'center',
    backgroundColor: colors.neutral.surface,
    borderColor: colors.neutral.line,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 54,
    paddingHorizontal: spacing.lg,
  },
  focused: {
    borderColor: colors.brand.primary,
  },
  error: {
    borderColor: colors.semantic.danger,
  },
  input: {
    ...typography.body,
    color: colors.neutral.ink,
    flex: 1,
    minHeight: layout.minTouchTarget,
    paddingVertical: spacing.sm,
  },
});