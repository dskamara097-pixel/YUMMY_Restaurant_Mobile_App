import { useCallback, useMemo } from 'react';

import { RestaurantModel, RestaurantStatus } from '@/models/Restaurant';
import { restaurantRepository } from '@/repositories/RestaurantRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';

export function useAdminRestaurants() {
  const loader = useCallback(() => restaurantRepository.listAll(), []);
  const state = useFirestoreData<RestaurantModel[]>('admin-restaurants', [], loader);
  const retry = state.retry;

  const approve = useCallback(async (restaurantId: string) => { await restaurantRepository.approve(restaurantId); await retry(); }, [retry]);
  const reject = useCallback(async (restaurantId: string) => { await restaurantRepository.reject(restaurantId); await retry(); }, [retry]);
  const suspend = useCallback(async (restaurantId: string) => { await restaurantRepository.suspend(restaurantId); await retry(); }, [retry]);
  const restore = useCallback(async (restaurantId: string) => { await restaurantRepository.restore(restaurantId); await retry(); }, [retry]);

  return { ...state, approve, reject, suspend, restore };
}

export function useAdminRestaurantFilters(restaurants: RestaurantModel[], query: string, status: RestaurantStatus | 'all') {
  return useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return restaurants.filter((restaurant) => {
      const restaurantStatus = restaurant.status ?? (restaurant.active ? 'approved' : 'pending');
      const source = [restaurant.name, restaurant.description, restaurant.ownerId].join(' ').toLowerCase();
      return (status === 'all' || restaurantStatus === status) && (!normalizedQuery || source.includes(normalizedQuery));
    });
  }, [query, restaurants, status]);
}
