import { Stack } from 'expo-router';

import { colors } from '@/constants/theme';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.neutral.canvas } }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="users" />
      <Stack.Screen name="customers" />
      <Stack.Screen name="vendors" />
      <Stack.Screen name="riders" />
      <Stack.Screen name="restaurant-approval" />
      <Stack.Screen name="restaurants/[restaurantId]" />
      <Stack.Screen name="foods" />
      <Stack.Screen name="categories" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="orders/[orderId]" />
      <Stack.Screen name="coupons" />
      <Stack.Screen name="offers" />
      <Stack.Screen name="reviews" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="roles" />
    </Stack>
  );
}
