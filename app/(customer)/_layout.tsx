import { Stack } from 'expo-router';

import { CustomerGate } from '@/components/customer/CustomerGate';
import { colors } from '@/constants/theme';

export default function CustomerLayout() {
  return (
    <CustomerGate>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.neutral.canvas },
        }}
      >
        <Stack.Screen name="home" />
        <Stack.Screen name="categories" />
        <Stack.Screen name="search" />
        <Stack.Screen name="search-filters" />
        <Stack.Screen name="search-sorting" />
        <Stack.Screen name="favorites" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="payment" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen name="orders" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="addresses" />
        <Stack.Screen name="support" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="tracking/[orderId]" />
        <Stack.Screen name="restaurants/[restaurantId]" />
        <Stack.Screen name="foods/[foodId]" />
        <Stack.Screen name="restaurant-reviews" />
        <Stack.Screen name="food-reviews" />
        <Stack.Screen name="coupons" />
        <Stack.Screen name="offers" />
        <Stack.Screen name="recently-viewed" />
        <Stack.Screen name="recommended" />
        <Stack.Screen name="loading-preview" />
        <Stack.Screen name="error-preview" />
      </Stack>
    </CustomerGate>
  );
}

