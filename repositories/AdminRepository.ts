import { UserModel } from '@/models/User';
import { userRepository } from '@/repositories/UserRepository';

export class AdminRepository {
  getAdminProfile(userId: string): Promise<UserModel | null> {
    return userRepository.getById(userId).then((user) => (user?.role === 'admin' ? user : null));
  }

  isAdmin(userId: string): Promise<boolean> {
    return this.getAdminProfile(userId).then(Boolean);
  }
}

export const adminRepository = new AdminRepository();
