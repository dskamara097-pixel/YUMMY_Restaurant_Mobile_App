import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { AppIconName, colors, radius, shadows, spacing } from '@/constants/theme';

type CustomerNavItem = {
  label: string;
  href:
    | '/(customer)/home'
    | '/(customer)/categories'
    | '/(customer)/search'
    | '/(customer)/favorites'
    | '/(customer)/profile';
  icon: AppIconName;
};

type CustomerBottomNavigationProps = {
  active: 'home' | 'categories' | 'search' | 'favorites' | 'profile';
};

const navItems: CustomerNavItem[] = [
  { label: 'Home', href: '/(customer)/home', icon: 'home-outline' },
  { label: 'Categories', href: '/(customer)/categories', icon: 'grid-outline' },
  { label: 'Search', href: '/(customer)/search', icon: 'search' },
  { label: 'Favorites', href: '/(customer)/favorites', icon: 'heart-outline' },
  { label: 'Profile', href: '/(customer)/profile', icon: 'person-outline' },
];

export function CustomerBottomNavigation({
  active,
}: CustomerBottomNavigationProps) {
  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const selected = item.label.toLowerCase() === active;

        return (
          <Link
            key={item.href}
            href={item.href as Href}
            asChild
          >
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={StyleSheet.flatten([
                styles.item,
                selected ? styles.activeItem : null,
              ])}
            >
              <AppIcon
                name={item.icon}
                size={20}
                color={
                  selected
                    ? colors.brand.primary
                    : colors.neutral.muted
                }
              />

              <AppText
                variant="caption"
                tone={selected ? 'primary' : 'muted'}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {item.label}
              </AppText>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.neutral.surface,
    borderColor: colors.neutral.line,
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'space-between',
    padding: spacing.sm,
    ...shadows.card,
  },

  item: {
    alignItems: 'center',
    borderRadius: radius.lg,
    flex: 1,
    gap: spacing.xs,
    justifyContent: 'center',
    minHeight: 58,
    paddingHorizontal: spacing.xs,
  },

  activeItem: {
    backgroundColor: colors.brand.primarySoft,
  },
});