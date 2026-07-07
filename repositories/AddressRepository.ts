import { AddressModel } from '@/models/Address';
import { FirestoreRepository } from '@/repositories/Repository';
import { FIRESTORE_COLLECTIONS } from '@/utils/constants';

export class AddressRepository extends FirestoreRepository<AddressModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.addresses);
  }

  listByUser(userId: string) {
    return this.list({ filters: [{ field: 'userId', value: userId }], sort: [{ field: 'isDefault', direction: 'desc' }, { field: 'createdAt', direction: 'desc' }] });
  }
}

export const addressRepository = new AddressRepository();
