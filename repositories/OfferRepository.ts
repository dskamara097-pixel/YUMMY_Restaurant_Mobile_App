import { OfferModel } from '@/models/Offer';
import { FirestoreRepository } from '@/repositories/Repository';
import { FIRESTORE_COLLECTIONS } from '@/utils/constants';

export class OfferRepository extends FirestoreRepository<OfferModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.offers);
  }

  listAll() {
    return this.list({ sort: [{ field: 'expiresAt' }] });
  }

  listActive() {
    return this.list({ filters: [{ field: 'active', value: true }], sort: [{ field: 'featured', direction: 'desc' }, { field: 'expiresAt' }] });
  }

  listFeatured() {
    return this.list({ filters: [{ field: 'active', value: true }, { field: 'featured', value: true }], pageSize: 6 });
  }

  listByRestaurant(restaurantId: string) {
    return this.list({ filters: [{ field: 'restaurantId', value: restaurantId }], sort: [{ field: 'expiresAt' }] });
  }
}

export const offerRepository = new OfferRepository();
