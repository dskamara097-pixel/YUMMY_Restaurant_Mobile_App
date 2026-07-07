import { useCallback, useMemo } from 'react';

import { FoodModel } from '@/models/Food';
import { foodRepository } from '@/repositories/FoodRepository';
import { RepositoryQueryOptions } from '@/repositories/Repository';
import { useFirestoreData } from '@/hooks/useFirestoreData';

const defaultFoodOptions: RepositoryQueryOptions = { sort: [{ field: 'name' }] };

export function useFoods(options?: RepositoryQueryOptions) {
  const optionsKey = JSON.stringify(options ?? defaultFoodOptions);
  const queryOptions = useMemo(() => options ?? defaultFoodOptions, [optionsKey]);
  const loader = useCallback(() => foodRepository.list(queryOptions), [queryOptions]);
  return useFirestoreData<FoodModel[]>(`foods:${optionsKey}`, [], loader);
}

export function useFood(foodId?: string) {
  const loader = useCallback(async () => (foodId ? foodRepository.getById(foodId) : null), [foodId]);
  return useFirestoreData<FoodModel | null>(`food:${foodId ?? 'none'}`, null, loader);
}

export function useFoodsByRestaurant(restaurantId?: string) {
  const loader = useCallback(async () => (restaurantId ? foodRepository.listByRestaurant(restaurantId) : []), [restaurantId]);
  return useFirestoreData<FoodModel[]>(`foods:restaurant:${restaurantId ?? 'none'}`, [], loader);
}
