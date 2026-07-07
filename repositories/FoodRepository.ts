import { FoodModel } from '@/models/Food';
import { FirestoreRepository } from '@/repositories/Repository';
import { FIRESTORE_COLLECTIONS } from '@/utils/constants';

export class FoodRepository extends FirestoreRepository<FoodModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.foods);
  }

  listAll() {
    return this.list({ sort: [{ field: 'createdAt', direction: 'desc' }] });
  }

  listAvailable() {
    return this.list({ filters: [{ field: 'available', value: true }], sort: [{ field: 'name' }] });
  }

  listFeatured() {
    return this.list({ filters: [{ field: 'featured', value: true }], pageSize: 12 });
  }

  listByRestaurant(restaurantId: string) {
    return this.list({ filters: [{ field: 'restaurantId', value: restaurantId }], sort: [{ field: 'name' }] });
  }

  listAvailableByRestaurant(restaurantId: string) {
    return this.list({ filters: [{ field: 'restaurantId', value: restaurantId }, { field: 'available', value: true }], sort: [{ field: 'name' }] });
  }

  listByCategory(categoryId: string) {
    return this.list({ filters: [{ field: 'categoryId', value: categoryId }], sort: [{ field: 'name' }] });
  }

  search(searchText: string) {
    return this.list({ searchText, searchFields: ['name', 'description'] });
  }
}

export const foodRepository = new FoodRepository();
