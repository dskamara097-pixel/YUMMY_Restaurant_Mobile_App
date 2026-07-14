import { useCallback } from 'react';

import { RestaurantModel } from '@/models/Restaurant';
import { VendorModel } from '@/models/Vendor';
import { restaurantRepository } from '@/repositories/RestaurantRepository';
import { userRepository } from '@/repositories/UserRepository';
import { vendorRepository } from '@/repositories/VendorRepository';
import { useAuth } from '@/hooks/useAuth';
import { useFirestoreData } from '@/hooks/useFirestoreData';

export type SaveVendorRestaurantInput = {
  name: string;
  description: string;
  deliveryTimeMinutes: number;
  deliveryFee: number;
  categoryIds?: string[];
  ownerName?: string;
  phone?: string;
  email?: string;
  address?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  openingHours?: string;
  closingHours?: string;
  active?: boolean;
};

export type VendorRestaurantState = {
  restaurant: RestaurantModel | null;
  vendor: VendorModel | null;
};

export function useVendorRestaurant() {
  const auth = useAuth();
  const userId = auth.userId;
  const loader = useCallback(async (): Promise<VendorRestaurantState> => {
    if (!userId) return { restaurant: null, vendor: null };
    const [restaurant, vendor] = await Promise.all([
      restaurantRepository.getByOwnerId(userId),
      vendorRepository.getByUserId(userId),
    ]);
    return { restaurant, vendor };
  }, [userId]);
  const state = useFirestoreData<VendorRestaurantState>(`vendor-restaurant:${userId ?? 'guest'}`, { restaurant: null, vendor: null }, loader);
  const retry = state.retry;
  const restaurant = state.data.restaurant;
  const vendor = state.data.vendor;

  const saveRestaurant = useCallback(async (input: SaveVendorRestaurantInput) => {
    if (!userId) throw new Error('Sign in as a vendor before managing a restaurant.');

    const timestamp = new Date().toISOString();
    const existing = await restaurantRepository.getByOwnerId(userId);
    const payload = {
      ownerId: userId,
      name: input.name.trim(),
      description: input.description.trim(),
      categoryIds: input.categoryIds ?? existing?.categoryIds ?? [],
      logoUrl: input.logoUrl?.trim() || existing?.logoUrl,
      coverImageUrl: input.coverImageUrl?.trim() || existing?.coverImageUrl,
      phone: input.phone?.trim() || existing?.phone,
      email: input.email?.trim().toLowerCase() || existing?.email || auth.email || undefined,
      address: input.address?.trim() || existing?.address,
      openingHours: input.openingHours?.trim() || existing?.openingHours,
      closingHours: input.closingHours?.trim() || existing?.closingHours,
      deliveryTimeMinutes: input.deliveryTimeMinutes,
      deliveryFee: input.deliveryFee,
      rating: existing?.rating ?? 0,
      reviewsCount: existing?.reviewsCount ?? 0,
      active: input.active ?? existing?.active ?? true,
      status: existing?.status ?? 'pending' as const,
      updatedAt: timestamp,
    };

    const savedRestaurant = existing
      ? await restaurantRepository.update(existing.id, payload)
      : await restaurantRepository.create({ ...payload, createdAt: timestamp });

    await vendorRepository.saveProfile({
      id: userId,
      userId,
      restaurantId: savedRestaurant?.id ?? existing?.id,
      businessName: payload.name,
      ownerName: input.ownerName?.trim() || auth.displayName || vendor?.ownerName || 'Vendor Owner',
      email: payload.email ?? auth.email ?? vendor?.email ?? '',
      phone: payload.phone ?? vendor?.phone ?? 'Phone pending',
      address: payload.address ?? vendor?.address ?? 'Address pending',
      description: payload.description,
      logo: payload.logoUrl,
      coverImage: payload.coverImageUrl,
      isOpen: payload.active,
      verified: vendor?.verified ?? false,
      rating: payload.rating,
      totalOrders: vendor?.totalOrders ?? 0,
      openingHours: payload.openingHours,
      closingHours: payload.closingHours,
      createdAt: vendor?.createdAt,
    });

    await retry();
  }, [auth.displayName, auth.email, retry, userId, vendor]);

  const toggleActive = useCallback(async () => {
    if (!restaurant || !userId) return;
    const nextActive = !restaurant.active;
    await restaurantRepository.update(restaurant.id, { active: nextActive });
    if (vendor) await vendorRepository.saveProfile({ ...vendor, isOpen: nextActive, id: userId });
    await retry();
  }, [restaurant, retry, userId, vendor]);

  const registerVendorProfile = useCallback(async (input: SaveVendorRestaurantInput) => {
    if (!userId) throw new Error('Create a Firebase vendor account before saving a profile.');
    await userRepository.ensureVendorUserProfile({
      id: userId,
      fullName: input.ownerName || auth.displayName || 'Vendor Owner',
      email: input.email || auth.email,
      phone: input.phone,
      address: input.address,
    });
    await saveRestaurant(input);
  }, [auth.displayName, auth.email, saveRestaurant, userId]);

  return {
    ...state,
    data: restaurant,
    restaurant,
    vendor,
    saveRestaurant,
    registerVendorProfile,
    toggleActive,
  };
}
