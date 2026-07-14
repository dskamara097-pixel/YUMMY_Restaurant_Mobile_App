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
    return this.list({ filters: [{ field: 'available', value: true }] })
      .then((foods) => foods.sort((left, right) => left.name.localeCompare(right.name)));
  }

  listFeatured() {
    return this.list({ filters: [{ field: 'featured', value: true }], pageSize: 12 });
  }

  listByRestaurant(restaurantId: string) {
    return this.list({ filters: [{ field: 'restaurantId', value: restaurantId }] })
      .then((foods) => foods.sort((left, right) => left.name.localeCompare(right.name)));
  }

  listAvailableByRestaurant(restaurantId: string) {
    return this.listByRestaurant(restaurantId)
      .then((foods) => foods.filter((food) => food.available));
  }

  listByCategory(categoryId: string) {
    return this.list({ filters: [{ field: 'categoryId', value: categoryId }] })
      .then((foods) => foods.sort((left, right) => left.name.localeCompare(right.name)));
  }

  search(searchText: string) {
    return this.list({ searchText, searchFields: ['name', 'description'] });
  }
}

export const foodRepository = new FoodRepository();
