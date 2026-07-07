import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';

import { AppIconName, colors } from '@/constants/theme';

type AppIconProps = Omit<ComponentProps<typeof Ionicons>, 'name' | 'size' | 'color'> & {
  name: AppIconName;
  size?: number;
  color?: string;
};

export function AppIcon({ name, size = 22, color = colors.neutral.ink, ...props }: AppIconProps) {
  return <Ionicons name={name} size={size} color={color} {...props} />;
}