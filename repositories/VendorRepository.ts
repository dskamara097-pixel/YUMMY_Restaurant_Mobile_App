import { VendorModel } from '@/models/Vendor';
import { FirestoreRepository } from '@/repositories/Repository';
import { FIRESTORE_COLLECTIONS } from '@/utils/constants';

export class VendorRepository extends FirestoreRepository<VendorModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.vendors);
  }

  getByUserId(userId: string) {
    return this.getById(userId);
  }

  saveProfile(profile: Omit<VendorModel, 'id' | 'createdAt'> & { id: string; createdAt?: string }) {
    return this.create({
      ...profile,
      createdAt: profile.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}

export const vendorRepository = new VendorRepository();
