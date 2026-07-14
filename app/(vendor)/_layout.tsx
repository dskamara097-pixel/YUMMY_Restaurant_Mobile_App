import { Stack, useSegments } from 'expo-router';

import { VendorGate } from '@/components/vendor/VendorGate';
import { colors } from '@/constants/theme';

export default function VendorLayout() {
  const segments = useSegments();
  const currentRoute = segments[segments.length - 1];
  const publicRoute = currentRoute === 'login' || currentRoute === 'register' || currentRoute === 'forgot-password';
  const stack = (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.neutral.canvas } }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
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
      <Stack.Screen name="reviews" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="settings" />
    </Stack>
  );

  return publicRoute ? stack : <VendorGate>{stack}</VendorGate>;
}
