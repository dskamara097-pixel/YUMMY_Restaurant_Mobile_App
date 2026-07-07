import { useCallback, useMemo } from 'react';

import { RestaurantModel } from '@/models/Restaurant';
import { restaurantRepository } from '@/repositories/RestaurantRepository';
import { RepositoryQueryOptions } from '@/repositories/Repository';
import { useFirestoreData } from '@/hooks/useFirestoreData';

const defaultRestaurantOptions: RepositoryQueryOptions = { sort: [{ field: 'rating', direction: 'desc' }] };

export function useRestaurants(options?: RepositoryQueryOptions) {
  const optionsKey = JSON.stringify(options ?? defaultRestaurantOptions);
  const queryOptions = useMemo(() => options ?? defaultRestaurantOptions, [optionsKey]);
  const loader = useCallback(() => restaurantRepository.list(queryOptions), [queryOptions]);
  return useFirestoreData<RestaurantModel[]>(`restaurants:${optionsKey}`, [], loader);
}

export function useRestaurant(restaurantId?: string) {
  const loader = useCallback(async () => (restaurantId ? restaurantRepository.getById(restaurantId) : null), [restaurantId]);
  return useFirestoreData<RestaurantModel | null>(`restaurant:${restaurantId ?? 'none'}`, null, loader);
}
