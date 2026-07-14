import { useCallback, useMemo } from 'react';

import { UserModel, UserRole, UserStatus } from '@/models/User';
import { orderRepository } from '@/repositories/OrderRepository';
import { userRepository } from '@/repositories/UserRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';

export type CustomerSummary = {
  orderCount: number;
  totalSpending: number;
};

function emptyCustomerSummary(): CustomerSummary {
  return { orderCount: 0, totalSpending: 0 };
}

function normalizeUser(user: UserModel): UserModel {
  const username = user.username || user.email?.split('@')[0] || user.fullName || 'customer';
  return {
    ...user,
    fullName: user.fullName || user.email || 'Unnamed user',
    username,
    usernameLower: user.usernameLower || username.toLowerCase(),
    phone: user.phone || 'Phone pending',
    address: user.address || 'Address pending',
    role: user.role || 'customer',
    status: user.status || 'active',
    createdAt: user.createdAt || user.updatedAt || '',
  };
}

export function useAdminUsers(role?: UserRole | 'all') {
  const loader = useCallback(async () => {
    const users = (await userRepository.listAll()).map(normalizeUser);
    return role && role !== 'all' ? users.filter((user) => user.role === role) : users;
  }, [role]);
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

export function useAdminCustomerSummaries() {
  const loader = useCallback(async () => {
    const orders = await orderRepository.list();
    return orders.reduce<Record<string, CustomerSummary>>((summaries, order) => {
      const current = summaries[order.customerId] ?? emptyCustomerSummary();
      summaries[order.customerId] = {
        orderCount: current.orderCount + 1,
        totalSpending: current.totalSpending + order.total,
      };
      return summaries;
    }, {});
  }, []);

  return useFirestoreData<Record<string, CustomerSummary>>('admin-customer-summaries', {}, loader);
}

export function useAdminUserFilters(users: UserModel[], query: string, role: UserRole | 'all', status: UserStatus | 'all') {
  return useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return users.filter((user) => {
      const normalizedStatus = user.status === 'disabled' ? 'disabled' : user.status;
      const matchesRole = role === 'all' || user.role === role;
      const matchesStatus = status === 'all' || normalizedStatus === status;
      const source = [user.fullName, user.username, user.email, user.phone].join(' ').toLowerCase();
      return matchesRole && matchesStatus && (!normalizedQuery || source.includes(normalizedQuery));
    });
  }, [query, role, status, users]);
}
