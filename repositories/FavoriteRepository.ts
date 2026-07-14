import { FavoriteModel } from '@/models/Favorite';
import { FirestoreRepository } from '@/repositories/Repository';
import { FIRESTORE_COLLECTIONS } from '@/utils/constants';

export class FavoriteRepository extends FirestoreRepository<FavoriteModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.favorites);
  }

  listByUser(userId: string) {
    return this.list({ filters: [{ field: 'userId', value: userId }] })
      .then((favorites) => favorites.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()));
  }

  listByUserAndType(userId: string, targetType: FavoriteModel['targetType']) {
    return this.list({ filters: [{ field: 'userId', value: userId }] })
      .then((favorites) => favorites.filter((favorite) => favorite.targetType === targetType));
  }
}

export const favoriteRepository = new FavoriteRepository();
