import { CouponModel } from '@/models/Coupon';
import { FirestoreRepository } from '@/repositories/Repository';
import { FIRESTORE_COLLECTIONS } from '@/utils/constants';

export class CouponRepository extends FirestoreRepository<CouponModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.coupons);
  }

  listAll() {
    return this.list({ sort: [{ field: 'expiresAt' }] });
  }

  listActive() {
    return this.list({ filters: [{ field: 'active', value: true }] })
      .then((coupons) => coupons.sort((left, right) => left.expiresAt.localeCompare(right.expiresAt)));
  }

  listByRestaurant(restaurantId: string) {
    return this.list({ filters: [{ field: 'restaurantId', value: restaurantId }] })
      .then((coupons) => coupons.sort((left, right) => left.expiresAt.localeCompare(right.expiresAt)));
  }

  getByCode(code: string) {
    return this.list({ filters: [{ field: 'code', value: code.trim().toUpperCase() }], pageSize: 1 })
      .then((coupons) => coupons[0] ?? null);
  }
}

export const couponRepository = new CouponRepository();
