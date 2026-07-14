import { useMemo } from 'react';

import { OrderModel } from '@/models/Order';
import { FoodModel } from '@/models/Food';

export function useVendorAnalytics(orders: OrderModel[], foods: FoodModel[]) {
  return useMemo(() => {
    const totalOrders = orders.length;
    const todayKey = new Date().toDateString();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const pendingOrders = orders.filter((order) => ['pending', 'pendingPaymentVerification', 'paymentConfirmed', 'paymentReceived', 'accepted', 'preparing', 'ready', 'waitingForRider', 'pickedUp', 'outForDelivery'].includes(order.status)).length;
    const preparingOrders = orders.filter((order) => order.status === 'preparing').length;
    const readyOrders = orders.filter((order) => order.status === 'ready').length;
    const outForDeliveryOrders = orders.filter((order) => order.status === 'outForDelivery' || order.status === 'pickedUp').length;
    const completedOrders = orders.filter((order) => order.status === 'delivered' || order.status === 'completed').length;
    const cancelledOrders = orders.filter((order) => order.status === 'cancelled').length;
    const todayOrders = orders.filter((order) => new Date(order.createdAt).toDateString() === todayKey);
    const salesTotal = orders
      .filter((order) => order.status === 'delivered' || order.status === 'completed')
      .reduce((sum, order) => sum + order.total, 0);
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
    const monthlyRevenue = orders
      .filter((order) => {
        const created = new Date(order.createdAt);
        return created.getMonth() === currentMonth && created.getFullYear() === currentYear;
      })
      .reduce((sum, order) => sum + order.total, 0);
    const availableFoods = foods.filter((food) => food.available).length;
    const foodCounts = new Map<string, number>();
    orders.forEach((order) => order.items.forEach((item) => {
      foodCounts.set(item.name, (foodCounts.get(item.name) ?? 0) + item.quantity);
    }));
    const mostPopularFood = [...foodCounts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? 'No sales yet';

    return {
      totalOrders,
      todayOrders: todayOrders.length,
      pendingOrders,
      preparingOrders,
      readyOrders,
      outForDeliveryOrders,
      completedOrders,
      cancelledOrders,
      salesTotal,
      todayRevenue,
      monthlyRevenue,
      menuItems: foods.length,
      availableFoods,
      mostPopularFood,
      averageRating: 0,
      averageOrderValue: completedOrders ? salesTotal / completedOrders : 0,
    };
  }, [foods, orders]);
}
