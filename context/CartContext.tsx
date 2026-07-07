import { createContext, PropsWithChildren, useContext, useMemo } from 'react';

import { CartItem } from '@/types';

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: PropsWithChildren) {
  const value = useMemo<CartContextValue>(
    () => ({
      items: [],
      itemCount: 0,
      totalAmount: 0,
    }),
    [],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider.');
  }

  return context;
}
