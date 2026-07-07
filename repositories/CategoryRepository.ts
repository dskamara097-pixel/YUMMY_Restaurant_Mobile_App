import { CategoryModel } from '@/models/Category';
import { FirestoreRepository } from '@/repositories/Repository';
import { FIRESTORE_COLLECTIONS } from '@/utils/constants';

export class CategoryRepository extends FirestoreRepository<CategoryModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.categories);
  }

  listActive() {
    return this.list({ filters: [{ field: 'active', value: true }], sort: [{ field: 'sortOrder' }, { field: 'name' }] });
  }

  listByRestaurant(restaurantId: string) {
    return this.list({ filters: [{ field: 'restaurantId', value: restaurantId }], sort: [{ field: 'sortOrder' }, { field: 'name' }] });
  }
}

export const categoryRepository = new CategoryRepository();
