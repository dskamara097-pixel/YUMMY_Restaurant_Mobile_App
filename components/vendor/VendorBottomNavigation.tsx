import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { AppIconName, colors, radius, shadows, spacing } from '@/constants/theme';

type VendorNavKey = 'dashboard' | 'menu' | 'orders' | 'offers' | 'settings';

type VendorNavItem = {
  key: VendorNavKey;
  label: string;
  href: '/(vendor)/dashboard' | '/(vendor)/menu' | '/(vendor)/orders' | '/(vendor)/offers' | '/(vendor)/settings';
  icon: AppIconName;
};

const navItems: VendorNavItem[] = [
  { key: 'dashboard', label: 'Home', href: '/(vendor)/dashboard', icon: 'grid-outline' },
  { key: 'menu', label: 'Menu', href: '/(vendor)/menu', icon: 'fast-food-outline' },
  { key: 'orders', label: 'Orders', href: '/(vendor)/orders', icon: 'receipt-outline' },
  { key: 'offers', label: 'Offers', href: '/(vendor)/offers', icon: 'gift-outline' },
  { key: 'settings', label: 'Settings', href: '/(vendor)/settings', icon: 'settings-outline' },
];

export function VendorBottomNavigation({ active }: { active: VendorNavKey }) {
  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const selected = item.key === active;
        return (
          <Link key={item.key} href={item.href as unknown as Href} asChild>
            <Pressable accessibilityRole="button" accessibilityState={{ selected }} style={StyleSheet.flatten([styles.item, selected ? styles.activeItem : undefined])}>
              <AppIcon name={item.icon} size={20} color={selected ? colors.brand.primary : colors.neutral.muted} />
              <AppText variant="caption" tone={selected ? 'primary' : 'muted'} numberOfLines={1} adjustsFontSizeToFit>{item.label}</AppText>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', backgroundColor: colors.neutral.surface, borderColor: colors.neutral.line, borderRadius: radius.xl, borderWidth: 1, flexDirection: 'row', gap: spacing.xs, justifyContent: 'space-between', padding: spacing.sm, ...shadows.card },
  item: { alignItems: 'center', borderRadius: radius.lg, flex: 1, gap: spacing.xs, justifyContent: 'center', minHeight: 58, paddingHorizontal: spacing.xs },
  activeItem: { backgroundColor: colors.brand.primarySoft },
});
