import { AddressModel } from '@/models/Address';
import { FirestoreRepository } from '@/repositories/Repository';
import { FIRESTORE_COLLECTIONS } from '@/utils/constants';

export class AddressRepository extends FirestoreRepository<AddressModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.addresses);
  }

  listByUser(userId: string) {
    return this.list({ filters: [{ field: 'userId', value: userId }] })
      .then((addresses) => addresses.sort((left, right) => Number(right.isDefault) - Number(left.isDefault)
        || new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()));
  }
}

export const addressRepository = new AddressRepository();
