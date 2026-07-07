export const FIRESTORE_COLLECTIONS = {
  users: 'users',
  restaurants: 'restaurants',
  foods: 'foods',
  categories: 'categories',
  coupons: 'coupons',
  offers: 'offers',
  reviews: 'reviews',
  orders: 'orders',
  payments: 'payments',
  carts: 'carts',
  addresses: 'addresses',
  favorites: 'favorites',
  notifications: 'notifications',
  settings: 'settings',
} as const;

export const STORAGE_PATHS = {
  foodImages: 'food-images',
  restaurantImages: 'restaurant-images',
  profileImages: 'profile-images',
  reviewImages: 'review-images',
} as const;

export const APP_CONSTANTS = {
  minimumPasswordLength: 8,
  defaultCurrency: 'SLL',
  displayCurrencyPrefix: 'Le',
  defaultLocale: 'en-US',
} as const;

