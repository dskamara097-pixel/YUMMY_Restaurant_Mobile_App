import { AddressModel, CategoryModel, CouponModel, FoodModel, NotificationModel, OfferModel, OrderModel, RestaurantModel, ReviewModel, UserModel } from '@/models';
import { FoodCategory, FoodItem, Restaurant } from '@/types';

const defaultCategory: FoodCategory = 'Local';

export function formatDeliveryTime(minutes?: number) {
  if (!minutes) return '25-40 min';
  const low = Math.max(10, minutes - 5);
  const high = minutes + 5;
  return `${low}-${high} min`;
}

export function categoryNameById(categories: CategoryModel[], categoryId?: string) {
  return categories.find((category) => category.id === categoryId)?.name ?? defaultCategory;
}

export function mapRestaurantModel(restaurant: RestaurantModel, categories: CategoryModel[] = []): Restaurant {
  const primaryCategoryId = restaurant.categoryIds[0];
  const categoryName = categoryNameById(categories, primaryCategoryId) as FoodCategory;

  return {
    id: restaurant.id,
    name: restaurant.name,
    category: categoryName,
    description: restaurant.description,
    logoUrl: restaurant.logoUrl ?? '',
    coverImageUrl: restaurant.coverImageUrl ?? '',
    rating: restaurant.rating,
    reviewsCount: restaurant.reviewsCount,
    deliveryTime: formatDeliveryTime(restaurant.deliveryTimeMinutes),
    distance: 'Distance pending',
    deliveryFee: restaurant.deliveryFee,
    featured: restaurant.rating >= 4.6,
    popular: restaurant.reviewsCount >= 25,
    createdAt: restaurant.createdAt,
    updatedAt: restaurant.updatedAt,
  };
}

export function mapFoodModel(food: FoodModel, restaurants: RestaurantModel[] = [], categories: CategoryModel[] = []): FoodItem {
  const restaurant = restaurants.find((item) => item.id === food.restaurantId);
  const category = categoryNameById(categories, food.categoryId) as FoodCategory;

  return {
    id: food.id,
    restaurantId: food.restaurantId,
    restaurantName: restaurant?.name ?? 'Restaurant',
    name: food.name,
    category,
    description: food.description,
    price: food.price,
    currency: food.currency,
    imageUrl: food.imageUrl ?? '',
    availability: food.available,
    featured: food.featured,
    popular: food.featured,
    recommended: food.featured,
    rating: restaurant?.rating,
    deliveryTime: formatDeliveryTime(restaurant?.deliveryTimeMinutes),
    ingredients: food.ingredients,
    createdAt: food.createdAt,
    updatedAt: food.updatedAt,
  };
}

export function mapCouponModel(coupon: CouponModel) {
  const discount = coupon.discountType === 'percentage'
    ? `${coupon.discountValue}% off`
    : `Le ${coupon.discountValue.toLocaleString('en-US')} off`;

  return {
    id: coupon.id,
    code: coupon.code,
    title: coupon.title,
    description: coupon.description,
    discount,
    expiryDate: coupon.expiresAt,
  };
}

export function mapOfferModel(offer: OfferModel) {
  return {
    id: offer.id,
    title: offer.title,
    description: offer.description,
    badgeLabel: offer.badgeLabel ?? offer.discountLabel,
    restaurantName: offer.restaurantName,
    discountLabel: offer.discountLabel,
    expiryDate: offer.expiresAt,
    featured: offer.featured,
  };
}

export function mapOrderStatus(status: OrderModel['status']) {
  const statusMap: Record<OrderModel['status'], string> = {
    pending: 'Pending',
    paymentReceived: 'Payment Received',
    preparing: 'Preparing',
    ready: 'Ready',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };

  return statusMap[status];
}

export function mapOrderModel(order: OrderModel, restaurants: RestaurantModel[] = []) {
  const restaurant = restaurants.find((item) => item.id === order.restaurantId);

  return {
    id: order.id,
    restaurantName: restaurant?.name ?? 'Restaurant',
    foodItems: order.items.map((item) => item.name),
    orderDate: order.createdAt,
    totalAmount: order.total,
    status: mapOrderStatus(order.status),
    deliveryAddress: order.deliveryAddressId,
  };
}

export function mapAddressModel(address: AddressModel) {
  return {
    id: address.id,
    label: address.label,
    recipient: address.recipientName,
    phone: address.phone,
    address: [address.addressLine, address.city, address.country].filter(Boolean).join(', '),
    isDefault: address.isDefault,
  };
}

export function mapNotificationModel(notification: NotificationModel) {
  return {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    time: notification.createdAt,
    type: notification.type,
    read: notification.read,
    orderId: notification.orderId,
  };
}

export function mapReviewModel(review: ReviewModel) {
  return {
    id: review.id,
    authorName: 'YUMMY Customer',
    rating: review.rating,
    comment: review.comment,
    helpfulCount: review.helpfulCount,
    imageCount: review.imageUrls?.length ?? 0,
    createdAt: review.createdAt,
    targetId: review.targetId,
  };
}

export function mapUserProfile(user: UserModel | null, authFallback: { displayName?: string | null; email?: string | null }) {
  return {
    fullName: user?.fullName ?? authFallback.displayName ?? 'YUMMY Customer',
    phone: user?.phone ?? 'Phone pending',
    email: user?.email ?? authFallback.email ?? 'Email pending',
    address: 'Address pending',
  };
}

