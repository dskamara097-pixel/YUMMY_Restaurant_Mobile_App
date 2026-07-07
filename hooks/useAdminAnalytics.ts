import { useCallback } from 'react';

import { analyticsRepository, AdminAnalyticsSummary } from '@/repositories/AnalyticsRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';

const emptyAnalytics: AdminAnalyticsSummary = {
  totalUsers: 0,
  totalCustomers: 0,
  totalVendors: 0,
  totalRiders: 0,
  totalRestaurants: 0,
  totalFoods: 0,
  totalOrders: 0,
  pendingOrders: 0,
  completedOrders: 0,
  cancelledOrders: 0,
  revenueSummary: 0,
  newUsers: 0,
};

export function useAnalytics() {
  const loader = useCallback(() => analyticsRepository.getPlatformSummary(), []);
  return useFirestoreData<AdminAnalyticsSummary>('admin-analytics', emptyAnalytics, loader);
}

export function useAdminDashboard() {
  return useAnalytics();
}

export function useReports() {
  return useAnalytics();
}
