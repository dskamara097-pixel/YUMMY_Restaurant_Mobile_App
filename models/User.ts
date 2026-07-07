export type UserRole = 'customer' | 'vendor' | 'admin' | 'rider';

export type UserStatus = 'active' | 'disabled' | 'pending';

export interface UserModel {
  id: string;
  fullName: string;
  username: string;
  usernameLower: string;
  email?: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  defaultAddressId?: string;
  createdAt: string;
  updatedAt?: string;
}
