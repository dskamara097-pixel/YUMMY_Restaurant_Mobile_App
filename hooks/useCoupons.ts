import { useCallback } from 'react';

import { CouponModel } from '@/models/Coupon';
import { couponRepository } from '@/repositories/CouponRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';

export function useCoupons() {
  const loader = useCallback(() => couponRepository.listActive(), []);
  return useFirestoreData<CouponModel[]>('coupons:active', [], loader);
}
