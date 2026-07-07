export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 56,
} as const;

export const layout = {
  screenPadding: spacing.xl,
  compactScreenPadding: spacing.lg,
  sectionGap: spacing.xl,
  cardGap: spacing.md,
  minTouchTarget: 44,
} as const;