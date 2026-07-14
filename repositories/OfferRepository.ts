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
    return this.list({ filters: [{ field: 'active', value: true }] })
      .then((offers) => offers.sort((left, right) => Number(right.featured) - Number(left.featured) || left.expiresAt.localeCompare(right.expiresAt)));
  }

  listFeatured() {
    return this.listActive()
      .then((offers) => offers.filter((offer) => offer.featured).slice(0, 6));
  }

  listByRestaurant(restaurantId: string) {
    return this.list({ filters: [{ field: 'restaurantId', value: restaurantId }] })
      .then((offers) => offers.sort((left, right) => left.expiresAt.localeCompare(right.expiresAt)));
  }
}

export const offerRepository = new OfferRepository();
