import { Stack } from 'expo-router';

import { colors } from '@/constants/theme';

export default function RiderLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.neutral.canvas } }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="deliveries" />
      <Stack.Screen name="delivery-status" />
    </Stack>
  );
}
