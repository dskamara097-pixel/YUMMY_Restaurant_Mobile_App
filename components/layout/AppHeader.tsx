import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { AppIconName, colors, layout, spacing } from '@/constants/theme';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  leftIcon?: AppIconName;
  rightIcon?: AppIconName;
  onLeftPress?: () => void;
  onRightPress?: () => void;
};

export function AppHeader({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
}: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {leftIcon ? (
          <Pressable accessibilityRole="button" onPress={onLeftPress} style={styles.iconButton}>
            <AppIcon name={leftIcon} color={colors.neutral.ink} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.copy}>
        <AppText variant="sectionTitle" align="center" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" tone="muted" align="center" numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <View style={styles.side}>
        {rightIcon ? (
          <Pressable accessibilityRole="button" onPress={onRightPress} style={styles.iconButton}>
            <AppIcon name={rightIcon} color={colors.neutral.ink} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 56,
  },
  side: {
    alignItems: 'center',
    width: layout.minTouchTarget,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: layout.minTouchTarget,
    minWidth: layout.minTouchTarget,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
});