import { FavoriteModel } from '@/models/Favorite';
import { FirestoreRepository } from '@/repositories/Repository';
import { FIRESTORE_COLLECTIONS } from '@/utils/constants';

export class FavoriteRepository extends FirestoreRepository<FavoriteModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.favorites);
  }

  listByUser(userId: string) {
    return this.list({ filters: [{ field: 'userId', value: userId }], sort: [{ field: 'createdAt', direction: 'desc' }] });
  }

  listByUserAndType(userId: string, targetType: FavoriteModel['targetType']) {
    return this.list({ filters: [{ field: 'userId', value: userId }, { field: 'targetType', value: targetType }] });
  }
}

export const favoriteRepository = new FavoriteRepository();
