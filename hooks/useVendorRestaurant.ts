import { useCallback } from 'react';

import { RestaurantModel } from '@/models/Restaurant';
import { restaurantRepository } from '@/repositories/RestaurantRepository';
import { useAuth } from '@/hooks/useAuth';
import { useFirestoreData } from '@/hooks/useFirestoreData';

export type SaveVendorRestaurantInput = {
  name: string;
  description: string;
  deliveryTimeMinutes: number;
  deliveryFee: number;
  categoryIds?: string[];
};

export function useVendorRestaurant() {
  const { userId } = useAuth();
  const loader = useCallback(async () => (userId ? restaurantRepository.getByOwnerId(userId) : null), [userId]);
  const state = useFirestoreData<RestaurantModel | null>(`vendor-restaurant:${userId ?? 'guest'}`, null, loader);
  const retry = state.retry;

  const saveRestaurant = useCallback(async (input: SaveVendorRestaurantInput) => {
    if (!userId) throw new Error('Sign in as a vendor before managing a restaurant.');

    const timestamp = new Date().toISOString();
    const existing = await restaurantRepository.getByOwnerId(userId);
    const payload = {
      ownerId: userId,
      name: input.name.trim(),
      description: input.description.trim(),
      categoryIds: input.categoryIds ?? existing?.categoryIds ?? [],
      deliveryTimeMinutes: input.deliveryTimeMinutes,
      deliveryFee: input.deliveryFee,
      rating: existing?.rating ?? 0,
      reviewsCount: existing?.reviewsCount ?? 0,
      active: existing?.active ?? true,
      updatedAt: timestamp,
    };

    if (existing) {
      await restaurantRepository.update(existing.id, payload);
    } else {
      await restaurantRepository.create({ ...payload, createdAt: timestamp });
    }

    await retry();
  }, [retry, userId]);

  const toggleActive = useCallback(async () => {
    if (!state.data) return;
    await restaurantRepository.update(state.data.id, { active: !state.data.active });
    await retry();
  }, [retry, state.data]);

  return { ...state, saveRestaurant, toggleActive };
}
