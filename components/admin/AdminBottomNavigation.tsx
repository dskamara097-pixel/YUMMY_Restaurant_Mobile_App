import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { AppIconName, colors, radius, shadows, spacing } from '@/constants/theme';

type AdminNavKey = 'dashboard' | 'users' | 'restaurants' | 'orders' | 'settings';

type AdminNavItem = { key: AdminNavKey; label: string; href: string; icon: AppIconName };

const navItems: AdminNavItem[] = [
  { key: 'dashboard', label: 'Home', href: '/(admin)/dashboard', icon: 'grid-outline' },
  { key: 'users', label: 'Users', href: '/(admin)/users', icon: 'people-outline' },
  { key: 'restaurants', label: 'Vendors', href: '/(admin)/vendors', icon: 'storefront-outline' },
  { key: 'orders', label: 'Orders', href: '/(admin)/orders', icon: 'receipt-outline' },
  { key: 'settings', label: 'Settings', href: '/(admin)/settings', icon: 'settings-outline' },
];

export function AdminBottomNavigation({ active }: { active: AdminNavKey }) {
  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const selected = item.key === active;
        return (
          <Link key={item.key} href={item.href as Href} asChild>
            <Pressable accessibilityRole="button" accessibilityState={{ selected }} style={[styles.item, selected && styles.activeItem]}>
              <AppIcon name={item.icon} size={20} color={selected ? colors.neutral.ink : colors.neutral.muted} />
              <AppText variant="caption" tone={selected ? 'default' : 'muted'} numberOfLines={1} adjustsFontSizeToFit>{item.label}</AppText>
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
  activeItem: { backgroundColor: colors.neutral.surfaceWarm },
});
