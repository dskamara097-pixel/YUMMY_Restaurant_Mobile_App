import { RestaurantModel, RestaurantStatus } from '@/models/Restaurant';
import { FirestoreRepository } from '@/repositories/Repository';
import { FIRESTORE_COLLECTIONS } from '@/utils/constants';

export class RestaurantRepository extends FirestoreRepository<RestaurantModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.restaurants);
  }

  listAll() {
    return this.list({ sort: [{ field: 'createdAt', direction: 'desc' }] });
  }

  listActive() {
    return this.list({ filters: [{ field: 'active', value: true }] })
      .then((restaurants) => restaurants.sort((left, right) => right.rating - left.rating));
  }

  listByStatus(status: RestaurantStatus) {
    return this.list({ filters: [{ field: 'status', value: status }] })
      .then((restaurants) => restaurants.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()));
  }

  getByOwnerId(ownerId: string) {
    return this.list({ filters: [{ field: 'ownerId', value: ownerId }], pageSize: 1 })
      .then((restaurants) => restaurants[0] ?? null);
  }

  updateStatus(restaurantId: string, status: RestaurantStatus, active = status === 'approved') {
    return this.update(restaurantId, { status, active });
  }

  approve(restaurantId: string) {
    return this.updateStatus(restaurantId, 'approved', true);
  }

  reject(restaurantId: string) {
    return this.updateStatus(restaurantId, 'rejected', false);
  }

  suspend(restaurantId: string) {
    return this.updateStatus(restaurantId, 'suspended', false);
  }

  restore(restaurantId: string) {
    return this.updateStatus(restaurantId, 'approved', true);
  }

  search(searchText: string) {
    return this.list({ searchText, searchFields: ['name', 'description'] });
  }
}

export const restaurantRepository = new RestaurantRepository();
