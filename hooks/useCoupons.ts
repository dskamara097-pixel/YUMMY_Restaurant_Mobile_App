import { useCallback } from 'react';

import { CouponModel } from '@/models/Coupon';
import { couponRepository } from '@/repositories/CouponRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { sampleCouponModels } from '@/utils/sampleModelFallbacks';

export function useCoupons() {
  const loader = useCallback(async () => {
    const coupons = await couponRepository.listActive();
    return coupons.length > 0 ? coupons : sampleCouponModels;
  }, []);
  return useFirestoreData<CouponModel[]>('coupons:active', sampleCouponModels, loader);
}
