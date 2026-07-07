import { Stack } from 'expo-router';

import { colors } from '@/constants/theme';

export default function VendorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.neutral.canvas } }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="menu" />
      <Stack.Screen name="food-management" />
      <Stack.Screen name="foods/add" />
      <Stack.Screen name="foods/[foodId]" />
      <Stack.Screen name="categories" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="orders/[orderId]" />
      <Stack.Screen name="orders/[orderId]/status" />
      <Stack.Screen name="offers" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
