import {
  sampleCartItems,
  sampleCoupons,
  sampleCustomerNotifications,
  sampleEnhancedOffers,
  sampleFoodReviews,
  sampleFoods,
  sampleOrderFees,
  samplePreviousOrders,
  sampleRestaurants,
  sampleRestaurantReviews,
  sampleSavedAddresses,
  sampleUserProfile,
} from '@/data/sampleData';
import type {
  AddressModel,
  CartModel,
  CategoryModel,
  CouponModel,
  FavoriteModel,
  FoodModel,
  NotificationModel,
  OfferModel,
  OrderModel,
  PaymentModel,
  ReviewModel,
  RestaurantModel,
  UserModel,
} from '@/models';
import type { OrderStatusModel } from '@/models/Order';
import type { PaymentStatusModel } from '@/models/Payment';
import type { RepositoryFilter, RepositoryQueryOptions } from '@/repositories/Repository';

const fallbackUserId = 'sample-customer';
const fallbackRestaurantId = 'restaurant-yummy-kitchen';
const fallbackCreatedAt = '2026-07-05T00:00:00.000Z';

function categoryIdFromName(name: string) {
  return `category-${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function readField(item: object, field: string) {
  return (item as Record<string, unknown>)[field];
}

function matchesFilter(item: object, filter: RepositoryFilter) {
  const value = readField(item, filter.field);
  const operator = filter.operator ?? '==';

  if (operator === 'array-contains') return Array.isArray(value) && value.includes(filter.value);
  if (operator === 'array-contains-any') return Array.isArray(value) && Array.isArray(filter.value) && filter.value.some((itemValue) => value.includes(itemValue));
  if (operator === 'in') return Array.isArray(filter.value) && filter.value.includes(value);
  if (operator === '!=') return value !== filter.value;
  if (operator === '<') return Number(value) < Number(filter.value);
  if (operator === '<=') return Number(value) <= Number(filter.value);
  if (operator === '>') return Number(value) > Number(filter.value);
  if (operator === '>=') return Number(value) >= Number(filter.value);
  return value === filter.value;
}

function previousOrderStatusToModel(status: string): OrderStatusModel {
  if (status === 'Payment Received') return 'paymentReceived';
  if (status === 'Preparing') return 'preparing';
  if (status === 'Ready') return 'ready';
  if (status === 'Delivered') return 'delivered';
  return 'pending';
}

function paymentStatusFromOrder(status: OrderStatusModel): PaymentStatusModel {
  return status === 'pending' || status === 'cancelled' ? 'pending' : 'paid';
}

export function applySampleQueryOptions<TItem extends object>(items: TItem[], options?: RepositoryQueryOptions) {
  let nextItems = [...items];

  options?.filters?.forEach((filter) => {
    nextItems = nextItems.filter((item) => matchesFilter(item, filter));
  });

  if (options?.searchText?.trim() && options.searchFields?.length) {
    const needle = options.searchText.trim().toLowerCase();
    nextItems = nextItems.filter((item) => options.searchFields?.some((field) => String(readField(item, field) ?? '').toLowerCase().includes(needle)));
  }

  options?.sort?.slice().reverse().forEach((sort) => {
    const direction = sort.direction === 'desc' ? -1 : 1;
    nextItems.sort((first, second) => String(readField(first, sort.field) ?? '').localeCompare(String(readField(second, sort.field) ?? '')) * direction);
  });

  return typeof options?.pageSize === 'number' ? nextItems.slice(0, options.pageSize) : nextItems;
}

export function hasFallbackData(value: unknown) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined;
}

export const sampleCategoryModels: CategoryModel[] = Array.from(new Set(sampleFoods.map((food) => food.category))).map((category, index) => ({
  id: categoryIdFromName(category),
  restaurantId: fallbackRestaurantId,
  name: category,
  description: `${category} meals from YUMMY Kitchen`,
  iconName: 'restaurant-outline',
  active: true,
  sortOrder: index + 1,
  createdAt: fallbackCreatedAt,
}));

export const sampleRestaurantModels: RestaurantModel[] = sampleRestaurants.map((restaurant) => ({
  id: restaurant.id,
  name: 'YUMMY Kitchen',
  description: 'Taste the tradition. Love every bite.',
  categoryIds: ['category-local'],
  logoUrl: restaurant.logoUrl,
  coverImageUrl: restaurant.coverImageUrl,
  rating: restaurant.rating,
  reviewsCount: restaurant.reviewsCount,
  deliveryTimeMinutes: 35,
  deliveryFee: restaurant.deliveryFee,
  active: true,
  status: 'approved',
  createdAt: restaurant.createdAt,
  updatedAt: restaurant.updatedAt,
}));

export const sampleFoodModels: FoodModel[] = sampleFoods.map((food) => ({
  id: food.id,
  restaurantId: fallbackRestaurantId,
  categoryId: categoryIdFromName(food.category),
  name: food.name,
  description: food.description,
  price: food.price,
  currency: food.currency,
  imageUrl: food.imageUrl,
  ingredients: food.ingredients ?? [],
  available: food.availability,
  featured: food.featured,
  createdAt: food.createdAt,
  updatedAt: food.updatedAt,
}));

export const sampleCartModel: CartModel = {
  id: 'cart-sample-customer',
  customerId: fallbackUserId,
  restaurantId: fallbackRestaurantId,
  items: sampleCartItems.map((item) => ({
    foodId: item.foodId,
    restaurantId: fallbackRestaurantId,
    restaurantName: 'YUMMY Kitchen',
    name: item.foodName,
    unitPrice: item.unitPrice,
    quantity: item.quantity,
    lineTotal: item.unitPrice * item.quantity,
    imageUrl: item.imageUrl,
  })),
  subtotal: sampleCartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  updatedAt: fallbackCreatedAt,
};

export const sampleOrderModels: OrderModel[] = samplePreviousOrders.map((order, index) => {
  const status = previousOrderStatusToModel(order.status);
  const items = sampleCartModel.items.slice(0, index === 0 ? 2 : 1);
  const subtotal = Math.max(order.totalAmount - sampleOrderFees.deliveryFee - sampleOrderFees.serviceFee + sampleOrderFees.discount, 0);

  return {
    id: order.id,
    customerId: fallbackUserId,
    restaurantId: fallbackRestaurantId,
    items,
    subtotal,
    deliveryFee: sampleOrderFees.deliveryFee,
    serviceFee: sampleOrderFees.serviceFee,
    discount: sampleOrderFees.discount,
    total: order.totalAmount,
    status,
    paymentStatus: paymentStatusFromOrder(status),
    paymentId: `payment-${order.id.toLowerCase()}`,
    deliveryAddressId: 'address-home',
    notes: 'Leave at gate if needed.',
    createdAt: order.orderDate,
    updatedAt: order.orderDate,
  };
});

export const sampleNotificationModels: NotificationModel[] = sampleCustomerNotifications.map((notification) => ({
  id: notification.id,
  userId: fallbackUserId,
  title: notification.title,
  message: notification.message,
  type: notification.type,
  read: notification.read,
  orderId: notification.orderId,
  createdAt: notification.time,
}));

export const sampleAddressModels: AddressModel[] = sampleSavedAddresses.map((address) => ({
  id: address.id,
  userId: fallbackUserId,
  label: address.label,
  recipientName: address.recipient,
  phone: address.phone,
  addressLine: address.address,
  city: 'Freetown',
  country: 'Sierra Leone',
  isDefault: address.isDefault,
  createdAt: fallbackCreatedAt,
}));

export const sampleCouponModels: CouponModel[] = sampleCoupons.map((coupon) => ({
  id: coupon.id,
  restaurantId: fallbackRestaurantId,
  restaurantName: coupon.restaurantName ?? 'YUMMY Kitchen',
  code: coupon.code,
  title: coupon.title,
  description: coupon.description,
  discountType: coupon.discount.includes('%') ? 'percentage' : 'fixed',
  discountValue: Number(coupon.discount.match(/\d+/)?.[0] ?? 0),
  minimumOrderAmount: 0,
  expiresAt: coupon.expiryDate,
  active: true,
  createdAt: fallbackCreatedAt,
}));

export const sampleOfferModels: OfferModel[] = sampleEnhancedOffers.map((offer) => ({
  id: offer.id,
  title: offer.title,
  description: offer.description,
  badgeLabel: offer.label,
  restaurantId: fallbackRestaurantId,
  restaurantName: 'YUMMY Kitchen',
  discountLabel: offer.label,
  expiresAt: offer.expiresIn,
  featured: Boolean(offer.featured),
  active: true,
  createdAt: fallbackCreatedAt,
}));

export const sampleReviewModels: ReviewModel[] = [...sampleRestaurantReviews, ...sampleFoodReviews].map((review) => ({
  id: review.id,
  targetId: review.targetId,
  targetType: review.targetId.startsWith('food-') ? 'food' : 'restaurant',
  userId: fallbackUserId,
  rating: review.rating,
  comment: review.comment,
  imageUrls: Array.from({ length: review.imageCount ?? 0 }, (_, index) => `placeholder://review-${index + 1}`),
  helpfulCount: review.helpfulCount,
  moderationStatus: 'visible',
  createdAt: review.date,
}));

export const sampleFavoriteModels: FavoriteModel[] = [
  { id: 'favorite-yummy-kitchen', userId: fallbackUserId, targetId: fallbackRestaurantId, targetType: 'restaurant', createdAt: fallbackCreatedAt },
  { id: 'favorite-jollof-rice-bowl', userId: fallbackUserId, targetId: 'food-jollof-rice-bowl', targetType: 'food', createdAt: fallbackCreatedAt },
  { id: 'favorite-hub-classic-burger', userId: fallbackUserId, targetId: 'food-hub-classic-burger', targetType: 'food', createdAt: fallbackCreatedAt },
];

export const samplePaymentModels: PaymentModel[] = sampleOrderModels.map((order) => ({
  id: order.paymentId ?? `payment-${order.id.toLowerCase()}`,
  orderId: order.id,
  userId: fallbackUserId,
  restaurantId: fallbackRestaurantId,
  method: 'dummyMobileMoney',
  status: order.paymentStatus,
  amount: order.total,
  currency: 'SLE',
  transactionReference: `YUMMY-${order.id}`,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
}));

export const sampleUserModel: UserModel = {
  id: fallbackUserId,
  fullName: sampleUserProfile.fullName,
  username: 'customer',
  usernameLower: 'customer',
  email: sampleUserProfile.email,
  phone: sampleUserProfile.phone,
  role: 'customer',
  status: 'active',
  defaultAddressId: 'address-home',
  createdAt: fallbackCreatedAt,
};
