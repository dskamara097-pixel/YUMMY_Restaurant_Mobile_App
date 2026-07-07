import { useMemo } from 'react';

import { OrderModel } from '@/models/Order';
import { FoodModel } from '@/models/Food';

export function useVendorAnalytics(orders: OrderModel[], foods: FoodModel[]) {
  return useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((order) => order.status === 'pending' || order.status === 'paymentReceived').length;
    const completedOrders = orders.filter((order) => order.status === 'delivered').length;
    const cancelledOrders = orders.filter((order) => order.status === 'cancelled').length;
    const salesTotal = orders
      .filter((order) => order.status === 'delivered')
      .reduce((sum, order) => sum + order.total, 0);
    const availableFoods = foods.filter((food) => food.available).length;

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      salesTotal,
      menuItems: foods.length,
      availableFoods,
      averageOrderValue: completedOrders ? salesTotal / completedOrders : 0,
    };
  }, [foods, orders]);
}
