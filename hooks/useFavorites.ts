import { useCallback, useMemo } from 'react';

import { FavoriteModel } from '@/models/Favorite';
import { favoriteRepository } from '@/repositories/FavoriteRepository';
import { useAuth } from '@/hooks/useAuth';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { sampleFavoriteModels } from '@/utils/sampleModelFallbacks';

export function useFavorites() {
  const { userId } = useAuth();
  const initialFavorites = useMemo(() => sampleFavoriteModels.map((favorite) => ({ ...favorite, userId: userId ?? favorite.userId })), [userId]);
  const loader = useCallback(async () => {
    if (!userId) return initialFavorites;

    const favorites = await favoriteRepository.listByUser(userId);
    return favorites.length > 0 ? favorites : initialFavorites;
  }, [initialFavorites, userId]);
  return useFirestoreData<FavoriteModel[]>(`favorites:user:${userId ?? 'guest'}`, initialFavorites, loader);
}
