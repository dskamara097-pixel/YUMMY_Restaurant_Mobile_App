import { useCallback, useMemo } from 'react';

import { RestaurantModel } from '@/models/Restaurant';
import { restaurantRepository } from '@/repositories/RestaurantRepository';
import { RepositoryQueryOptions } from '@/repositories/Repository';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { applySampleQueryOptions, sampleRestaurantModels } from '@/utils/sampleModelFallbacks';

const defaultRestaurantOptions: RepositoryQueryOptions = { sort: [{ field: 'rating', direction: 'desc' }] };

async function loadRestaurantsWithFallback(options: RepositoryQueryOptions) {
  const restaurants = await restaurantRepository.list(options);
  return restaurants.length > 0 ? restaurants : applySampleQueryOptions(sampleRestaurantModels, options);
}

export function useRestaurants(options?: RepositoryQueryOptions) {
  const optionsKey = JSON.stringify(options ?? defaultRestaurantOptions);
  const queryOptions = useMemo(() => options ?? defaultRestaurantOptions, [optionsKey]);
  const initialData = useMemo(() => applySampleQueryOptions(sampleRestaurantModels, queryOptions), [queryOptions]);
  const loader = useCallback(() => loadRestaurantsWithFallback(queryOptions), [queryOptions]);
  return useFirestoreData<RestaurantModel[]>(`restaurants:${optionsKey}`, initialData, loader);
}

export function useRestaurant(restaurantId?: string) {
  const initialData = useMemo(() => sampleRestaurantModels.find((restaurant) => restaurant.id === restaurantId) ?? null, [restaurantId]);
  const loader = useCallback(async () => {
    if (!restaurantId) return null;

    return (await restaurantRepository.getById(restaurantId)) ?? sampleRestaurantModels.find((restaurant) => restaurant.id === restaurantId) ?? null;
  }, [restaurantId]);
  return useFirestoreData<RestaurantModel | null>(`restaurant:${restaurantId ?? 'none'}`, initialData, loader);
}
