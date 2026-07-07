export const colors = {
  brand: {
    primary: '#CE1212',
    primaryDark: '#9B0D0D',
    primarySoft: '#FFE5E2',
    accent: '#F4A261',
    accentDark: '#D9822B',
    cream: '#FFF8F4',
  },
  neutral: {
    ink: '#1E1E24',
    body: '#3B3B44',
    muted: '#6E6E78',
    subtle: '#9A9290',
    line: '#E9E2DE',
    canvas: '#FFF8F4',
    surface: '#FFFFFF',
    surfaceWarm: '#FFF1E8',
  },
  semantic: {
    success: '#2A9D8F',
    successSoft: '#E2F5F1',
    warning: '#E9A227',
    warningSoft: '#FFF3D8',
    danger: '#D64545',
    dangerSoft: '#FFE5E5',
    info: '#3B82F6',
    infoSoft: '#EAF2FF',
  },
  overlay: {
    scrim: 'rgba(30, 30, 36, 0.48)',
    soft: 'rgba(206, 18, 18, 0.08)',
  },
} as const;

export const statusColors = {
  pending: colors.semantic.warning,
  submitted: colors.semantic.info,
  approved: colors.semantic.success,
  rejected: colors.semantic.danger,
  preparing: colors.brand.accent,
  ready: colors.semantic.success,
  delivered: colors.neutral.ink,
} as const;