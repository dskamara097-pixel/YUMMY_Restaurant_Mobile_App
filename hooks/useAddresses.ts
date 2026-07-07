import { useCallback } from 'react';

import { AddressModel } from '@/models/Address';
import { addressRepository } from '@/repositories/AddressRepository';
import { useAuth } from '@/hooks/useAuth';
import { useFirestoreData } from '@/hooks/useFirestoreData';

export type SaveDefaultAddressInput = {
  recipientName: string;
  phone: string;
  addressLine: string;
};

export function useAddresses() {
  const { userId } = useAuth();
  const loader = useCallback(async () => (userId ? addressRepository.listByUser(userId) : []), [userId]);
  const state = useFirestoreData<AddressModel[]>(`addresses:user:${userId ?? 'guest'}`, [], loader);
  const retry = state.retry;

  const saveDefaultAddress = useCallback(async (input: SaveDefaultAddressInput) => {
    if (!userId) {
      throw new Error('Sign in before saving a delivery address.');
    }

    const currentAddresses = await addressRepository.listByUser(userId);
    const existingDefault = currentAddresses.find((address) => address.isDefault) ?? currentAddresses[0];
    const timestamp = new Date().toISOString();

    if (existingDefault) {
      await addressRepository.update(existingDefault.id, {
        recipientName: input.recipientName.trim(),
        phone: input.phone.trim(),
        addressLine: input.addressLine.trim(),
        isDefault: true,
        updatedAt: timestamp,
      });
    } else {
      await addressRepository.create({
        userId,
        label: 'Home',
        recipientName: input.recipientName.trim(),
        phone: input.phone.trim(),
        addressLine: input.addressLine.trim(),
        city: 'Freetown',
        country: 'Sierra Leone',
        isDefault: true,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }

    await retry();
  }, [retry, userId]);

  return { ...state, saveDefaultAddress };
}
