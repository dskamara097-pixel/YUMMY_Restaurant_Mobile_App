import { UserModel, UserRole, UserStatus } from '@/models/User';
import { FirestoreRepository } from '@/repositories/Repository';
import { FIRESTORE_COLLECTIONS } from '@/utils/constants';

export class UserRepository extends FirestoreRepository<UserModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.users);
  }

  listAll() {
    return this.list({ sort: [{ field: 'createdAt', direction: 'desc' }] });
  }

  listByRole(role: UserRole) {
    return this.list({ filters: [{ field: 'role', value: role }], sort: [{ field: 'createdAt', direction: 'desc' }] });
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
}

export const userRepository = new UserRepository();
