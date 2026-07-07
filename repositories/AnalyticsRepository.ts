import { foodRepository } from '@/repositories/FoodRepository';
import { orderRepository } from '@/repositories/OrderRepository';
import { restaurantRepository } from '@/repositories/RestaurantRepository';
import { userRepository } from '@/repositories/UserRepository';

export type AdminAnalyticsSummary = {
  totalUsers: number;
  totalCustomers: number;
  totalVendors: number;
  totalRiders: number;
  totalRestaurants: number;
  totalFoods: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  revenueSummary: number;
  newUsers: number;
};

export class AnalyticsRepository {
  async getPlatformSummary(): Promise<AdminAnalyticsSummary> {
    const [users, restaurants, foods, orders] = await Promise.all([
      userRepository.listAll(),
      restaurantRepository.listAll(),
      foodRepository.listAll(),
      orderRepository.list(),
    ]);
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return {
      totalUsers: users.length,
      totalCustomers: users.filter((user) => user.role === 'customer').length,
      totalVendors: users.filter((user) => user.role === 'vendor').length,
      totalRiders: users.filter((user) => user.role === 'rider').length,
      totalRestaurants: restaurants.length,
      totalFoods: foods.length,
      totalOrders: orders.length,
      pendingOrders: orders.filter((order) => order.status === 'pending' || order.status === 'paymentReceived').length,
      completedOrders: orders.filter((order) => order.status === 'delivered').length,
      cancelledOrders: orders.filter((order) => order.status === 'cancelled').length,
      revenueSummary: orders.filter((order) => order.status === 'delivered').reduce((sum, order) => sum + order.total, 0),
      newUsers: users.filter((user) => new Date(user.createdAt).getTime() >= weekAgo).length,
    };
  }
}

export const analyticsRepository = new AnalyticsRepository();
