import 'react-native-gesture-handler';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/constants/theme';
import { AppProviders } from '@/context/AppProviders';

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.brand.primary },
          headerTintColor: colors.neutral.surface,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.neutral.canvas },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(customer)" options={{ headerShown: false }} />
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        <Stack.Screen name="(vendor)" options={{ headerShown: false }} />
        <Stack.Screen name="(rider)" options={{ headerShown: false }} />
      </Stack>
    </AppProviders>
  );
}

