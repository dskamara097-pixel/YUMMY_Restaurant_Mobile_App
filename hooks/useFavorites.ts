import { useCallback } from 'react';

import { FavoriteModel } from '@/models/Favorite';
import { favoriteRepository } from '@/repositories/FavoriteRepository';
import { useAuth } from '@/hooks/useAuth';
import { useFirestoreData } from '@/hooks/useFirestoreData';

export function useFavorites() {
  const { userId } = useAuth();
  const loader = useCallback(async () => (userId ? favoriteRepository.listByUser(userId) : []), [userId]);
  return useFirestoreData<FavoriteModel[]>(`favorites:user:${userId ?? 'guest'}`, [], loader);
}
