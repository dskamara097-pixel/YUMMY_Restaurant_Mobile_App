import { CategoryModel } from '@/models/Category';
import { FirestoreRepository } from '@/repositories/Repository';
import { FIRESTORE_COLLECTIONS } from '@/utils/constants';

export class CategoryRepository extends FirestoreRepository<CategoryModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.categories);
  }

  listActive() {
    return this.list({ filters: [{ field: 'active', value: true }] })
      .then((categories) => categories.sort((left, right) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name)));
  }

  listByRestaurant(restaurantId: string) {
    return this.list({ filters: [{ field: 'restaurantId', value: restaurantId }] })
      .then((categories) => categories.sort((left, right) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name)));
  }
}

export const categoryRepository = new CategoryRepository();
