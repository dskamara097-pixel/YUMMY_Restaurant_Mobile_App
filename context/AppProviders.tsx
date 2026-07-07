import { PropsWithChildren } from 'react';

import { CartProvider } from '@/context/CartContext';
import { AuthenticationProvider } from '@/providers/AuthenticationProvider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AuthenticationProvider>
      <CartProvider>{children}</CartProvider>
    </AuthenticationProvider>
  );
}
