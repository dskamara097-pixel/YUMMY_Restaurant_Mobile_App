export { colors, statusColors } from '@/constants/colors';
export { icons } from '@/constants/icons';
export type { AppIconName } from '@/constants/icons';
export { radius } from '@/constants/radius';
export { shadows } from '@/constants/shadows';
export { layout, spacing } from '@/constants/spacing';
export { fontFamily, fontSize, fontWeight, lineHeight, typography } from '@/constants/typography';

import { colors, statusColors } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { radius } from '@/constants/radius';
import { shadows } from '@/constants/shadows';
import { layout, spacing } from '@/constants/spacing';
import { fontFamily, fontSize, fontWeight, lineHeight, typography } from '@/constants/typography';

export const theme = {
  colors,
  statusColors,
  spacing,
  layout,
  radius,
  shadows,
  typography,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  icons,
} as const;