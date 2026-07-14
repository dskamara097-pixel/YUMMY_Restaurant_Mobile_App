import { UserModel, UserRole, UserStatus } from '@/models/User';
import { FirestoreRepository } from '@/repositories/Repository';
import { FIRESTORE_COLLECTIONS } from '@/utils/constants';

export type CustomerProfileInput = {
  id: string;
  fullName: string;
  username?: string;
  email?: string | null;
  phone?: string;
  address?: string;
};

function sortUsersByCreatedAt(users: UserModel[]) {
  return [...users].sort((left, right) => {
    const leftTime = new Date(left.createdAt ?? 0).getTime();
    const rightTime = new Date(right.createdAt ?? 0).getTime();
    return rightTime - leftTime;
  });
}

function normalizeUsername(input: CustomerProfileInput) {
  return input.username?.trim()
    || input.email?.split('@')[0]
    || input.fullName.trim().toLowerCase().replace(/\s+/g, '.')
    || 'customer';
}

export class UserRepository extends FirestoreRepository<UserModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.users);
  }

  listAll() {
    return this.list().then(sortUsersByCreatedAt);
  }

  listByRole(role: UserRole) {
    return this.listAll().then((users) => users.filter((user) => user.role === role));
  }

  updateStatus(userId: string, status: UserStatus) {
    return this.update(userId, { status });
  }

  updateRole(userId: string, role: UserRole) {
    return this.update(userId, { role });
  }

  getByUsername(username: string) {
    return this.list({ filters: [{ field: 'usernameLower', value: username.trim().toLowerCase() }], pageSize: 1 })
      .then((users) => users[0] ?? null);
  }

  getByEmail(email: string) {
    return this.list({ filters: [{ field: 'email', value: email.trim().toLowerCase() }], pageSize: 1 })
      .then((users) => users[0] ?? null);
  }

  async ensureCustomerProfile(input: CustomerProfileInput) {
    const existing = await this.getById(input.id);
    const timestamp = new Date().toISOString();
    const username = normalizeUsername(input);
    const profile = {
      fullName: input.fullName.trim() || existing?.fullName || input.email || 'YUMMY Customer',
      username,
      usernameLower: username.toLowerCase(),
      email: input.email?.trim().toLowerCase() ?? existing?.email,
      phone: input.phone?.trim() || existing?.phone || 'Phone pending',
      address: input.address?.trim() || existing?.address || 'Address pending',
      role: 'customer' as const,
      status: existing?.status ?? 'active' as const,
      updatedAt: timestamp,
    };

    if (existing) {
      return this.update(input.id, profile);
    }

    return this.create({
      id: input.id,
      ...profile,
      createdAt: timestamp,
    });
  }

  async ensureVendorUserProfile(input: CustomerProfileInput) {
    const timestamp = new Date().toISOString();
    const username = normalizeUsername(input);
    const existing = await this.getById(input.id);
    const payload = {
      fullName: input.fullName.trim() || existing?.fullName || input.email || 'Vendor Owner',
      username,
      usernameLower: username.toLowerCase(),
      email: input.email?.trim().toLowerCase() ?? existing?.email,
      phone: input.phone?.trim() || existing?.phone || 'Phone pending',
      address: input.address?.trim() || existing?.address || 'Address pending',
      role: 'vendor' as const,
      status: existing?.status ?? 'active' as const,
      updatedAt: timestamp,
    };

    if (existing) {
      return this.update(input.id, payload);
    }

    return this.create({
      id: input.id,
      ...payload,
      createdAt: timestamp,
    });
  }
}

export const userRepository = new UserRepository();
