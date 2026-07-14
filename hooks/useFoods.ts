import { useCallback, useMemo } from 'react';

import { FoodModel } from '@/models/Food';
import { foodRepository } from '@/repositories/FoodRepository';
import { RepositoryQueryOptions } from '@/repositories/Repository';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { applySampleQueryOptions, sampleFoodModels } from '@/utils/sampleModelFallbacks';

const defaultFoodOptions: RepositoryQueryOptions = { sort: [{ field: 'name' }] };

async function loadFoodsWithFallback(options: RepositoryQueryOptions) {
  const foods = await foodRepository.list(options);
  return foods.length > 0 ? foods : applySampleQueryOptions(sampleFoodModels, options);
}

export function useFoods(options?: RepositoryQueryOptions) {
  const optionsKey = JSON.stringify(options ?? defaultFoodOptions);
  const queryOptions = useMemo(() => options ?? defaultFoodOptions, [optionsKey]);
  const initialData = useMemo(() => applySampleQueryOptions(sampleFoodModels, queryOptions), [queryOptions]);
  const loader = useCallback(() => loadFoodsWithFallback(queryOptions), [queryOptions]);
  return useFirestoreData<FoodModel[]>(`foods:${optionsKey}`, initialData, loader);
}

export function useFood(foodId?: string) {
  const initialData = useMemo(() => sampleFoodModels.find((food) => food.id === foodId) ?? null, [foodId]);
  const loader = useCallback(async () => {
    if (!foodId) return null;

    return (await foodRepository.getById(foodId)) ?? sampleFoodModels.find((food) => food.id === foodId) ?? null;
  }, [foodId]);
  return useFirestoreData<FoodModel | null>(`food:${foodId ?? 'none'}`, initialData, loader);
}

export function useFoodsByRestaurant(restaurantId?: string) {
  const initialData = useMemo(() => {
    if (!restaurantId) return [];
    const matchedFoods = sampleFoodModels.filter((food) => food.restaurantId === restaurantId);
    return matchedFoods.length > 0 ? matchedFoods : sampleFoodModels;
  }, [restaurantId]);
  const loader = useCallback(async () => {
    if (!restaurantId) return [];

    const foods = await foodRepository.listByRestaurant(restaurantId);
    return foods.length > 0 ? foods : initialData;
  }, [initialData, restaurantId]);
  return useFirestoreData<FoodModel[]>(`foods:restaurant:${restaurantId ?? 'none'}`, initialData, loader);
}
