import { useCallback, useEffect, useMemo, useState } from 'react';

import { CartItemModel, CartModel, FoodModel } from '@/models';
import { cartRepository } from '@/repositories/CartRepository';
import { useAuth } from '@/hooks/useAuth';
import { useFirestoreData } from '@/hooks/useFirestoreData';

const localCartCache = new Map<string, CartModel>();

function calculateSubtotal(items: CartItemModel[]) {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

function normalizeItems(items: CartItemModel[]) {
  return items.map((item) => {
    const quantity = Math.max(1, item.quantity);

    return {
      ...item,
      quantity,
      lineTotal: item.unitPrice * quantity,
    };
  });
}

function createEmptyCart(customerId: string): CartModel {
  return {
    id: customerId,
    customerId,
    items: [],
    subtotal: 0,
    updatedAt: new Date().toISOString(),
  };
}

function createCart(customerId: string, items: CartItemModel[]): CartModel {
  const nextItems = normalizeItems(items);
  const cart: CartModel = {
    id: customerId,
    customerId,
    items: nextItems,
    subtotal: calculateSubtotal(nextItems),
    updatedAt: new Date().toISOString(),
  };

  if (nextItems[0]?.restaurantId) {
    cart.restaurantId = nextItems[0].restaurantId;
  }

  return cart;
}

function readLocalCart(customerId: string) {
  return localCartCache.get(customerId) ?? createEmptyCart(customerId);
}

function cacheCart(cart: CartModel) {
  localCartCache.set(cart.customerId, cart);
  return cart;
}

export function useCart() {
  const { userId } = useAuth();
  const [mutating, setMutating] = useState(false);
  const [optimisticCart, setOptimisticCart] = useState<CartModel | null>(null);
  const activeCustomerId = userId ?? 'guest';
  const initialCart = useMemo(() => readLocalCart(activeCustomerId), [activeCustomerId]);
  const loader = useCallback(async () => {
    if (!userId) return initialCart;

    try {
      const remoteCart = await cartRepository.getActiveCartForCustomer(userId);
      return remoteCart ? cacheCart(remoteCart) : initialCart;
    } catch {
      return readLocalCart(userId);
    }
  }, [initialCart, userId]);
  const state = useFirestoreData<CartModel | null>(`cart:user:${userId ?? 'guest'}`, initialCart, loader);

  useEffect(() => {
    setOptimisticCart(null);
  }, [userId]);

  const cartData = optimisticCart ?? state.data ?? initialCart;
  const items = cartData.items;
  const subtotal = useMemo(() => calculateSubtotal(items), [items]);

  const runMutation = useCallback(async (nextCart: CartModel, action: () => Promise<unknown>) => {
    if (!userId) {
      throw new Error('Sign in before managing your cart.');
    }

    cacheCart(nextCart);
    setOptimisticCart(nextCart);
    setMutating(true);

    try {
      await action();
      void state.retry();
    } catch {
      // Keep the local cart working for submission even when Firestore sync fails.
    } finally {
      setMutating(false);
    }
  }, [state.retry, userId]);

  const addFood = useCallback(async (food: FoodModel, quantity = 1, restaurantName?: string) => {
    const cartItem: CartItemModel = {
      foodId: food.id,
      restaurantId: food.restaurantId,
      name: food.name,
      unitPrice: food.price,
      quantity: Math.max(1, quantity),
      lineTotal: food.price * Math.max(1, quantity),
    };

    if (restaurantName) {
      cartItem.restaurantName = restaurantName;
    }

    if (food.imageUrl) {
      cartItem.imageUrl = food.imageUrl;
    }

    const existingItem = items.find((item) => item.foodId === food.id);
    const nextItems = existingItem
      ? items.map((item) => (item.foodId === food.id ? { ...item, quantity: item.quantity + cartItem.quantity } : item))
      : [...items, cartItem];

    await runMutation(cacheCart(createCart(userId!, nextItems)), () => cartRepository.saveActiveCart(userId!, nextItems));
  }, [items, runMutation, userId]);

  const updateQuantity = useCallback(async (foodId: string, quantity: number) => {
    const nextItems = items.map((item) => (item.foodId === foodId ? { ...item, quantity: Math.max(1, quantity) } : item));
    await runMutation(cacheCart(createCart(userId!, nextItems)), () => cartRepository.saveActiveCart(userId!, nextItems));
  }, [items, runMutation, userId]);

  const removeItem = useCallback(async (foodId: string) => {
    const nextItems = items.filter((item) => item.foodId !== foodId);
    await runMutation(cacheCart(createCart(userId!, nextItems)), () => cartRepository.saveActiveCart(userId!, nextItems));
  }, [items, runMutation, userId]);

  const clearCart = useCallback(async () => {
    await runMutation(cacheCart(createCart(userId!, [])), () => cartRepository.clearActiveCart(userId!));
  }, [runMutation, userId]);

  return { ...state, data: cartData, items, subtotal, error: null, mutating, addFood, updateQuantity, removeItem, clearCart };
}
