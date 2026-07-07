import { useCallback, useMemo, useState } from 'react';

import { CartItemModel, CartModel, FoodModel } from '@/models';
import { cartRepository } from '@/repositories/CartRepository';
import { useAuth } from '@/hooks/useAuth';
import { useFirestoreData } from '@/hooks/useFirestoreData';

function calculateSubtotal(items: CartItemModel[]) {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function useCart() {
  const { userId } = useAuth();
  const [mutating, setMutating] = useState(false);
  const loader = useCallback(async () => (userId ? cartRepository.getActiveCartForCustomer(userId) : null), [userId]);
  const state = useFirestoreData<CartModel | null>(`cart:user:${userId ?? 'guest'}`, null, loader);

  const items = state.data?.items ?? [];
  const subtotal = useMemo(() => calculateSubtotal(items), [items]);

  const runMutation = useCallback(async (action: () => Promise<unknown>) => {
    if (!userId) {
      throw new Error('Sign in before managing your cart.');
    }

    setMutating(true);

    try {
      await action();
      await state.retry();
    } finally {
      setMutating(false);
    }
  }, [state.retry, userId]);

  const addFood = useCallback(async (food: FoodModel, quantity = 1, restaurantName?: string) => {
    await runMutation(() => cartRepository.addItem(userId!, {
      foodId: food.id,
      restaurantId: food.restaurantId,
      restaurantName,
      name: food.name,
      unitPrice: food.price,
      quantity: Math.max(1, quantity),
      lineTotal: food.price * Math.max(1, quantity),
      imageUrl: food.imageUrl,
    }));
  }, [runMutation, userId]);

  const updateQuantity = useCallback(async (foodId: string, quantity: number) => {
    await runMutation(() => cartRepository.updateQuantity(userId!, foodId, quantity));
  }, [runMutation, userId]);

  const removeItem = useCallback(async (foodId: string) => {
    await runMutation(() => cartRepository.removeItem(userId!, foodId));
  }, [runMutation, userId]);

  const clearCart = useCallback(async () => {
    await runMutation(() => cartRepository.clearActiveCart(userId!));
  }, [runMutation, userId]);

  return { ...state, items, subtotal, mutating, addFood, updateQuantity, removeItem, clearCart };
}
