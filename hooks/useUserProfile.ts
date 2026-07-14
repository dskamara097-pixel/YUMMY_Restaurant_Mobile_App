import { useCallback, useMemo } from 'react';

import { UserModel } from '@/models/User';
import { userRepository } from '@/repositories/UserRepository';
import { useAuth } from '@/hooks/useAuth';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { sampleUserModel } from '@/utils/sampleModelFallbacks';

export type SaveUserProfileInput = {
  fullName: string;
  phone: string;
  username?: string;
  email?: string;
  address?: string;
};

export function useUserProfile() {
  const auth = useAuth();
  const initialProfile = useMemo(() => ({
    ...sampleUserModel,
    id: auth.userId ?? sampleUserModel.id,
    email: auth.email ?? sampleUserModel.email,
    fullName: auth.displayName ?? sampleUserModel.fullName,
  }), [auth.displayName, auth.email, auth.userId]);
  const loader = useCallback(async () => {
    if (!auth.userId) return initialProfile;

    return (await userRepository.getById(auth.userId)) ?? initialProfile;
  }, [auth.userId, initialProfile]);
  const state = useFirestoreData<UserModel | null>(`user-profile:${auth.userId ?? 'guest'}`, initialProfile, loader);
  const retry = state.retry;

  const saveProfile = useCallback(async (input: SaveUserProfileInput) => {
    if (!auth.userId) {
      throw new Error('Sign in before saving a Firestore profile.');
    }

    const existing = await userRepository.getById(auth.userId);
    const timestamp = new Date().toISOString();
    const username = input.username?.trim() || input.email?.split('@')[0] || auth.email?.split('@')[0] || 'customer';

    if (existing) {
      await userRepository.update(auth.userId, {
        fullName: input.fullName.trim(),
        phone: input.phone.trim(),
        username,
        usernameLower: username.toLowerCase(),
        email: input.email?.trim().toLowerCase() ?? auth.email ?? existing.email,
        address: input.address?.trim() || existing.address,
        updatedAt: timestamp,
      });
    } else {
      await userRepository.create({
        id: auth.userId,
        fullName: input.fullName.trim(),
        username,
        usernameLower: username.toLowerCase(),
        email: input.email?.trim().toLowerCase() ?? auth.email ?? undefined,
        phone: input.phone.trim(),
        address: input.address?.trim() || 'Address pending',
        role: 'customer',
        status: 'active',
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }

    await retry();
  }, [auth.email, auth.userId, retry]);

  return { ...state, saveProfile };
}
