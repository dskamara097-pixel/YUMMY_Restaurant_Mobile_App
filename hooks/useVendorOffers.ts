import { useCallback } from 'react';

import { CouponModel } from '@/models/Coupon';
import { OfferModel } from '@/models/Offer';
import { couponRepository } from '@/repositories/CouponRepository';
import { offerRepository } from '@/repositories/OfferRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';

export type SaveVendorCouponInput = {
  id?: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrderAmount?: number;
  expiresAt: string;
  active: boolean;
};

export type SaveVendorOfferInput = {
  id?: string;
  title: string;
  description: string;
  badgeLabel?: string;
  discountLabel: string;
  expiresAt: string;
  featured: boolean;
  active: boolean;
};

export function useVendorCoupons(restaurantId?: string, restaurantName?: string) {
  const loader = useCallback(async () => (restaurantId ? couponRepository.listByRestaurant(restaurantId) : []), [restaurantId]);
  const state = useFirestoreData<CouponModel[]>(`vendor-coupons:${restaurantId ?? 'none'}`, [], loader);
  const retry = state.retry;

  const saveCoupon = useCallback(async (input: SaveVendorCouponInput) => {
    if (!restaurantId) throw new Error('Create a restaurant profile before managing coupons.');
    const timestamp = new Date().toISOString();
    const payload = {
      restaurantId,
      restaurantName,
      code: input.code.trim().toUpperCase(),
      title: input.title.trim(),
      description: input.description.trim(),
      discountType: input.discountType,
      discountValue: input.discountValue,
      minimumOrderAmount: input.minimumOrderAmount,
      expiresAt: input.expiresAt,
      active: input.active,
      updatedAt: timestamp,
    };

    if (input.id) await couponRepository.update(input.id, payload);
    else await couponRepository.create({ ...payload, createdAt: timestamp });
    await retry();
  }, [restaurantId, restaurantName, retry]);

  const deleteCoupon = useCallback(async (couponId: string) => {
    await couponRepository.delete(couponId);
    await retry();
  }, [retry]);

  return { ...state, saveCoupon, deleteCoupon };
}

export function useVendorOffers(restaurantId?: string, restaurantName?: string) {
  const loader = useCallback(async () => (restaurantId ? offerRepository.listByRestaurant(restaurantId) : []), [restaurantId]);
  const state = useFirestoreData<OfferModel[]>(`vendor-offers:${restaurantId ?? 'none'}`, [], loader);
  const retry = state.retry;

  const saveOffer = useCallback(async (input: SaveVendorOfferInput) => {
    if (!restaurantId) throw new Error('Create a restaurant profile before managing offers.');
    const timestamp = new Date().toISOString();
    const payload = {
      restaurantId,
      restaurantName,
      title: input.title.trim(),
      description: input.description.trim(),
      badgeLabel: input.badgeLabel?.trim(),
      discountLabel: input.discountLabel.trim(),
      expiresAt: input.expiresAt,
      featured: input.featured,
      active: input.active,
      updatedAt: timestamp,
    };

    if (input.id) await offerRepository.update(input.id, payload);
    else await offerRepository.create({ ...payload, createdAt: timestamp });
    await retry();
  }, [restaurantId, restaurantName, retry]);

  const deleteOffer = useCallback(async (offerId: string) => {
    await offerRepository.delete(offerId);
    await retry();
  }, [retry]);

  return { ...state, saveOffer, deleteOffer };
}
