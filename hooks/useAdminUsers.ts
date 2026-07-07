import { useCallback, useMemo } from 'react';

import { UserModel, UserRole, UserStatus } from '@/models/User';
import { userRepository } from '@/repositories/UserRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';

export function useAdminUsers(role?: UserRole | 'all') {
  const loader = useCallback(async () => (role && role !== 'all' ? userRepository.listByRole(role) : userRepository.listAll()), [role]);
  const state = useFirestoreData<UserModel[]>(`admin-users:${role ?? 'all'}`, [], loader);
  const retry = state.retry;

  const updateStatus = useCallback(async (userId: string, status: UserStatus) => {
    await userRepository.updateStatus(userId, status);
    await retry();
  }, [retry]);

  const updateRole = useCallback(async (userId: string, nextRole: UserRole) => {
    await userRepository.updateRole(userId, nextRole);
    await retry();
  }, [retry]);

  return { ...state, updateStatus, updateRole };
}

export function useAdminUserFilters(users: UserModel[], query: string, role: UserRole | 'all', status: UserStatus | 'all') {
  return useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesRole = role === 'all' || user.role === role;
      const matchesStatus = status === 'all' || user.status === status;
      const source = [user.fullName, user.username, user.email, user.phone, user.role].join(' ').toLowerCase();
      return matchesRole && matchesStatus && (!normalizedQuery || source.includes(normalizedQuery));
    });
  }, [query, role, status, users]);
}
