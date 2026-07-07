import { useCallback } from 'react';

import { CouponModel } from '@/models/Coupon';
import { OfferModel } from '@/models/Offer';
import { couponRepository } from '@/repositories/CouponRepository';
import { offerRepository } from '@/repositories/OfferRepository';
import { SaveVendorCouponInput, SaveVendorOfferInput } from '@/hooks/useVendorOffers';
import { useFirestoreData } from '@/hooks/useFirestoreData';

export function useAdminCoupons() {
  const loader = useCallback(() => couponRepository.listAll(), []);
  const state = useFirestoreData<CouponModel[]>('admin-coupons', [], loader);
  const retry = state.retry;

  const saveCoupon = useCallback(async (input: SaveVendorCouponInput & { restaurantId?: string; restaurantName?: string }) => {
    const timestamp = new Date().toISOString();
    const payload = { ...input, code: input.code.trim().toUpperCase(), title: input.title.trim(), description: input.description.trim(), updatedAt: timestamp };
    if (input.id) await couponRepository.update(input.id, payload);
    else await couponRepository.create({ ...payload, createdAt: timestamp });
    await retry();
  }, [retry]);

  const deleteCoupon = useCallback(async (couponId: string) => { await couponRepository.delete(couponId); await retry(); }, [retry]);
  return { ...state, saveCoupon, deleteCoupon };
}

export function useAdminOffers() {
  const loader = useCallback(() => offerRepository.listAll(), []);
  const state = useFirestoreData<OfferModel[]>('admin-offers', [], loader);
  const retry = state.retry;

  const saveOffer = useCallback(async (input: SaveVendorOfferInput & { restaurantId?: string; restaurantName?: string }) => {
    const timestamp = new Date().toISOString();
    const payload = { ...input, title: input.title.trim(), description: input.description.trim(), updatedAt: timestamp };
    if (input.id) await offerRepository.update(input.id, payload);
    else await offerRepository.create({ ...payload, createdAt: timestamp });
    await retry();
  }, [retry]);

  const deleteOffer = useCallback(async (offerId: string) => { await offerRepository.delete(offerId); await retry(); }, [retry]);
  return { ...state, saveOffer, deleteOffer };
}
