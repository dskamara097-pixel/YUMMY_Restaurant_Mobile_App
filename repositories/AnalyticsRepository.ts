import { foodRepository } from '@/repositories/FoodRepository';
import { orderRepository } from '@/repositories/OrderRepository';
import { paymentRepository } from '@/repositories/PaymentRepository';
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
  pendingPaymentApprovals: number;
  pendingOrders: number;
  ordersPreparing: number;
  ordersReady: number;
  ordersOutForDelivery: number;
  deliveredOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  revenueSummary: number;
  newUsers: number;
};

async function safeList<T>(loader: () => Promise<T[]>) {
  try {
    return await loader();
  } catch {
    return [];
  }
}

export class AnalyticsRepository {
  async getPlatformSummary(): Promise<AdminAnalyticsSummary> {
    const [users, restaurants, foods, orders, payments] = await Promise.all([
      safeList(() => userRepository.listAll()),
      safeList(() => restaurantRepository.listAll()),
      safeList(() => foodRepository.listAll()),
      safeList(() => orderRepository.list()),
      safeList(() => paymentRepository.list()),
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
      pendingPaymentApprovals: payments.filter((payment) => payment.status === 'awaitingApproval').length,
      pendingOrders: orders.filter((order) => ['pending', 'pendingPaymentVerification', 'paymentConfirmed', 'paymentReceived', 'accepted', 'waitingForRider', 'pickedUp'].includes(order.status)).length,
      ordersPreparing: orders.filter((order) => order.status === 'preparing').length,
      ordersReady: orders.filter((order) => order.status === 'ready').length,
      ordersOutForDelivery: orders.filter((order) => order.status === 'outForDelivery').length,
      deliveredOrders: orders.filter((order) => order.status === 'delivered').length,
      completedOrders: orders.filter((order) => order.status === 'completed').length,
      cancelledOrders: orders.filter((order) => order.status === 'cancelled').length,
      revenueSummary: orders.filter((order) => order.status === 'delivered' || order.status === 'completed').reduce((sum, order) => sum + order.total, 0),
      newUsers: users.filter((user) => new Date(user.createdAt || 0).getTime() >= weekAgo).length,
    };
  }
}

export const analyticsRepository = new AnalyticsRepository();
