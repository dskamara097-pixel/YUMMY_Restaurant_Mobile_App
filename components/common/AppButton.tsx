import { forwardRef, ReactNode } from 'react';
import { ActivityIndicator, Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppIconName, colors, layout, radius, shadows, spacing, typography } from '@/constants/theme';

type AppButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type AppButtonSize = 'sm' | 'md' | 'lg';

type AppButtonProps = PressableProps & {
  label: string;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  leftIcon?: AppIconName;
  rightIcon?: AppIconName;
  loading?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
};

const variantStyles: Record<AppButtonVariant, { container: object; label: object; icon: string }> = {
  primary: {
    container: { backgroundColor: colors.brand.primary, borderColor: colors.brand.primary },
    label: { color: colors.neutral.surface },
    icon: colors.neutral.surface,
  },
  secondary: {
    container: { backgroundColor: colors.brand.accent, borderColor: colors.brand.accent },
    label: { color: colors.neutral.ink },
    icon: colors.neutral.ink,
  },
  outline: {
    container: { backgroundColor: colors.neutral.surface, borderColor: colors.brand.primary },
    label: { color: colors.brand.primary },
    icon: colors.brand.primary,
  },
  ghost: {
    container: { backgroundColor: colors.brand.primarySoft, borderColor: colors.brand.primarySoft },
    label: { color: colors.brand.primaryDark },
    icon: colors.brand.primaryDark,
  },
  danger: {
    container: { backgroundColor: colors.semantic.danger, borderColor: colors.semantic.danger },
    label: { color: colors.neutral.surface },
    icon: colors.neutral.surface,
  },
};

const sizeStyles: Record<AppButtonSize, object> = {
  sm: { minHeight: layout.minTouchTarget, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  md: { minHeight: 50, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  lg: { minHeight: 56, paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
};

export const AppButton = forwardRef<View, AppButtonProps>(function AppButton(
  {
    label,
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    loading = false,
    fullWidth = true,
    disabled,
    style,
    ...props
  },
  ref,
) {
  const visual = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={(state) => {
        const providedStyle = typeof style === 'function' ? style(state) : style;
        return StyleSheet.flatten([
          styles.button,
          sizeStyles[size],
          visual.container,
          fullWidth && styles.fullWidth,
          variant === 'primary' && shadows.soft,
          state.pressed && !isDisabled && styles.pressed,
          isDisabled && styles.disabled,
          providedStyle,
        ]);
      }}
      {...props}
    >
      {loading ? <ActivityIndicator color={visual.icon} /> : null}
      {!loading && leftIcon ? <AppIcon name={leftIcon} size={18} color={visual.icon} /> : null}
      <Text style={[styles.label, visual.label]} numberOfLines={1} adjustsFontSizeToFit>
        {label}
      </Text>
      {!loading && rightIcon ? <AppIcon name={rightIcon} size={18} color={visual.icon} /> : null}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.56,
  },
  label: {
    ...typography.label,
    maxWidth: '88%',
  },
});
